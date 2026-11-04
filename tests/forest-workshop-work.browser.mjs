// Browser regression for the unified work plan, art, and reachable controls.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-work-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderWorkScreen } from ${JSON.stringify(join(client, "screens/work/work-screen.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { PRODUCTION_STYLES } from ${JSON.stringify(join(client, "styles-production.ts"))};\nimport { INVITE_STYLES } from ${JSON.stringify(join(client, "styles-invite.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nimport { renderHomeScreen } from ${JSON.stringify(join(client, "screens/home/home-screen.ts"))};\nwindow.renderHomeScreen = renderHomeScreen; window.renderWorkScreen = renderWorkScreen; window.fwStyles = STYLES + RESIDENT_STYLES + PRODUCTION_STYLES + INVITE_STYLES + STORY_STYLES + ART_STYLES;`,
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
          b.onLoad({ filter: /.*/, namespace: "test" }, () => ({ contents: "export const host = {};", loader: "js" }));
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
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: false, hasTouch: true });
  await page.route("http://forest.test/api/capability-packages/forest-workshop/assets/assets/**", async (route) => {
    const relative = new URL(route.request().url()).pathname.split("/assets/assets/")[1];
    await route.fulfill({
      contentType: "image/webp",
      body: await readFile(resolve("packages/forest-workshop/assets", relative)),
    });
  });
  await page.setContent(
    '<base href="http://forest.test/"><meta name="viewport" content="width=device-width, initial-scale=1"><div id="host" style="height:740px;width:390px"></div>',
  );
  await page.addScriptTag({ content: await readFile(bundle, "utf8") });
  await page.evaluate(() => {
    document.body.style.margin = "0";
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const rule = { policyId: "p", recipeId: "berry", targetStock: 5, priority: 1, enabled: true };
    const facility = {
      unlocked: true,
      level: 1,
      residentId: null,
      mode: "auto",
      rules: [rule],
      queue: [],
      job: null,
      waiting: null,
    };
    window.testState = {
      route: "work",
      work: {
        facilityId: "gather-yard",
        drafts: { "gather-yard": [{ ...rule, targetStock: 6 }] },
        selected: {},
        queueRecipe: {},
      },
      world: {
        state: "ready",
        value: {
          state: {
            production: { facilities: { "gather-yard": facility }, protectedStock: {} },
            inventory: {},
            wallet: { gold: 100, tickets: 0 },
            residents: {},
            pairs: {},
          },
        },
      },
      content: {
        facilities: [{ id: "gather-yard", field: "gather", name: "채집터", description: "", unlock: null }],
        recipes: [
          {
            id: "berry",
            name: "산딸기",
            facilityId: "gather-yard",
            inputs: {},
            outputs: { "wild-berry": 1 },
            minutes: 1,
            description: "",
          },
        ],
        items: [{ id: "wild-berry", name: "산딸기" }],
        production: { speedBonusPerLevel: 0, maxLevel: 5, upgradeCosts: [50, 100, 200, 400] },
        crew: { setBonusMax: 0, setBonusPerPair: 0 },
        talents: [],
      },
      sheet: null,
      notice: null,
      seasonChoice: "spring",
      artReady: [
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
        "backgrounds/workshop-base-spring.webp",
      ],
      busy: {},
    };
    const update = (patch) => {
      Object.assign(window.testState.work, patch);
      window.testRender();
    };
    window.testController = {
      rememberProductionDetails(open) {
        window.testState.work.advancedOpen = open;
      },
      setWorkSection(section) {
        update({ section });
      },
      selectRule(facilityId, policyId) {
        update({ selected: { [facilityId]: policyId } });
      },
      discardDraft() {},
      selectFacility() {},
      setMode() {},
      openSheet() {},
      setFacilitiesTab(tab) {
        window.facilitiesTab = tab;
      },
      navigate(route) {
        window.destination = route;
      },
      openGroundEditor() {
        window.groundOpened = true;
      },
      openResidents() {},
      changeTarget() {},
      rememberGoalTarget(facilityId, policyId, targetStock) {
        const rules = window.testState.work.drafts[facilityId];
        for (const rule of rules ?? []) if (rule.policyId === policyId) rule.targetStock = targetStock;
      },
      recommendRules() {},
      applyRules() {
        window.appliedRules = true;
      },
      upgradeFacility(facilityId, level) {
        window.upgraded = { facilityId, level };
      },
      toggleRule() {},
      moveRule() {},
      addRule() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderWorkScreen(window.testState, window.testController));
    };
    window.testRender();
  });
  const alignment = await page.getByRole("tab", { name: "채집", exact: true }).evaluate((button) => {
    const b = button.getBoundingClientRect(),
      i = button.querySelector(".field-art").getBoundingClientRect(),
      t = button.querySelector("span:not(.lock-tag)").getBoundingClientRect();
    return [Math.abs((i.left + i.right - b.left - b.right) / 2), Math.abs((t.left + t.right - b.left - b.right) / 2)];
  });
  assert.ok(
    alignment.every((d) => d < 1),
    JSON.stringify(alignment),
  );
  const titleBounds = await page.locator(".sign").evaluate((sign) => {
    const b = sign.getBoundingClientRect(),
      range = document.createRange();
    range.selectNodeContents(sign.querySelector(".sign-title"));
    const t = range.getBoundingClientRect();
    return {
      inside:
        t.left >= b.left + b.width * 0.17 &&
        t.right <= b.left + b.width * 0.83 &&
        t.top >= b.top + b.height * 0.33 &&
        t.bottom <= b.top + b.height * 0.81,
    };
  });
  assert.ok(titleBounds.inside, "title stays within wooden board, clear of ropes and leaves");
  assert.equal(await page.getByText("지정 횟수", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "채집터 — 시설과 창고 열기" }).click();
  assert.equal(await page.evaluate(() => window.facilitiesTab), "facilities");
  await page.getByRole("tab", { name: "생산 설정", exact: true }).click();
  assert.equal(await page.locator(".production-manual").evaluate((node) => node.open), false);
  await page.getByText("켜짐 · 목표 재고 · 작업 순서 직접 설정", { exact: true }).click();
  assert.equal(await page.getByRole("heading", { name: "만들 물건을 골라 주세요", exact: true }).count(), 1);
  assert.equal(await page.getByRole("heading", { name: "작업 우선순위", exact: true }).count(), 1);
  await page.getByRole("button", { name: "이 시설 설정 적용", exact: true }).click();
  assert.equal(await page.evaluate(() => window.appliedRules), true);
  await page.evaluate(() => {
    const state = window.testState;
    state.content.recipes = Array.from({ length: 3 }, (_, i) => ({
      id: `r${i}`,
      name: `제작 ${i}`,
      facilityId: "gather-yard",
      inputs: {},
      outputs: { "wild-berry": 1 },
      minutes: 1,
      description: "",
    }));
    state.work.drafts["gather-yard"] = state.content.recipes.map((r, i) => ({
      policyId: `p${i}`,
      recipeId: r.id,
      targetStock: 5,
      priority: i + 1,
      enabled: true,
    }));
    window.testController.applyProductionTree = (recipeId, targetStock) => {
      window.tree = { recipeId, targetStock };
    };
    window.testRender();
  });
  assert.equal(await page.locator(".recipe-choice").count(), 3);
  assert.equal(await page.locator("select,details.page-picker").count(), 0);
  await page.getByRole("button", { name: "제작 1 생산 설정", exact: true }).click();
  await page.getByRole("spinbutton", { name: "목표 재고", exact: true }).fill("999");
  await page.getByRole("button", { name: "제작 1 자동 생산", exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.tree), { recipeId: "r1", targetStock: 999 });
  await page.getByRole("button", { name: "작업 우선순위 물품 · 다음 페이지" }).click();
  assert.equal(
    await page.getByRole("button", { name: "제작 2 생산 설정", exact: true }).getAttribute("aria-pressed"),
    "true",
  );
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 740 });
    const overflow = await page.locator("#host").evaluate((host) => {
      const panel = host.shadowRoot.querySelector(".scroll");
      return panel.scrollWidth - panel.clientWidth;
    });
    assert.ok(overflow <= 1, `no horizontal overflow at ${width}`);
    await page.getByRole("button", { name: "기본 추천 불러오기", exact: true }).scrollIntoViewIfNeeded();
    assert.equal(await page.getByRole("button", { name: "기본 추천 불러오기", exact: true }).isVisible(), true);
  }
  await page.getByRole("tab", { name: "작업 현황", exact: true }).click();
  assert.equal(await page.getByRole("heading", { name: "작업 우선순위", exact: true }).count(), 0);
  assert.equal(await page.locator(".production-slots li").count(), 1, "status shows applied rules, not unsaved draft");
  await page.getByRole("button", { name: "재고 보호", exact: true }).click();
  assert.equal(await page.evaluate(() => window.facilitiesTab), "protection");
  await page.getByRole("button", { name: "창고 · 판매", exact: true }).click();
  assert.equal(await page.evaluate(() => window.facilitiesTab), "storage");
  await page.evaluate(() => {
    window.testState.world.value.state.production.facilities["gather-yard"].waiting = { reason: "queue_empty" };
    window.testRender();
  });
  await page.getByRole("button", { name: "생산 설정 열기", exact: true }).click();
  assert.equal(
    await page.evaluate(() => window.testState.work.section),
    "recipe",
    "empty production directly opens its settings",
  );
  await page.evaluate(() => {
    window.testState.work.section = "status";
    window.testState.world.value.state.production.facilities["gather-yard"].waiting = { reason: "target_reached" };
    window.testRender();
  });
  await page.getByRole("button", { name: "목표 재고 바꾸기", exact: true }).click();
  assert.equal(
    await page.evaluate(() => window.testState.work.section),
    "recipe",
    "reached target directly opens its stock settings",
  );
  console.log("Work status/settings tabs, arrow priority selection, recipe tree and inventory access: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
