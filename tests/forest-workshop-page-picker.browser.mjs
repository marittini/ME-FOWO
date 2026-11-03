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
    `import {pagePicker} from ${JSON.stringify(join(root, "screens/chrome/page-picker.ts"))}; import {STYLES} from ${JSON.stringify(join(root, "styles.ts"))}; Object.assign(window,{pagePicker,styles:STYLES});`,
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
  await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><div id="host"></div>');
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = window.styles;
    document.head.append(style);
    window.paint = (current = 0) => {
      const picker = window.pagePicker("목록 고르기", current, ["첫 번째", "두 번째 항목", "세 번째"], (index) => {
        window.selected = index;
        window.paint(index);
      });
      document.querySelector("#host").replaceChildren(picker);
    };
    window.paint();
  });
  const previous = () => page.getByRole("button", { name: "목록 고르기 · 이전 페이지" });
  const next = () => page.getByRole("button", { name: "목록 고르기 · 다음 페이지" });
  assert.equal(await previous().isDisabled(), true);
  assert.equal(await page.locator("select,details,summary").count(), 0);
  await next().focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => window.selected), 1);
  assert.match(await page.locator(".page-picker-label").innerText(), /2 \/ 3/);
  await next().click();
  assert.equal(await next().isDisabled(), true);
  await previous().click();
  assert.equal(await page.evaluate(() => window.selected), 1);
  assert.ok(await next().evaluate((n) => n.getBoundingClientRect().width >= 44));
  console.log("Arrow pagination supports keyboard, boundaries and touch target sizing: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
