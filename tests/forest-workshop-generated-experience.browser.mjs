import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-generated-"));
let browser;
try {
  const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {createController} from ${JSON.stringify(join(client, "app/controller.ts"))}; import {loadGameFont} from ${JSON.stringify(join(client, "app/font.ts"))}; window.createController=createController;window.loadGameFont=loadGameFont;`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    platform: "browser",
    format: "iife",
    logLevel: "silent",
    plugins: [
      {
        name: "host",
        setup(b) {
          b.onResolve({ filter: /^marinara:host$/ }, () => ({ path: "host", namespace: "test" }));
          b.onLoad({ filter: /.*/, namespace: "test" }, () => ({
            contents:
              "export const host={api:{api:{get:(...a)=>window.mockApi.get(...a),post:(...a)=>window.mockApi.post(...a)},getApiErrorMessage:(_e,f)=>f}};",
            loader: "js",
          }));
        },
      },
    ],
  });
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const font = JSON.parse(await readFile("packages/forest-workshop/assets/fonts/jua.json", "utf8"));
  await page.setContent("<html><body></body></html>");
  await page.evaluate((font) => {
    const now = "2026-11-03T12:00:00.000Z";
    const activity = { id: "activity-one", residentId: "resident", mailId: "result-one", summary: "숲길을 살펴봤다" };
    const result = {
      id: "result-one",
      title: "활동 결과",
      sender: "공방",
      createdAt: now,
      body: "활동 완료",
      readAt: null,
      archived: false,
    };
    window.view = {
      worldId: "world-one",
      revision: 1,
      updatedAt: now,
      state: {
        worldId: "world-one",
        settings: { worldName: "숲", playerNickname: "숲손" },
        wallet: { gold: 0, tickets: 0, tokens: 0 },
        inventory: {},
        progress: { starterResidentId: "resident" },
        residents: { resident: { residentId: "resident", displayName: "다람", recruited: true, profileVersion: 2 } },
        pairs: {},
        production: { facilities: {}, reports: [], activity: { lastAbsence: null } },
        stories: { pairs: {}, expedition: null },
        activities: { running: null, completed: [activity] },
        mailbox: { letters: [result] },
      },
    };
    window.profileResponses = {};
    window.calls = [];
    window.mockApi = {
      get: async (path) => {
        if (path.includes("fonts/jua.json")) return font;
        if (path.includes("/state?")) return { ...window.view, content: {} };
        if (path.includes("/sources/preview"))
          return { summary: "원본", snapshot: {}, talent: { field: "gather", talentId: "steady" } };
        if (path.includes("/sources?")) return { sources: [] };
        throw new Error(path);
      },
      post: async (path, body) => {
        window.calls.push({ path, body });
        if (path.endsWith("/rebuild-suggestion"))
          return new Promise((resolve) => {
            window.profileResponses[body.source.id] = resolve;
          });
        if (path.endsWith("/mail/generate")) {
          const letter = {
            ...result,
            id: "resident-activity-one",
            sender: "다람",
            title: "다람의 편지",
            body: "숲손님, 그렇군요.",
          };
          window.view = {
            ...window.view,
            revision: 2,
            state: { ...window.view.state, mailbox: { letters: [letter, result] } },
          };
          return { state: window.view.state, revision: 2, result: { id: letter.id } };
        }
        if (path.endsWith("/commands"))
          return { state: window.view.state, revision: 3, result: { id: body.payload.id } };
        throw new Error(path);
      },
    };
  }, font);
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(async () => {
    window.controller = window.createController();
    await window.controller.openWorld("world-one");
  });
  await page.waitForFunction(() =>
    window.controller.store
      .get()
      .world.value.state.mailbox.letters.some((letter) => letter.id === "resident-activity-one"),
  );
  assert.equal(
    await page.evaluate(() => window.calls.filter((call) => call.path.endsWith("/mail/generate")).length),
    1,
    "completion automatically prepares one letter",
  );
  assert.equal(
    await page.evaluate(() => window.controller.store.get().world.value.state.mailbox.letters[0].readAt),
    null,
    "automatic preparation does not mark mail read",
  );
  await page.evaluate(async () => {
    window.controller.openMailbox();
    await window.controller.openLetter("result-one");
  });
  assert.equal(
    await page.evaluate(() => window.controller.store.get().sheet.id),
    "resident-activity-one",
    "opening a result presents the completed character letter",
  );
  await page.evaluate(() => {
    window.controller.openRegister();
    window.first = window.controller.chooseSource({ id: "first", kind: "character", name: "첫 주민" });
  });
  await page.waitForFunction(() => window.profileResponses.first);
  await page.evaluate(() => {
    window.second = window.controller.chooseSource({ id: "second", kind: "character", name: "둘째 주민" });
  });
  await page.waitForFunction(() => window.profileResponses.second);
  await page.evaluate(async () => {
    window.profileResponses.second({ suggestion: "두 번째 주민의 공방 프로필" });
    await window.second;
    window.profileResponses.first({ suggestion: "오래된 첫 번째 응답" });
    await window.first;
  });
  assert.equal(
    await page.evaluate(() => window.controller.store.get().register.draft),
    "두 번째 주민의 공방 프로필",
    "late profile response cannot overwrite another selection",
  );
  await page.evaluate(() => {
    window.third = window.controller.chooseSource({ id: "third", kind: "character", name: "셋째 주민" });
  });
  await page.waitForFunction(() => window.profileResponses.third);
  await page.evaluate(async () => {
    window.controller.setDraft("직접 수정한 설정");
    window.profileResponses.third({ suggestion: "자동 생성 설정" });
    await window.third;
  });
  assert.equal(
    await page.evaluate(() => window.controller.store.get().register.draft),
    "직접 수정한 설정",
    "generation never overwrites typing",
  );
  await page.evaluate(() => window.loadGameFont());
  assert.equal(
    await page.evaluate(() => [...document.fonts].some((face) => face.family === "Jua" && face.status === "loaded")),
    true,
    "bundled licensed Jua font actually loads",
  );
  // A slow/failed generation belongs to its pair, never hides or resets the other selection.
  await page.evaluate(() => {
    window.planJobs = {};
    window.planCalls = [];
    const overview = { revision: 1, pairs: [{ pairId: "pair-A" }, { pairId: "pair-B" }] };
    const oldGet = window.mockApi.get,
      oldPost = window.mockApi.post;
    window.mockApi.get = async (path) => (path.includes("/stories?") ? overview : oldGet(path));
    window.mockApi.post = async (path, body) => {
      if (!path.endsWith("/stories/prepare")) return oldPost(path, body);
      window.planCalls.push(body.pairId);
      return new Promise((resolve, reject) => {
        window.planJobs[body.pairId] = { resolve: () => resolve(overview), reject };
      });
    };
    window.view.state.pairs = {
      "pair-A": { residentIds: ["resident", "other"], archived: false },
      "pair-B": { residentIds: ["resident", "third"], archived: false },
    };
    window.controller.store.set({
      world: { state: "ready", value: window.view },
      route: "home",
      explore: { ...window.controller.store.get().explore, tab: "story", pairId: "pair-A", overview: null },
    });
    window.controller.navigate("explore");
  });
  await page.waitForFunction(() => window.planJobs["pair-A"]);
  assert.equal(await page.evaluate(() => window.controller.store.get().explore.overview.state), "ready");
  await page.evaluate(() => window.controller.selectStoryPair("pair-B"));
  await page.waitForFunction(() => window.planJobs["pair-B"]);
  await page.evaluate(() => window.planJobs["pair-A"].resolve());
  await page.waitForTimeout(20);
  assert.equal(await page.evaluate(() => window.controller.store.get().explore.pairId), "pair-B");
  await page.evaluate(() => window.planJobs["pair-B"].reject(new Error("model unavailable")));
  await page.waitForFunction(() => window.controller.store.get().explore.planError?.pairId === "pair-B");
  assert.equal(
    await page.evaluate(() => window.controller.store.get().explore.overview.state),
    "ready",
    "failed B keeps the pair chooser usable",
  );
  await page.evaluate(() => window.controller.retryStoryPlan());
  await page.waitForFunction(() => window.planCalls.filter((id) => id === "pair-B").length === 2);
  await page.evaluate(() => window.planJobs["pair-B"].resolve());
  await page.waitForFunction(() => !window.controller.store.get().explore.preparingPairId);
  assert.equal(await page.evaluate(() => window.controller.store.get().explore.pairId), "pair-B");
  assert.equal(await page.evaluate(() => window.controller.store.get().explore.planError), null);
  console.log("Automatic profile/letter flow, late replies, preserved edits and bundled Jua: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
