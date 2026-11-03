import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const temp = await mkdtemp(join(tmpdir(), "forest-home-motion-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import ${JSON.stringify(join(client, "client-entry.ts"))};\nimport { renderHomeScene } from ${JSON.stringify(join(client, "screens/home/home-scene.ts"))};\nimport { renderTopBar } from ${JSON.stringify(join(client, "screens/chrome/top-bar.ts"))};\nimport { compactWorkReport } from ${JSON.stringify(join(client, "screens/home/work-report.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES, HOME_REACTION_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nwindow.renderTopBar=renderTopBar;window.renderHomeScene=renderHomeScene;window.compactWorkReport=compactWorkReport;window.fwStyles=STYLES+RESIDENT_STYLES+ART_STYLES+HOME_REACTION_STYLES;`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    format: "iife",
    platform: "browser",
    logLevel: "silent",
    plugins: [
      {
        name: "host",
        setup(b) {
          b.onResolve({ filter: /^marinara:host$/ }, () => ({ path: "host", namespace: "test" }));
          b.onLoad({ filter: /.*/, namespace: "test" }, () => ({ contents: "export const host = {};", loader: "js" }));
        },
      },
    ],
  });
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.route("http://forest.test/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    const prefix = "/api/capability-packages/forest-workshop/assets/";
    if (path.startsWith(prefix)) {
      const file = resolve("packages/forest-workshop", path.slice(prefix.length));
      await route.fulfill({ body: await readFile(file), contentType: "image/webp" });
    } else await route.fulfill({ body: "<!doctype html><html><body></body></html>", contentType: "text/html" });
  });
  await page.goto("http://forest.test/");
  await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="host"></div>');
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const resident = {
      residentId: "r",
      displayName: "숲 주민",
      recruited: true,
      registeredAt: "2026-01-01",
      image: {
        current: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='40' fill='gold'/%3E%3C/svg%3E",
          reference: "fixture",
          width: 100,
          height: 100,
        },
        placement: { scale: 100, offsetX: 0, markerHeight: 0 },
      },
    };
    const state = {
      world: {
        state: "ready",
        value: {
          state: {
            settings: { ground: { left: 12, right: 88, top: 58, bottom: 90 } },
            progress: { starterResidentId: "r" },
            residents: { r: resident },
            production: {
              simMs: 0,
              reports: [],
              reportsReadThrough: 0,
              facilities: {
                gather: { job: { recipeId: "berry", outputs: { berry: 1 }, startedSim: 0, endsSim: 60000 } },
              },
            },
          },
        },
      },
      worldReceivedAt: Date.now(),
      content: { recipes: [{ id: "berry", name: "산딸기" }] },
      seasonChoice: "spring",
    };
    window.homeTestState = state;
    const controller = {
      openResidents(id) {
        window.selected = id;
      },
      openSheet(sheet) {
        window.sheet = sheet;
      },
      selectFacility(id) {
        window.facility = id;
      },
      navigate(route) {
        window.route = route;
      },
      openRegister() {},
      openDeliveries() {
        window.deliveriesOpened = true;
      },
    };
    window.homeTestController = controller;
    const style = document.createElement("style");
    style.textContent = window.fwStyles + ".home-layout .scene { height: 300px; flex: none; }";
    const container = document.createElement("div");
    container.className = "home-layout";
    container.append(
      window.renderHomeScene(state, controller),
      window.compactWorkReport(state, state.world.value, controller),
    );
    root.append(style, container);
  });
  if (process.env.FW_HOME_SCREENSHOT) await page.screenshot({ path: process.env.FW_HOME_SCREENSHOT });
  assert.equal(await page.locator(".spot-name").count(), 0);
  const board = page.getByRole("button", { name: "공방 게시판 — 오늘의 납품", exact: true });
  await board.click();
  assert.equal(await page.evaluate(() => window.deliveriesOpened), true, "the scene prop opens delivery requests");
  assert.equal(await board.evaluate((node) => Boolean(node.closest(".scene-scenery"))), true);

  const resident = page.getByRole("button", { name: "숲 주민에게 인사하기" });
  const before = await resident.evaluate((node) => node.getBoundingClientRect().x);
  await page.waitForTimeout(1000);
  assert.notEqual(await resident.evaluate((node) => node.getBoundingClientRect().x), before, "moves without touch");
  const bodies = await resident.locator(".figure-body").evaluate((node) => {
    const animation = node.getAnimations()[0];
    animation.pause();
    animation.currentTime = 100;
    const moving = getComputedStyle(node).transform;
    animation.currentTime = 460;
    const compressed = getComputedStyle(node).transform;
    animation.cancel();
    return moving !== compressed;
  });
  assert.equal(bodies, true, "walking changes body shape");
  const feet = await resident.locator("..").evaluate((node) => {
    const animation = node.getAnimations()[0];
    animation.pause();
    animation.currentTime = 0;
    const a = node.getBoundingClientRect();
    animation.currentTime = 9000;
    const b = node.getBoundingClientRect();
    const ground = node.parentElement.getBoundingClientRect();
    animation.cancel();
    return {
      xMoved: b.x !== a.x,
      yMoved: b.y !== a.y,
      inside:
        b.x + b.width / 2 >= ground.left &&
        b.x + b.width / 2 <= ground.right &&
        b.bottom >= ground.top &&
        b.bottom <= ground.bottom,
    };
  });
  assert.deepEqual(feet, { xMoved: true, yMoved: true, inside: true });

  await resident.click({ force: true });
  assert.equal(await page.evaluate(() => window.selected), undefined);
  assert.equal(await page.locator(".resident-reaction").isVisible(), true);
  assert.equal(await page.getByRole("button", { name: "프로필", exact: true }).count(), 0);
  assert.equal(await resident.evaluate((node) => getComputedStyle(node.parentElement).animationPlayState), "running");
  assert.equal(
    await resident.locator(".figure-body").evaluate((node) => getComputedStyle(node).animationPlayState),
    "running",
  );
  assert.equal(
    await resident.locator(".figure").evaluate((node) => getComputedStyle(node).animationName),
    "fw-facing-left",
  );
  await page.getByRole("button", { name: "산딸기 진행 중 · 작업 관리 열기" }).click();
  assert.equal(await page.evaluate(() => window.facility), "gather");
  assert.equal(await page.evaluate(() => window.route), "work");
  await page.evaluate(() => {
    const state = window.homeTestState;
    state.world.value.state.production.reports.push({ reportId: 1 });
    const root = document.querySelector("#host").shadowRoot;
    root
      .querySelector(".work-summary")
      .replaceWith(window.compactWorkReport(state, state.world.value, window.homeTestController));
  });
  assert.equal(await page.getByRole("button", { name: /새 보고 1개/ }).count(), 1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await resident.locator(".figure").evaluate((node) => getComputedStyle(node).animationName), "none");
  assert.equal(await resident.locator("..").evaluate((node) => getComputedStyle(node).animationName), "none");
  const weatherKeys = await page.evaluate(() => {
    const state = window.homeTestState,
      controller = window.homeTestController;
    const a = window.renderHomeScene({ ...state, weatherEffects: { enabled: true, kind: "rain" } }, controller).dataset
      .homeScene;
    const b = window.renderHomeScene({ ...state, weatherEffects: { enabled: true, kind: "snow" } }, controller).dataset
      .homeScene;
    const c = window.renderHomeScene({ ...state, weatherEffects: { enabled: false, kind: "rain" } }, controller).dataset
      .homeScene;
    return [a !== b, a !== c];
  });
  assert.deepEqual(weatherKeys, [true, true], "preserved scenes refresh when weather preferences change");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const overlap = await board.evaluate((node) => {
    const root = node.getRootNode(),
      scene = node.closest(".scene"),
      ground = scene.querySelector(".ground-stage"),
      spot = ground.querySelector(".resident-spot.filled");
    const rect = node.getBoundingClientRect(),
      sceneRect = scene.getBoundingClientRect();
    const oldGround = ground.style.cssText,
      oldSpot = spot.style.cssText;
    ground.style.cssText = "left:0;top:0;width:100%;height:100%;right:auto;bottom:auto;padding:0;";
    spot.style.cssText = `animation:none;left:${rect.x + rect.width / 2 - sceneRect.x}px;top:${rect.bottom - sceneRect.y}px;`;
    const hit = root.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const residentIsInFront = Boolean(hit?.closest(".resident-touch"));
    ground.style.cssText = oldGround;
    spot.style.cssText = oldSpot;
    return residentIsInFront;
  });
  assert.equal(overlap, true, "residents receive input in front of an overlapping bulletin board");
  // Actual mobile DOM: no city name leaks, and day/night changes the scene and clear-sky sprite.
  await page.clock.setFixedTime(new Date("2026-11-03T03:00:00Z"));
  const paintEnvironment = async () =>
    page.evaluate(() => {
      const state = {
        ...window.homeTestState,
        weatherCity: "seoul",
        seasonChoice: "auto",
        liveWeather: {
          state: "ready",
          value: {
            cityId: "seoul",
            city: "서울",
            latitude: 37.57,
            timeZone: "Asia/Seoul",
            temperature: 8,
            kind: "clear",
            sunrise: "2026-11-03T07:00",
            sunset: "2026-11-03T17:30",
          },
        },
        weatherEffects: { enabled: true, kind: "clear" },
      };
      state.world.value.state.wallet = { gold: 100, tickets: 1 };
      const root = document.querySelector("#host").shadowRoot;
      root.querySelector(".scene").replaceWith(window.renderHomeScene(state, window.homeTestController));
      root.querySelector("header")?.remove();
      root.append(window.renderTopBar(state, window.homeTestController, { kind: "home" }));
      return root.querySelector(".scene").dataset.homeScene;
    });
  await page.clock.install({ time: new Date("2026-11-03T03:00:00Z") });
  await page.evaluate(() => {
    const element = document.createElement("marinara-capability-forest-workshop");
    window.environmentChanges = 0;
    element.controller = {
      store: {
        get: () => ({
          seasonChoice: "auto",
          liveWeather: {
            state: "ready",
            value: {
              cityId: "seoul",
              timeZone: "Asia/Seoul",
              latitude: 37.57,
              sunrise: "2026-11-03T07:00",
              sunset: "2026-11-03T17:30",
            },
          },
        }),
        set: () => window.environmentChanges++,
      },
    };
    window.environmentTimer = setInterval(() => element.tick(), 1000);
  });
  await page.clock.runFor(2000);
  assert.equal(await page.evaluate(() => window.environmentChanges), 1, "idle ticks avoid repeated renders");
  const dayKey = await paintEnvironment();
  assert.equal(await page.locator(".scene-day .weather-sun").count(), 1);
  assert.equal(await page.locator(".weather").innerText(), "8° · 맑음");
  assert.equal((await page.locator(".top-home").textContent()).includes("서울"), false);
  assert.equal((await page.locator(".weather").getAttribute("aria-label")).includes("서울"), false);
  if (process.env.FW_DAY_SCREENSHOT) await page.screenshot({ path: process.env.FW_DAY_SCREENSHOT });
  await page.clock.setFixedTime(new Date("2026-11-03T09:00:00Z"));
  await page.clock.runFor(1000);
  assert.equal(await page.evaluate(() => window.environmentChanges), 2, "lighting notifies the view without touch");
  await page.evaluate(() => clearInterval(window.environmentTimer));
  assert.notEqual(await paintEnvironment(), dayKey, "night invalidates the retained scene");
  assert.equal(await page.locator(".scene-night .weather-moon").count(), 1);
  assert.equal(await page.locator(".weather-sun").count(), 0);
  assert.match(await page.locator(".scene-scenery").evaluate((n) => getComputedStyle(n).filter), /brightness\(0.62\)/);
  if (process.env.FW_NIGHT_SCREENSHOT) await page.screenshot({ path: process.env.FW_NIGHT_SCREENSHOT });
  console.log("Home motion, scene bulletin board, resident foreground and reduced motion: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
