import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const temp = await mkdtemp(join(tmpdir(), "forest-home-cast-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {renderHomeScene} from ${JSON.stringify(join(client, "screens/home/home-scene.ts"))};
import {readHomeDisplayCount,writeHomeDisplayCount} from ${JSON.stringify(join(client, "app/preferences.ts"))};
import {HOME_CAST_STYLES} from ${JSON.stringify(join(client, "styles-home-cast.ts"))};
import {STYLES} from ${JSON.stringify(join(client, "styles.ts"))};
import {RESIDENT_STYLES,HOME_REACTION_STYLES} from ${JSON.stringify(join(client, "styles-residents.ts"))};
import {ART_STYLES} from ${JSON.stringify(join(client, "styles-art.ts"))};
window.renderHomeScene=renderHomeScene;window.readCount=readHomeDisplayCount;window.writeCount=writeHomeDisplayCount;window.homeCastStyles=STYLES+RESIDENT_STYLES+ART_STYLES+HOME_REACTION_STYLES+HOME_CAST_STYLES;`,
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
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true });
  await page.route("http://forest.test/**", (route) =>
    route.fulfill({
      body: '<meta name="viewport" content="width=device-width, initial-scale=1"><div id="host"></div>',
      contentType: "text/html",
    }),
  );
  await page.goto("http://forest.test/");
  await page.addScriptTag({ content: await (await import("node:fs/promises")).readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent =
      window.homeCastStyles +
      ".home-layout { position:relative; width:390px; height:350px; } .home-layout .scene { height:350px; flex:none; }";
    root.append(style);
    const residents = Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [
        `r${i}`,
        {
          residentId: `r${i}`,
          displayName: `주민${i}`,
          recruited: true,
          registeredAt: `2026-01-0${i + 1}`,
          image: { current: null, placement: { scale: 100, offsetX: 0, markerHeight: 0 } },
        },
      ]),
    );
    const state = {
      route: "home",
      homeVisit: 1,
      homeDisplayCount: 6,
      seasonChoice: "spring",
      weatherEffects: { enabled: false, kind: "clear" },
      world: {
        state: "ready",
        value: {
          worldId: "w",
          state: {
            settings: { ground: { left: 12, right: 88, top: 58, bottom: 90 }, board: null },
            progress: { starterResidentId: "r0" },
            residents,
          },
        },
      },
    };
    const controller = { openDeliveries() {}, navigate() {}, openRegister() {} };
    const container = document.createElement("div");
    container.className = "home-layout";
    root.append(container);
    window.castState = state;
    window.castController = controller;
    window.castRoot = container;
    window.renderCast = () => {
      const scene = window.renderHomeScene(state, controller);
      container.replaceChildren(scene);
      return [...scene.querySelectorAll(".resident-touch")].map((node) => node.getAttribute("aria-label"));
    };
  });
  await page.evaluate(() => {
    Math.random = () => 0;
    window.castState.homeDisplayCount = 2;
  });
  const first = await page.evaluate(() => window.renderCast());
  assert.equal(first.length, 2, "the configured limit controls the cast size");
  assert.equal(
    first.some(
      (name) => name.includes("주민2") || name.includes("주민3") || name.includes("주민4") || name.includes("주민5"),
    ),
    true,
    "random cast can include residents outside the first pair",
  );
  assert.deepEqual(await page.evaluate(() => window.renderCast()), first, "rerender keeps the visit cast stable");
  await page.evaluate(() => {
    window.castState.homeDisplayCount = 6;
  });
  const six = await page.evaluate(() => window.renderCast());
  assert.equal(six.length, 6, "limit six displays six recruited residents");
  const bounds = await page.locator(".resident-spot").evaluateAll((nodes) =>
    nodes.map((node) => {
      const b = node.getBoundingClientRect(),
        s = node.closest(".ground-stage").getBoundingClientRect();
      return { foot: [b.left + b.width / 2, b.bottom], stage: [s.left, s.top, s.right, s.bottom] };
    }),
  );
  assert.equal(
    bounds.every(
      (b) =>
        b.foot[0] >= b.stage[0] - 2 &&
        b.foot[0] <= b.stage[2] + 2 &&
        b.foot[1] >= b.stage[1] - 2 &&
        b.foot[1] <= b.stage[3] + 2,
    ),
    true,
    JSON.stringify(bounds),
  );
  const nextVisit = await page.evaluate(() => {
    Math.random = () => 0.99;
    window.castState.homeVisit++;
    return window.renderCast();
  });
  assert.equal(nextVisit.length, 6, "a new home visit repopulates the cast");
  assert.notDeepEqual(nextVisit, six, "a new visit can reshuffle the cast");
  const prefs = await page.evaluate(() => {
    window.localStorage.clear();
    const fallback = window.readCount();
    window.writeCount(4);
    const stored = window.readCount();
    window.localStorage.setItem("forest-workshop:home-display-count", "invalid");
    const invalid = window.readCount();
    return { fallback, stored, invalid };
  });
  assert.deepEqual(prefs, { fallback: 2, stored: 4, invalid: 2 });
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
