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
  const page = await browser.newPage({ viewport: { width: 390, height: 350 }, isMobile: true });
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
            settings: { ground: { left: 8, right: 92, top: 45, bottom: 95 }, board: null },
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
  const castSamples = [];
  for (const count of [1, 2, 3, 4, 5, 6]) {
    const sample = await page.evaluate((displayCount) => {
      window.castState.homeDisplayCount = displayCount;
      window.renderCast();
      const stage = window.castRoot.querySelector(".ground-stage"),
        spot = stage.querySelector(".resident-spot.filled"),
        ground = stage.getBoundingClientRect(),
        groundStyle = stage.style,
        motions = spot.getAnimations().filter((animation) => animation.effect?.target === spot);
      for (const motion of motions) motion.pause();
      const frames = [0, 8100, 13000].map((time) => {
        for (const motion of motions) motion.currentTime = time;
        const rect = spot.getBoundingClientRect();
        return { time, foot: [rect.left + rect.width / 2, rect.bottom] };
      });
      return {
        dimensions: [spot.getBoundingClientRect().width, spot.getBoundingClientRect().height],
        ground: [ground.width, ground.height, ground.left, ground.top, ground.right, ground.bottom],
        groundStyle: [groundStyle.left, groundStyle.top, groundStyle.width, groundStyle.height],
        frames,
        animationCount: motions.length,
      };
    }, count);
    assert.equal(sample.animationCount > 0, true, `count ${count} has a CSS movement animation`);
    assert.equal(sample.dimensions[0] > 0 && sample.dimensions[1] > 0, true);
    assert.deepEqual(sample.groundStyle, ["8%", "45%", "84%", "50%"], "changed saved ground rectangle is applied");
    assert.equal(
      sample.frames.every(
        ({ foot: [x, y] }) =>
          x >= sample.ground[2] - 2 &&
          x <= sample.ground[4] + 2 &&
          y >= sample.ground[3] - 2 &&
          y <= sample.ground[5] + 2,
      ),
      true,
      `count ${count} keeps every sampled foot inside its saved ground: ${JSON.stringify(sample.frames)}`,
    );
    castSamples.push(sample);
  }
  for (const sample of castSamples.slice(1)) {
    assert.ok(Math.abs(sample.dimensions[0] - castSamples[0].dimensions[0]) < 0.5, "resident width stays constant");
    assert.ok(Math.abs(sample.dimensions[1] - castSamples[0].dimensions[1]) < 0.5, "resident height stays constant");
    assert.deepEqual(sample.ground, castSamples[0].ground, "ground rectangle size stays constant by cast count");
    assert.deepEqual(
      sample.frames.map(({ foot }) => foot),
      castSamples[0].frames.map(({ foot }) => foot),
      "cast counts share the same sampled foot path",
    );
  }
  assert.notEqual(castSamples[0].frames[0].foot[0], castSamples[0].frames[1].foot[0], "movement changes X");
  assert.notEqual(castSamples[0].frames[0].foot[1], castSamples[0].frames[1].foot[1], "movement changes Y");
  assert.notDeepEqual(
    castSamples[0].frames[1].foot,
    castSamples[0].frames[2].foot,
    "shared movement continues along the path",
  );
  const depthSamples = await page.evaluate(() => {
    window.castState.homeDisplayCount = 2;
    window.renderCast();
    const spots = [...window.castRoot.querySelectorAll(".resident-spot.filled")];
    const motion = (spot) =>
      spot.getAnimations().find((animation) => animation.animationName === "fw-home-cast-wander");
    const sample = (phases) => {
      spots.forEach((spot, index) => {
        const animation = motion(spot);
        animation.pause();
        const delay = Number.parseFloat(spot.style.animationDelay) * 1000;
        animation.currentTime = phases[index] * 42000 + delay;
      });
      return spots.map((spot) => ({
        footY: spot.getBoundingClientRect().bottom,
        z: Number.parseInt(getComputedStyle(spot).zIndex, 10),
      }));
    };
    const durations = spots.map((spot) => motion(spot).effect.getTiming().duration);
    return { durations, first: sample([0.3, 0.65]), second: sample([0.65, 0.3]) };
  });
  assert.deepEqual(depthSamples.durations, [42000, 42000], "home wandering takes 42 seconds per loop");
  for (const sample of [depthSamples.first, depthSamples.second]) {
    assert.notEqual(sample[0].footY, sample[1].footY, "sampled residents stand at different depths");
    const lower = sample[0].footY > sample[1].footY ? sample[0] : sample[1];
    const higher = lower === sample[0] ? sample[1] : sample[0];
    assert.ok(lower.z > higher.z, "the resident lower on screen paints in front");
  }
  const facing = await page.evaluate(() => {
    const spots = [...window.castRoot.querySelectorAll(".resident-spot.filled")];
    return spots.map((spot) => {
      const figure = spot.querySelector(".figure");
      const animation = figure.getAnimations().find((a) => a.effect.target === figure);
      animation.pause();
      const delay = Number.parseFloat(getComputedStyle(figure).animationDelay) * 1000;
      const turns = [0.2, 0.6].map((phase) => {
        animation.currentTime = phase * 42000 + delay;
        return new DOMMatrix(getComputedStyle(figure).transform).a;
      });
      return { delay: getComputedStyle(figure).animationDelay, parentDelay: spot.style.animationDelay, turns };
    });
  });
  for (const value of facing) {
    assert.equal(value.delay, value.parentDelay, "facing follows each resident's movement phase");
    assert.deepEqual(value.turns, [1, -1], "facing turns when the path changes horizontal direction");
  }
  const editMotion = await page.evaluate(() => {
    window.castState.homeDisplayCount = 6;
    window.renderCast();
    const scene = window.castRoot.querySelector(".scene"),
      spot = window.castRoot.querySelector(".ground-stage .resident-spot.filled");
    scene.classList.add("editing-ground");
    return [
      getComputedStyle(spot).animationPlayState,
      getComputedStyle(spot.querySelector(".figure")).animationPlayState,
    ];
  });
  assert.deepEqual(editMotion, ["paused", "paused"], "ground editing pauses resident movement");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotionCount = await page.evaluate(() => {
    window.castRoot.querySelector(".scene").classList.remove("editing-ground");
    window.renderCast();
    return window.castRoot.querySelector(".ground-stage .resident-spot.filled").getAnimations({ subtree: true }).length;
  });
  assert.equal(reducedMotionCount, 0, "reduced motion disables resident movement");
  await page.emulateMedia({ reducedMotion: "no-preference" });
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
