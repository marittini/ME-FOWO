// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-worlds-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderWorldsScreen } from ${JSON.stringify(join(client, "screens/worlds-screen.ts"))};\nimport { createController } from ${JSON.stringify(join(client, "app/controller.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderWorldsScreen = renderWorldsScreen; window.createController = createController; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
            contents: "export const host = window.__TEST_HOST__ ?? {};",
            loader: "js",
          }));
        },
      },
    ],
  });
  browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const path = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    await route.fulfill({
      contentType: "image/webp",
      body: await readFile(resolve("packages/forest-workshop/assets", path)),
    });
  });
  await page.route("http://forest.test/", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<meta name="viewport" content="width=device-width, initial-scale=1"><div id="host" style="height:740px;width:390px"></div>',
    }),
  );
  await page.goto("http://forest.test/");
  await page.evaluate(() => {
    window.__TEST_HOST__ = {
      api: {
        api: { get: async () => ({}), post: async () => ({}), delete: async () => ({ deleted: true }) },
        getApiErrorMessage: (_error, fallback) => fallback,
      },
    };
  });
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const worlds = Array.from({ length: 5 }, (_, i) => ({
      worldId: String(i),
      worldName: `세계 ${i}`,
      updatedAt: "2026-10-28",
      readable: i !== 4,
    }));
    window.testState = {
      route: "worlds",
      worlds: { state: "ready", value: worlds },
      world: null,
      restore: null,
      busy: {},
      artReady: [
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
        "backgrounds/workshop-base-spring.webp",
      ],
      seasonChoice: "spring",
      sheet: null,
      notice: null,
    };
    window.testController = {
      setWorldsPage(page) {
        window.testState.worldsPage = page;
        window.testRender();
      },
      rememberWorldDraft(draft) {
        window.testState.worldDraft = draft;
      },
      rememberWorldCreateOpen(open) {
        window.testState.worldCreateOpen = open;
      },
      openWorld(id) {
        window.openedWorld = id;
      },
      requestWorldDeletion(id) {
        window.testState.deletingWorldId = id;
        window.testState.deleteWorldError = undefined;
        window.testRender();
      },
      cancelWorldDeletion() {
        window.testState.deletingWorldId = undefined;
        window.testRender();
      },
      confirmWorldDeletion() {},
      createWorld() {},
      loadWorlds() {},
      selectRestoreFile() {},
      confirmRestore() {},
      navigate() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderWorldsScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  assert.equal(await page.getByText("세계 0", { exact: true }).isVisible(), true);
  assert.equal(await page.getByText("세계 2", { exact: true }).count(), 0);
  await page.getByText("새 세계 만들기", { exact: true }).first().click();
  await page.getByLabel("세계 이름").fill("새 공방");
  await page.getByLabel("내 닉네임").fill("관리자");
  await page.getByRole("button", { name: "다음", exact: true }).click();
  assert.equal(await page.getByLabel("세계 이름").inputValue(), "새 공방");
  assert.equal(await page.getByLabel("내 닉네임").inputValue(), "관리자");
  await page.getByRole("button", { name: "이전", exact: true }).click();
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await page.getByRole("button", { name: /세계 2 마지막 저장/ }).click();
  assert.equal(await page.evaluate(() => window.openedWorld), "2");
  await page.getByRole("button", { name: "이전", exact: true }).click();
  await page.getByRole("button", { name: "세계 0 삭제" }).click();
  assert.equal(
    await page
      .getByRole("dialog", { name: "세계 삭제" })
      .getByText(/‘세계 0’ 세계와 그 안의 주민 및 이야기/)
      .isVisible(),
    true,
  );
  assert.equal(await page.getByText(/원본 캐릭터·페르소나 카드와 갤러리 그림은 삭제되지 않습니다/).isVisible(), true);
  await page.getByRole("dialog", { name: "세계 삭제" }).getByRole("button", { name: "닫기" }).click();
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page.getByRole("button", { name: "다음", exact: true }).click();
  await page.getByRole("button", { name: "다음", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "세계 4 삭제" }).isEnabled(), true);
  await page.getByRole("button", { name: "세계 4 삭제" }).click();
  assert.equal(await page.getByRole("dialog", { name: "세계 삭제" }).isVisible(), true);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.locator("#host").evaluate((host) => {
    host.style.width = "320px";
  });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const deleteDialog = page.getByRole("dialog", { name: "세계 삭제" });
  const dialogBox = await deleteDialog.boundingBox();
  const deleteButtonBox = await deleteDialog.getByRole("button", { name: "세계 삭제" }).boundingBox();
  assert.ok(dialogBox && dialogBox.x >= 0 && dialogBox.x + dialogBox.width <= 320);
  assert.ok(
    deleteButtonBox &&
      deleteButtonBox.x >= dialogBox.x &&
      deleteButtonBox.x + deleteButtonBox.width <= dialogBox.x + dialogBox.width,
  );
  await page.evaluate(async () => {
    for (const path of ["ui/paper-panel.webp", "ui/primary-button.webp", "ui/title-sign.webp"]) {
      const image = new Image();
      image.src = `/api/capability-packages/forest-workshop/assets/assets/${path}`;
      await image.decode();
    }
  });
  await deleteDialog.screenshot({ path: "/tmp/fw-world-delete.png" });

  const controllerChecks = await page.evaluate(async () => {
    const makeWorlds = (ids) => ({
      state: "ready",
      value: ids.map((worldId) => ({ worldId, worldName: worldId, updatedAt: "2026-10-28", readable: false })),
    });
    const view = (worldId) => ({ worldId, revision: 1, updatedAt: "2026-10-28", state: {} });
    const set = (controller, ids, active = null) =>
      controller.store.set({
        route: "worlds",
        worlds: makeWorlds(ids),
        world: active ? { state: "ready", value: view(active) } : null,
      });
    const create = () => window.createController();

    let controller = create();
    set(controller, ["active", "other"], "active");
    window.__TEST_HOST__.api.api.delete = async () => ({ deleted: true });
    controller.requestWorldDeletion("other");
    await controller.confirmWorldDeletion();
    const nonactivePreserved =
      controller.store.get().world?.state === "ready" && controller.store.get().world.value.worldId === "active";

    controller = create();
    set(controller, ["active"], "active");
    localStorage.setItem("forest-workshop:last-world", "active");
    controller.requestWorldDeletion("active");
    await controller.confirmWorldDeletion();
    const activeCleared =
      controller.store.get().world === null &&
      controller.store.get().route === "worlds" &&
      localStorage.getItem("forest-workshop:last-world") === null;

    controller = create();
    set(controller, ["active"], "active");
    window.__TEST_HOST__.api.api.delete = async () => {
      throw new Error("delete failed");
    };
    controller.requestWorldDeletion("active");
    await controller.confirmWorldDeletion();
    const failureKeptWorld =
      controller.store.get().world?.state === "ready" &&
      Boolean(controller.store.get().deleteWorldError) &&
      controller.store.get().worlds.state === "ready" &&
      controller.store.get().worlds.value.length === 1;
    controller.cancelWorldDeletion();
    const cancelWasSafe =
      controller.store.get().world?.state === "ready" && controller.store.get().deletingWorldId === undefined;

    controller = create();
    set(controller, ["late"]);
    let resolveOpen;
    window.__TEST_HOST__.api.api.delete = async () => ({ deleted: true });
    window.__TEST_HOST__.api.api.get = () =>
      new Promise((resolve) => {
        resolveOpen = resolve;
      });
    const opening = controller.openWorld("late");
    controller.requestWorldDeletion("late");
    await controller.confirmWorldDeletion();
    resolveOpen({ ...view("late"), content: {} });
    await opening;
    const lateDeletedWorldStayedGone =
      controller.store.get().world === null && controller.store.get().route === "worlds";
    return { nonactivePreserved, activeCleared, failureKeptWorld, cancelWasSafe, lateDeletedWorldStayedGone };
  });
  assert.deepEqual(controllerChecks, {
    nonactivePreserved: true,
    activeCleared: true,
    failureKeptWorld: true,
    cancelWasSafe: true,
    lateDeletedWorldStayedGone: true,
  });
  console.log("World pagination, deletion confirmation, controller deletion safety, and narrow dialog layout: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
