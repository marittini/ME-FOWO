import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "fw-picker-"));
let browser;
try {
  const root = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import {createGameAudio, readAudioPreference, writeAudioPreference} from ${JSON.stringify(join(root, "app/audio.ts"))}; Object.assign(window,{createGameAudio, readAudioPreference, writeAudioPreference});`,
  );
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    format: "iife",
    platform: "browser",
    logLevel: "silent",
  });
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page.route("http://forest.test/**", (route) =>
    route.fulfill({ body: '<button id="sound">소리 시작</button>', contentType: "text/html" }),
  );
  await page.goto("http://forest.test/");
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const Native = window.AudioContext;
    window.voicesStarted = 0;
    window.AudioContext = class extends Native {
      constructor() {
        super();
        window.audioContext = this;
        const create = this.createOscillator.bind(this);
        this.createOscillator = () => {
          window.voicesStarted++;
          return create();
        };
      }
    };
    window.audio = window.createGameAudio();
    document.querySelector("#sound").onclick = () => window.audio.click();
  });
  await page.click("#sound");
  await page.waitForFunction(() => window.audioContext?.state === "running" && window.voicesStarted >= 8);
  assert.equal(await page.evaluate(() => window.readAudioPreference().music), true);
  await page.evaluate(() => {
    window.writeAudioPreference({ music: false, effects: true, volume: 0.1 });
    window.audio.sync();
    window.beforeClick = window.voicesStarted;
  });
  await page.click("#sound");
  await page.waitForFunction(() => window.voicesStarted === window.beforeClick + 1);
  await page.evaluate(() => {
    window.writeAudioPreference({ music: false, effects: false, volume: 0.1 });
    window.audio.sync();
    window.beforeClick = window.voicesStarted;
  });
  await page.click("#sound");
  assert.equal(await page.evaluate(() => window.voicesStarted), await page.evaluate(() => window.beforeClick));
  await page.evaluate(() => window.audio.pause());
  await page.waitForFunction(() => window.audioContext.state === "suspended");
  await page.evaluate(() => window.audio.dispose());
  await page.waitForFunction(() => window.audioContext.state === "closed");
  console.log("Original background music, effects, persistent mute, pause and disposal: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
