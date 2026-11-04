// Browser regression for work section navigation and unapplied rule visibility.
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
const temp = await mkdtemp(join(tmpdir(), "forest-reader-"));
const client = resolve("packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop");
let browser;
try {
  const entry = join(temp, "entry.ts"),
    bundle = join(temp, "bundle.js");
  await writeFile(
    entry,
    `import { renderStoryReader } from ${JSON.stringify(join(client, "screens/explore/story-reader.ts"))};\nimport { STYLES } from ${JSON.stringify(join(client, "styles.ts"))};\nimport { RESIDENT_STYLES } from ${JSON.stringify(join(client, "styles-residents.ts"))};\nimport { STORY_STYLES } from ${JSON.stringify(join(client, "styles-story.ts"))};\nimport { ART_STYLES } from ${JSON.stringify(join(client, "styles-art.ts"))};\nimport { measureStoryPages } from ${JSON.stringify(join(client, "app/story-pages.ts"))};\nwindow.measureStoryPages = measureStoryPages; window.renderStoryReader = renderStoryReader; window.fwStyles = STYLES + RESIDENT_STYLES + STORY_STYLES + ART_STYLES;`,
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
  const page = await browser.newPage({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true });
  await page.route("http://forest.test/test-character-*.svg*", async (route) => {
    const ratio = new URL(route.request().url()).pathname.includes("wide") ? "360 120" : "120 360";
    await route.fulfill({
      contentType: "image/svg+xml",
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="${ratio.split(" ")[0]}" height="${ratio.split(" ")[1]}" viewBox="0 0 ${ratio}"><rect width="100%" height="100%" fill="#78a"/><circle cx="50%" cy="12%" r="10%" fill="#fc8"/></svg>`,
    });
  });
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
    const root = document.querySelector("#host").attachShadow({ mode: "open" });
    const segments = [
      {
        kind: "line",
        speakerId: "r",
        text: "숲길에서 산딸기를 조금 따 왔어요. 잼이 완성되면 함께 차를 마실까요? ".repeat(4),
        emotion: "joy",
      },
      {
        kind: "choice",
        askerId: "r",
        question: "이럴 때 우리 함께 어떤 일을 하면 좋을까요? ".repeat(4),
        options: [
          { optionId: "a", text: "함께 공방에 가서 따뜻한 차를 마시며 쉬어요" },
          { optionId: "b", text: "잠시 여기서 쉬면서 오늘 있었던 일을 이야기해요" },
          { optionId: "c", text: "다른 길을 찾아보고 이웃에게 인사를 건네봐요" },
        ],
      },
    ];
    window.testState = {
      route: "story",
      reader: {
        pairId: "p",
        episode: 0,
        storyId: "s",
        story: {
          state: "ready",
          value: { title: "첫 이야기", participants: ["r", "s"], background: "forest-trail", segments },
        },
        index: 0,
        auto: false,
        backlog: false,
        from: "explore",
      },
      world: {
        state: "ready",
        value: {
          worldId: "w",
          state: {
            residents: {
              r: {
                displayName: "주민",
                image: {
                  current: {
                    url: "http://forest.test/test-character-tall.svg",
                    reference: "test",
                    width: 120,
                    height: 360,
                  },
                  placement: { scale: 70, offsetX: 20, markerHeight: 0 },
                },
              },
              s: {
                displayName: "동행",
                image: {
                  current: {
                    url: "http://forest.test/test-character-wide.svg",
                    reference: "test",
                    width: 360,
                    height: 120,
                  },
                  placement: { scale: 130, offsetX: -20, markerHeight: 0 },
                },
              },
            },
            stories: { pairs: {} },
          },
        },
      },
      content: null,
      artReady: [
        "backgrounds/workshop-base-spring.webp",
        "ui/title-sign.webp",
        "ui/paper-panel.webp",
        "ui/primary-button.webp",
        "backgrounds/workshop-base-spring.webp",
      ],
      seasonChoice: "spring",
      sheet: null,
      notice: null,
      busy: {},
    };
    window.testController = {
      toggleBacklog() {
        window.testState.reader.backlog = !window.testState.reader.backlog;
        window.testState.reader.backlogPage = undefined;
        window.testRender();
      },
      setBacklogPage(backlogPage) {
        window.testState.reader.backlogPage = backlogPage;
        window.testRender();
      },
      toggleAuto() {},
      closeStory() {},
      advanceStory() {
        const reader = window.testState.reader;
        const segment = reader.story.value.segments[reader.index];
        const count = segment.kind === "choice" ? 0 : (reader.textPages?.length ?? 1);
        if ((reader.textPage ?? 0) + 1 < count) reader.textPage = (reader.textPage ?? 0) + 1;
        else {
          reader.index++;
          reader.textPage = 0;
          reader.textPages = undefined;
        }
        window.testRender();
      },
      setChoiceView(choiceView) {
        window.testState.reader.choiceView = choiceView;
        window.testRender();
      },
      finishStory() {
        window.finished = true;
      },
      chooseAnswer(id) {
        window.chosen = id;
      },
      notifyLocked() {},
      navigate() {},
    };
    window.testRender = () => {
      root.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = window.fwStyles;
      root.append(style, window.renderStoryReader(window.testState, window.testController));
      const reader = window.testState.reader;
      const segment = reader.story.value.segments[reader.index];
      const box = root.querySelector(".dialogue-box");
      if (segment && segment.kind !== "choice") {
        const pages = window.measureStoryPages(box, segment.text);
        if (pages) {
          reader.textPages = pages;
          box.querySelector(".line, .narration").textContent = pages[reader.textPage ?? 0];
        }
      }
    };
    window.testRender();
  });
  await page.locator(".stage-art").evaluate((i) => i.decode());
  await page.locator(".figure-image").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
  await page.screenshot({ path: join(process.env.FW_ART_SCREENSHOTS ?? temp, "reader-art.png") });

  const fit = async () =>
    page.locator("#host").evaluate((host) => {
      const s = host.shadowRoot.querySelector(".scroll");
      return { content: s.scrollHeight, available: s.clientHeight };
    });
  const lineSize = await fit();
  assert.ok(lineSize.content <= lineSize.available + 1, `story line should fit: ${JSON.stringify(lineSize)}`);
  for (const [width, font] of [
    [390, 16],
    [320, 22],
  ]) {
    await page.setViewportSize({ width, height: 740 });
    await page.locator("#host").evaluate(
      (host, config) => {
        host.style.width = config.width + "px";
        host.style.setProperty("--fw-font-size", config.font + "px");
      },
      { width, font },
    );
    await page.evaluate(() => window.testRender());
    const measured = await page.locator("#host").evaluate((host) => {
      const box = host.shadowRoot.querySelector(".dialogue-box");
      const line = box.querySelector(".line");
      const pages = window.testState.reader.textPages;
      const bounds = box.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(line);
      return {
        preserved: pages.join("") === window.testState.reader.story.value.segments[0].text,
        fits: [...range.getClientRects()].every(
          (rect) => rect.bottom <= bounds.bottom + 1 && rect.right <= bounds.right + 1,
        ),
        samePanel: host.shadowRoot
          .querySelector(".conversation-panel")
          .contains(host.shadowRoot.querySelector(".reader-foot")),
      };
    });
    assert.deepEqual(measured, { preserved: true, fits: true, samePanel: true });
  }
  await page.setViewportSize({ width: 390, height: 740 });
  await page.locator("#host").evaluate((host) => {
    host.style.width = "390px";
    host.style.setProperty("--fw-font-size", "16px");
  });
  await page.evaluate(() => window.testRender());
  const firstBox = await page.locator("#host").evaluate((host) => {
    const rect = host.shadowRoot.querySelector(".dialogue-box").getBoundingClientRect();
    return { top: rect.top, height: rect.height };
  });
  await page.getByRole("button", { name: "계속" }).click();
  const secondBox = await page.locator("#host").evaluate((host) => {
    const rect = host.shadowRoot.querySelector(".dialogue-box").getBoundingClientRect();
    return { top: rect.top, height: rect.height };
  });
  assert.deepEqual(secondBox, firstBox);
  while (await page.evaluate(() => window.testState.reader.index === 0)) {
    await page.getByRole("button", { name: "계속" }).click();
  }
  assert.equal(await page.getByRole("button", { name: "다 읽고 보관" }).isDisabled(), true);
  const choiceSize = await fit();
  assert.ok(choiceSize.content <= choiceSize.available + 1, `story choice should fit: ${JSON.stringify(choiceSize)}`);
  await page.getByRole("button", { name: "답변 고르기" }).click();
  await page.getByRole("button", { name: "질문 다시 보기" }).click();
  assert.equal(
    await page.getByText("이럴 때 우리 함께 어떤 일을 하면 좋을까요? ".repeat(4), { exact: true }).isVisible(),
    true,
  );
  await page.getByRole("button", { name: "답변 고르기" }).click();
  await page.getByRole("button", { name: "잠시 여기서 쉬면서 오늘 있었던 일을 이야기해요" }).click();
  assert.equal(await page.evaluate(() => window.chosen), "b");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.locator("#host").evaluate((host) => {
    host.style.width = "320px";
    host.style.height = "640px";
  });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const smallChoiceSize = await fit();
  assert.ok(
    smallChoiceSize.content <= smallChoiceSize.available + 1,
    `small story choice should fit: ${JSON.stringify(smallChoiceSize)}`,
  );
  await page.getByRole("button", { name: "기록", exact: true }).click();
  const backlog = page.getByRole("dialog", { name: "기록" });
  assert.equal(
    await backlog.getByText("이럴 때 우리 함께 어떤 일을 하면 좋을까요? ".repeat(4), { exact: true }).isVisible(),
    true,
  );
  await backlog.getByRole("button", { name: "이전", exact: true }).click();
  assert.equal(
    await backlog
      .getByText("숲길에서 산딸기를 조금 따 왔어요. 잼이 완성되면 함께 차를 마실까요? ".repeat(4), { exact: true })
      .isVisible(),
    true,
  );
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page.evaluate(() => {
    const reader = window.testState.reader;
    reader.index = 1;
    reader.choiceView = "question";
    reader.story.value.segments[1].question = "어떤 일을 하면 좋을까요?";
    window.testRender();
  });
  assert.equal(await page.getByRole("button", { name: "답변 고르기" }).count(), 0);
  const compactChoice = await fit();
  assert.ok(
    compactChoice.content <= compactChoice.available + 1,
    `short choice should fit: ${JSON.stringify(compactChoice)}`,
  );

  await page.evaluate(() => {
    window.testState.reader.story.value.segments = [{ kind: "line", speakerId: "r", text: "끝", emotion: "none" }];
    window.testState.reader.index = 0;
    window.testRender();
  });
  await page.evaluate(() => {
    const state = window.testState;
    state.world.value.state.residents.r.image = {
      current: null,
      placement: { scale: 60, offsetX: 20, markerHeight: 0 },
    };
    state.reader.story.value.participants = ["r"];
    state.reader.story.value.segments[0].emotion = "joy";
    window.testRender();
  });
  const mark = await page.locator("#host").evaluate((host) => {
    const marker = host.shadowRoot.querySelector(".emotion-bubble");
    return {
      bottom: marker.style.bottom,
      left: marker.style.left,
      parent: marker.parentElement.className,
      size: getComputedStyle(marker).fontSize,
    };
  });
  assert.equal(mark.parent, "figure");
  assert.equal(mark.bottom, "46%");
  assert.equal(mark.left, "60%");
  assert.ok(parseFloat(mark.size) > 0);
  const scaledMarks = await page.locator("#host").evaluate((host) => {
    const state = window.testState;
    const lead = state.world.value.state.residents.r;
    lead.image.current = {
      url: "http://forest.test/test-character-tall.svg",
      reference: "test",
      width: 120,
      height: 360,
    };
    lead.image.placement = { scale: 70, offsetX: 20, markerHeight: 0 };
    const companion = structuredClone(lead);
    companion.image.current = {
      url: "http://forest.test/test-character-wide.svg",
      reference: "test",
      width: 360,
      height: 120,
    };
    companion.image.placement = { scale: 130, offsetX: -20, markerHeight: 0 };
    state.world.value.state.residents.s = companion;
    const third = structuredClone(lead);
    third.image.current = {
      url: "http://forest.test/test-character-tall.svg",
      reference: "test",
      width: 120,
      height: 360,
    };
    third.image.placement = { scale: 100, offsetX: 0, markerHeight: 0 };
    state.world.value.state.residents.t = third;
    state.reader.story.value.participants = ["r", "s"];
    const markerSize = () => {
      const marker = host.shadowRoot.querySelector(".emotion-bubble");
      if (!marker)
        throw new Error(
          JSON.stringify({
            speaker: state.reader.story.value.segments[0].speakerId,
            participants: state.reader.story.value.participants,
            index: state.reader.index,
            segment: state.reader.story.value.segments[0],
            residents: Object.keys(state.world.value.state.residents),
          }),
        );
      return parseFloat(getComputedStyle(marker).fontSize);
    };
    const leadSize = markerSize();
    state.reader.story.value.segments[0].speakerId = "s";
    window.testRender();
    const marker = host.shadowRoot.querySelector(".emotion-bubble");
    return {
      leadSize,
      companionSize: parseFloat(getComputedStyle(marker).fontSize),
      actorCount: host.shadowRoot.querySelectorAll(".stage-spot").length,
      anchoredToFigure: marker.parentElement.classList.contains("story-figure-body"),
      centeredAtOffset: getComputedStyle(marker).left,
      viewport: host.getBoundingClientRect().width,
      imageRatio: marker.parentElement.style.getPropertyValue("--story-image-ratio"),
    };
  });
  assert.equal(scaledMarks.actorCount, 2);
  assert.equal(scaledMarks.anchoredToFigure, true);
  assert.equal(scaledMarks.viewport, 320);
  assert.ok(scaledMarks.companionSize > scaledMarks.leadSize * 2);
  assert.ok(parseFloat(scaledMarks.centeredAtOffset) > 0);
  assert.equal(scaledMarks.imageRatio, "3");
  const imageAnchors = await page.locator("#host").evaluate(async (host) => {
    const waitImages = [...host.shadowRoot.querySelectorAll(".figure-image")].map((image) =>
      image.decode().catch(() => {}),
    );
    await Promise.all(waitImages);
    const state = window.testState;
    const results = [];
    for (const count of [1, 2, 3]) {
      state.reader.story.value.participants = ["r", "s", "t"].slice(0, count);
      state.reader.story.value.segments[0].speakerId = count === 1 ? "r" : "s";
      window.testRender();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const marker = host.shadowRoot.querySelector(".emotion-bubble");
      const body = marker.parentElement;
      const image = body.querySelector(".figure-image");
      const markRect = marker.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      const paintedHeight = Math.min(imageRect.height, imageRect.width / (image.naturalWidth / image.naturalHeight));
      const paintedTop = imageRect.bottom - paintedHeight;
      results.push({
        count,
        leftDelta: Math.abs(markRect.left + markRect.width / 2 - (imageRect.left + imageRect.width / 2)),
        topDelta: markRect.bottom - paintedTop,
        markerBottom: getComputedStyle(marker).bottom,
        body: {
          top: body.getBoundingClientRect().top,
          bottom: body.getBoundingClientRect().bottom,
          width: body.clientWidth,
          height: body.clientHeight,
        },
        image: {
          top: imageRect.top,
          bottom: imageRect.bottom,
          width: imageRect.width,
          height: imageRect.height,
          paintedTop,
        },
      });
    }
    return results;
  });
  for (const result of imageAnchors) {
    assert.ok(
      result.leftDelta < 2,
      `badge is centered over its scaled picture at ${result.count} actors: ${JSON.stringify(result)}`,
    );
    assert.ok(
      result.topDelta >= 2 && result.topDelta <= 10,
      `badge meets picture head at ${result.count} actors: ${JSON.stringify(result)}`,
    );
  }
  await page.getByRole("button", { name: "다 읽고 보관" }).click();
  assert.equal(await page.evaluate(() => window.finished), true);
  console.log("Story viewport, choice and final action: OK");
} finally {
  await browser?.close();
  await rm(temp, { recursive: true, force: true });
}
