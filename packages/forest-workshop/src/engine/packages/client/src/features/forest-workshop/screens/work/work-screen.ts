// Work status and production settings share a facility; settings contains recipes, targets and priorities.
import type { AppState, Controller } from "../../app/controller";
import { h, statusLine } from "../../app/dom";
import { draftRules, isDraftDirty } from "../../app/production-actions";
import type { FacilityState, GameContent, Rule, WorldView } from "../../app/types";
import { pagePicker } from "../chrome/page-picker";
import { card, renderFrame } from "../chrome/frame";
import { assetImage } from "../../app/assets";
import { ICONS, type IconFactory } from "../chrome/icons";
import { residentAvatar } from "../residents/resident-figure";
import { renderAssignSheet } from "./assign-sheet";
import {
  crewBonus,
  crewRun,
  facilityPicture,
  facilityOf,
  percent,
  unlockParts,
  formatDuration,
  itemName,
  itemTile,
  jobProgress,
  recipeOf,
  runMs,
  waitingText,
} from "./production-view";

const FIELDS: ReadonlyArray<{ field: string; label: string; icon: IconFactory }> = [
  { field: "gather", label: "채집", icon: ICONS.leaf },
  { field: "grow", label: "재배", icon: ICONS.sprout },
  { field: "survey", label: "조사", icon: ICONS.search },
  { field: "process", label: "가공", icon: ICONS.jar },
  { field: "craft", label: "제작", icon: ICONS.hammer },
];

function fieldTabs(content: GameContent, world: WorldView, facilityId: string, controller: Controller) {
  return h(
    "div",
    { className: "field-tabs work-fields", attrs: { role: "tablist", "aria-label": "작업 분야" } },
    FIELDS.map((field) => {
      const facility = content.facilities.find((candidate) => candidate.field === field.field);
      if (!facility) return null;
      const current = facility.id === facilityId;
      const open = world.state.production.facilities[facility.id]?.unlocked ?? false;
      return h(
        "button",
        {
          className: `field-tab${current ? " current" : ""}${open ? "" : " closed"}`,
          attrs: {
            type: "button",
            role: "tab",
            "aria-selected": current ? "true" : "false",
            "aria-label": open ? field.label : `${field.label} (해금 전)`,
          },
          on: { click: () => controller.selectFacility(facility.id) },
        },
        [
          assetImage(
            (
              {
                gather: "items/herb.webp",
                grow: "items/wheat.webp",
                survey: "ui/nav-explore.webp",
                process: "items/berry-jam.webp",
                craft: "ui/nav-work.webp",
              } as Record<string, string>
            )[field.field] ?? null,
            { className: "field-art", fallback: () => field.icon("icon field-glyph") },
          ),
          h("span", { text: field.label }),
          open ? null : h("span", { className: "lock-tag" }, [ICONS.lock("icon tiny")]),
        ],
      );
    }),
  );
}

/** 해금 전: the facility, its condition with progress, and 해금 once every part holds (plan §7.2-F). */
function unlockCard(
  state: AppState,
  content: GameContent,
  world: WorldView,
  facilityId: string,
  controller: Controller,
) {
  const definition = facilityOf(content, facilityId);
  const parts = unlockParts(content, world.state, facilityId);
  const ready = parts.every((part) => part.met);
  const busy = Boolean(state.busy[`unlock:${facilityId}`]);
  return card(
    null,
    [
      h("div", { className: "facility-entry" }, [
        h("span", { className: "facility-open closed" }, [
          h("span", { className: "facility-art closed" }, [
            facilityPicture(facilityId),
            h("span", { className: "facility-lock" }, [ICONS.lock("icon")]),
          ]),
          h("span", { className: "facility-text" }, [
            h("strong", { text: `${definition?.name ?? facilityId} · 해금 전` }),
            h("span", { text: definition?.description ?? "" }),
          ]),
        ]),
      ]),
      h("div", { className: "plan-block" }, [
        h("span", { className: "plan-label", text: "해금 조건" }),
        h(
          "ul",
          { className: "unlock-list" },
          parts.map((part) =>
            h("li", { className: part.met ? "met" : "" }, [
              (part.met ? ICONS.check : ICONS.hourglass)("icon"),
              h("span", { text: part.text }),
              h("strong", { text: `${Math.min(part.have, part.need)} / ${part.need}` }),
            ]),
          ),
        ),
      ]),
      h(
        "button",
        {
          className: "button",
          attrs: { type: "button", "data-wide": "" },
          disabled: !ready || busy,
          on: { click: () => void controller.unlockFacility(facilityId) },
        },
        [h("span", { text: busy ? "여는 중…" : ready ? "시설 열기" : "조건을 채우면 열 수 있어요" })],
      ),
    ],
    { className: "work-card" },
  );
}

function facilityCard(
  state: AppState,
  content: GameContent,
  world: WorldView,
  facilityId: string,
  facility: FacilityState,
  controller: Controller,
) {
  const definition = facilityOf(content, facilityId);
  const bonus = crewBonus(content, world.state, facilityId);
  const cost =
    facility.level < content.production.maxLevel ? content.production.upgradeCosts[facility.level - 1] : undefined;
  return h("div", { className: "facility-entry" }, [
    h(
      "button",
      {
        className: "facility-open",
        attrs: { type: "button", "aria-label": `${definition?.name ?? "시설"} — 시설과 창고 열기` },
        on: {
          click: () => {
            controller.setFacilitiesTab("facilities");
            controller.navigate("facilities");
          },
        },
      },
      [
        h("span", { className: "facility-art" }, [facilityPicture(facilityId)]),
        h("span", { className: "facility-text" }, [
          h("strong", { text: `${definition?.name ?? facilityId} Lv. ${facility.level}` }),
          h("span", { className: "crew-line" }, [
            bonus.resident ? residentAvatar(bonus.resident) : null,
            bonus.resident
              ? `${bonus.resident.displayName} · ${bonus.matches ? `+${percent(bonus.passive)}${bonus.talent ? ` · 특기 ${bonus.talent.name}` : ""}` : "분야가 달라 효과 없음"}`
              : "배치한 주민 없음",
            bonus.set ? ` · 세트 +${percent(bonus.set)}` : "",
          ]),
        ]),
      ],
    ),
    cost !== undefined
      ? h("button", {
          className: "outline-button",
          text: `${cost.toLocaleString("ko-KR")} G · 강화`,
          attrs: { type: "button", "aria-label": `${definition?.name ?? "시설"} 강화 ${cost} 골드` },
          disabled: world.state.wallet.gold < cost || Boolean(state.busy[`upgrade:${facilityId}:${facility.level}`]),
          on: { click: () => void controller.upgradeFacility(facilityId, facility.level) },
        })
      : null,
    h(
      "button",
      {
        className: "outline-button",
        attrs: { type: "button", "aria-label": `${definition?.name ?? "시설"} 배치 변경` },
        on: { click: () => controller.openSheet({ kind: "assign", facilityId }) },
      },
      [ICONS.swap("icon"), h("span", { text: "배치 변경" })],
    ),
  ]);
}

function recipeCard(content: GameContent, rule: Rule | undefined, level: number, crew: ReturnType<typeof crewBonus>) {
  const recipe = rule ? recipeOf(content, rule.recipeId) : null;
  if (!recipe) {
    return h("div", { className: "recipe" }, [
      h("span", { className: "recipe-art" }, [ICONS.jar("icon big")]),
      h("span", { className: "recipe-text" }, [
        h("strong", { text: "제작법" }),
        h("span", { text: "아래 우선순위에서 제작법을 추가해 주세요." }),
      ]),
    ]);
  }
  const output = Object.keys(recipe.outputs)[0]!;
  const run = crewRun(recipe, crew);
  const oneRun = runMs(content, recipe, level, run.extraBonus);
  const flow = Object.entries(run.inputs).map(([item, amount]) => `${itemName(content, item)} ${amount}`);
  return h("div", { className: "recipe" }, [
    h("span", { className: "recipe-art" }, [itemTile(output, "big")]),
    h("span", { className: "recipe-text" }, [
      h("strong", { text: recipe.name }),
      h("span", { text: recipe.description }),
      h("span", {
        className: "recipe-flow",
        text: `${flow.length ? `${flow.join(" · ")} → ` : ""}${Object.entries(recipe.outputs)
          .map(([item, amount]) => `${itemName(content, item)} ${amount}`)
          .join(" · ")} · 1회 ${formatDuration(oneRun)}`,
      }),
      run.talentApplies && crew.talent
        ? h("span", { className: "talent-note" }, [
            ICONS.sparkle("icon tiny"),
            ` 특기 ${crew.talent.name}: ${crew.talent.description}`,
          ])
        : null,
    ]),
  ]);
}

function materialsBlock(content: GameContent, world: WorldView, rule: Rule | undefined) {
  const recipe = rule ? recipeOf(content, rule.recipeId) : null;
  const inputs = recipe ? Object.entries(recipe.inputs) : [];
  const production = world.state.production;
  return h("div", { className: "plan-block" }, [
    h("span", { className: "plan-label", text: "재료 사용 설정" }),
    inputs.length === 0
      ? h("p", { className: "muted", text: "이 제작법은 재료 없이 숲에서 바로 모아요." })
      : h(
          "div",
          { className: "usage-list" },
          inputs.map(([itemId]) => {
            const held = world.state.inventory[itemId] ?? 0;
            const guarded = production.protectedStock[itemId] ?? 0;
            return h("div", { className: "usage" }, [
              h("span", { className: "usage-item" }, [
                itemTile(itemId),
                h("span", { text: itemName(content, itemId) }),
              ]),
              h("span", { className: "usage-cell" }, [
                h("small", { text: "보유" }),
                h("strong", { text: String(held) }),
              ]),
              h("span", { className: "usage-cell" }, [
                h("small", { text: "보호" }),
                h("strong", { text: String(guarded) }),
              ]),
              h("span", { className: "usage-cell available" }, [
                h("small", { text: "사용 가능" }),
                h("strong", { text: String(Math.max(0, held - guarded)) }),
              ]),
            ]);
          }),
        ),
  ]);
}

function priorityList(
  content: GameContent,
  facilityId: string,
  rules: Rule[],
  selectedId: string | undefined,
  controller: Controller,
) {
  const selectedRule = rules.find((rule) => rule.policyId === selectedId) ?? rules[0];
  const prioritySelect = pagePicker(
    "작업 우선순위 물품",
    Math.max(
      0,
      rules.findIndex((rule) => rule === selectedRule),
    ),
    rules.map((rule, index) => `${index + 1}. ${recipeOf(content, rule.recipeId)?.name ?? rule.recipeId}`),
    (index) => controller.selectRule(facilityId, rules[index]!.policyId),
  );
  return h("div", { className: "plan-block" }, [
    h("span", { className: "plan-label" }, [
      "작업 우선순위 ",
      h("small", { text: "(위의 작업부터 차례대로 진행해요)" }),
    ]),
    rules.length ? prioritySelect : null,
    ...rules
      .filter((rule) => rule === selectedRule)
      .map((rule) => {
        const index = rules.indexOf(rule);
        const recipe = recipeOf(content, rule.recipeId);
        const output = recipe ? Object.keys(recipe.outputs)[0]! : "";
        return h(
          "div",
          { className: `priority-row${rule.policyId === selectedId ? " selected" : ""}${rule.enabled ? "" : " off"}` },
          [
            h("span", { className: "rank", text: String(index + 1) }),
            h(
              "button",
              {
                className: "priority-main",
                attrs: { type: "button", "aria-pressed": rule.policyId === selectedId ? "true" : "false" },
                on: {
                  click: () => {
                    controller.selectRule(facilityId, rule.policyId);
                    controller.setWorkSection("recipe");
                  },
                },
              },
              [itemTile(output), h("span", { className: "priority-name", text: recipe?.name ?? rule.recipeId })],
            ),
            h("button", {
              className: `chip-toggle${rule.enabled ? " on" : ""}`,
              text: rule.enabled ? "켜짐" : "꺼짐",
              attrs: {
                type: "button",
                "aria-pressed": rule.enabled ? "true" : "false",
                "aria-label": `${recipe?.name ?? ""} ${rule.enabled ? "끄기" : "켜기"}`,
              },
              on: { click: () => controller.toggleRule(facilityId, rule.policyId) },
            }),
            h("span", { className: "order-buttons" }, [
              h(
                "button",
                {
                  className: "mini",
                  attrs: { type: "button", "aria-label": "위로" },
                  disabled: index === 0,
                  on: { click: () => controller.moveRule(facilityId, rule.policyId, -1) },
                },
                [ICONS.up("icon")],
              ),
              h(
                "button",
                {
                  className: "mini",
                  attrs: { type: "button", "aria-label": "아래로" },
                  disabled: index === rules.length - 1,
                  on: { click: () => controller.moveRule(facilityId, rule.policyId, 1) },
                },
                [ICONS.down("icon")],
              ),
            ]),
          ],
        );
      }),
    h("p", {
      className: "muted",
      text: "제작법은 기본으로 켜져 있어요. 필요에 따라 끄거나 목표 재고와 우선순위를 바꿀 수 있어요.",
    }),
  ]);
}

function currentWork(state: AppState, content: GameContent, world: WorldView, facility: FacilityState) {
  if (!facility.job) {
    return h("div", { className: "plan-row" }, [
      h("span", { className: "plan-label", text: "현재 작업" }),
      h("span", { className: "plan-progress wide" }, [
        h("span", { className: "muted", text: "쉬는 중" }),
        h("span", { className: "bar" }),
      ]),
    ]);
  }
  const recipe = recipeOf(content, facility.job.recipeId);
  const output = Object.keys(facility.job.outputs)[0]!;
  const progress = jobProgress(state, world, facility.job);
  return h("div", { className: "plan-row current-work" }, [
    h("span", { className: "plan-label", text: "현재 작업" }),
    itemTile(output),
    h("span", { className: "plan-progress" }, [
      h("span", { className: "muted", text: `${recipe?.name ?? "작업"} · 진행 중` }),
      progress.bar,
    ]),
    progress.countdown,
  ]);
}

/** Offer a useful next step for the actual server-reported waiting reason. */
function waitingGuide(content: GameContent, world: WorldView, facilityId: string, controller: Controller) {
  const waiting = world.state.production.facilities[facilityId]?.waiting;
  if (!waiting) return null;
  const actions: HTMLElement[] = [];
  if (waiting.reason === "no_rules") {
    actions.push(
      h("button", {
        className: "outline-button",
        text: "생산 순서 설정하기",
        attrs: { type: "button" },
        on: { click: () => controller.setWorkSection("priority") },
      }),
    );
  } else if (waiting.reason === "queue_empty" || waiting.reason === "target_reached") {
    actions.push(
      h("button", {
        className: "outline-button",
        text: waiting.reason === "target_reached" ? "목표 재고 바꾸기" : "생산 설정 열기",
        attrs: { type: "button" },
        on: { click: () => controller.setWorkSection("recipe") },
      }),
    );
  } else if (waiting.reason === "materials" && waiting.itemId) {
    const itemId = waiting.itemId;
    const sources = [
      ...new Set(
        content.recipes.filter((recipe) => (recipe.outputs[itemId] ?? 0) > 0).map((recipe) => recipe.facilityId),
      ),
    ].filter((id) => id !== facilityId && world.state.production.facilities[id]);
    for (const id of sources) {
      const facility = content.facilities.find((entry) => entry.id === id);
      if (!facility) continue;
      const unlocked = world.state.production.facilities[id]?.unlocked;
      actions.push(
        h("button", {
          className: "outline-button",
          text: `${itemName(content, itemId)} 얻는 곳 · ${facility.name}${unlocked ? "" : " (열기 필요)"}`,
          attrs: { type: "button" },
          on: { click: () => controller.selectFacility(id) },
        }),
      );
    }
  }
  return h("div", { className: "waiting-guide" }, [
    h("p", { className: "hint", text: waitingText(content, waiting) }),
    ...actions,
  ]);
}

function productionSettings(
  state: AppState,
  content: GameContent,
  world: WorldView,
  facilityId: string,
  facility: FacilityState,
  rules: Rule[],
  selected: Rule | undefined,
  controller: Controller,
) {
  const pages = Math.max(1, Math.ceil(rules.length / 4));
  const page = Math.min(state.work.recipePage ?? 0, pages - 1);
  const dirty = isDraftDirty(state, world.state.production, facilityId);
  const advanced = h(
    "details",
    {
      className: "production-manual",
      attrs: state.work.advancedOpen ? { open: "" } : {},
      on: { toggle: () => controller.rememberProductionDetails(advanced.open) },
    },
    [
      h("summary", { text: "켜짐 · 작업 순서 직접 설정", attrs: { id: "fw-production-manual" } }),
      recipeCard(content, selected, facility.level, crewBonus(content, world.state, facilityId)),
      h("p", {
        className: "hint",
        text: `전 품목 공동 목표 ${world.state.production.sharedTargetStock ?? 30}개 · 품목별 켜짐과 순서만 아래에서 바꿔요.`,
      }),
      materialsBlock(content, world, selected),
      h("h3", { className: "section-title", text: "작업 우선순위" }),
      priorityList(content, facilityId, rules, selected?.policyId, controller),
      h("div", { className: "rule-actions" }, [
        h("button", {
          className: "button",
          text: state.busy[`rules:${facilityId}`] ? "적용 중…" : dirty ? "이 시설 설정 적용" : "적용됨",
          attrs: { type: "button" },
          disabled: !facility.unlocked || !dirty || Boolean(state.busy[`rules:${facilityId}`]),
          on: { click: () => void controller.applyRules(facilityId) },
        }),
        h("button", {
          className: "button secondary",
          text: "기본 추천 불러오기",
          attrs: { type: "button" },
          disabled: !facility.unlocked,
          on: { click: () => controller.recommendRules(facilityId) },
        }),
        dirty
          ? h("button", {
              className: "link-button",
              text: "되돌리기",
              attrs: { type: "button" },
              on: { click: () => controller.discardDraft(facilityId) },
            })
          : null,
      ]),
    ],
  );
  const quantity = h("input", {
    className: "input step-value",
    attrs: {
      id: "fw-production-goal",
      type: "number",
      min: "1",
      max: "999",
      step: "1",
      required: "",
      inputmode: "numeric",
      enterkeyhint: "done",
      "aria-label": "공동 목표 재고",
    },
    on: {
      input: () => {
        if (selected && quantity.checkValidity()) controller.rememberSharedTarget(quantity.valueAsNumber);
      },
      keydown: (event) => {
        if ((event as KeyboardEvent).key === "Enter") {
          event.preventDefault();
          quantity.blur();
        }
      },
    },
  });
  quantity.value = String(state.work.sharedTargetDraft ?? world.state.production.sharedTargetStock ?? 30);
  const step = (delta: number) =>
    h("button", {
      className: "step",
      text: delta < 0 ? "−" : "+",
      attrs: { type: "button", "aria-label": `공동 목표 재고 ${delta < 0 ? "1 줄이기" : "1 늘리기"}` },
      on: {
        click: () => {
          if (!selected) return;
          const current = quantity.checkValidity()
            ? quantity.valueAsNumber
            : (world.state.production.sharedTargetStock ?? 30);
          quantity.value = String(Math.max(1, Math.min(999, current + delta)));
          controller.rememberSharedTarget(quantity.valueAsNumber);
        },
      },
    });
  const picker = h("div", { className: "stepper wide compact" }, [step(-1), quantity, step(1)]);
  return [
    h("h2", { className: "section-title", text: "만들 물건을 골라 주세요" }),
    !facility.unlocked
      ? h("p", { className: "hint", text: "해금 전 시설이에요. 생산 준비만 미리 설정할 수 있어요." })
      : null,
    h(
      "div",
      { className: "recipe-choices goal-choices", attrs: { role: "group", "aria-label": "생산 물품 고르기" } },
      rules.slice(page * 4, page * 4 + 4).map((rule) => {
        const recipe = recipeOf(content, rule.recipeId),
          output = recipe ? Object.keys(recipe.outputs)[0] : undefined;
        return h(
          "button",
          {
            className: "recipe-choice",
            attrs: {
              type: "button",
              "aria-pressed": String(rule.policyId === selected?.policyId),
              "aria-label": `${recipe?.name ?? rule.recipeId} 생산 설정${rule.enabled ? "" : " (꺼짐)"}`,
            },
            on: { click: () => controller.selectRule(facilityId, rule.policyId) },
          },
          [output ? itemTile(output) : null, h("span", { text: recipe?.name ?? rule.recipeId })],
        );
      }),
    ),
    pagePicker(
      "생산 품목",
      page,
      Array.from({ length: pages }, (_, index) => `${index * 4 + 1}–${Math.min(rules.length, index * 4 + 4)}`),
      (value) => controller.setRecipePage(value),
    ),
    h("div", { className: "goal-quantity shared-goal" }, [
      h("span", { text: "공동 목표 재고" }),
      picker,
      h("button", {
        className: "outline-button",
        text: "전체 적용",
        attrs: { type: "button" },
        disabled: Boolean(state.busy["shared-target"]),
        on: {
          click: () => {
            if (quantity.reportValidity()) void controller.applySharedTarget(quantity.valueAsNumber);
          },
        },
      }),
    ]),
    selected
      ? h("button", {
          className: "button goal-start",
          text: state.busy["production-tree"]
            ? "생산 준비 중…"
            : `${recipeOf(content, selected.recipeId)?.name ?? "선택 물품"} 자동 생산`,
          attrs: { type: "button" },
          disabled: Boolean(state.busy["production-tree"]),
          on: {
            click: () => {
              if (quantity.reportValidity())
                void controller.applyProductionTree(selected.recipeId, quantity.valueAsNumber);
            },
          },
        })
      : null,
    h("p", {
      className: "hint goal-hint",
      text: "재료는 한 번분 확보 · 다른 품목은 쉬어요",
    }),
    advanced,
  ];
}

function body(state: AppState, content: GameContent, world: WorldView, controller: Controller) {
  const facilityId = state.work.facilityId,
    facility = world.state.production.facilities[facilityId];
  if (!facility) return [statusLine("시설을 불러오는 중…")];
  const rules = draftRules(state, world.state.production, facilityId);
  const selected = rules.find((rule) => rule.policyId === state.work.selected[facilityId]) ?? rules[0];
  const settings = state.work.section === "recipe" || state.work.section === "priority";
  if (!facility.unlocked && !settings)
    return [
      fieldTabs(content, world, facilityId, controller),
      unlockCard(state, content, world, facilityId, controller),
      h("button", {
        className: "button secondary",
        text: "생산 준비 미리 설정",
        attrs: { type: "button" },
        on: { click: () => controller.setWorkSection("recipe") },
      }),
    ];
  return [
    fieldTabs(content, world, facilityId, controller),
    h("div", { className: "segmented", attrs: { role: "tablist", "aria-label": "작업 보기" } }, [
      ...(
        [
          ["status", "작업 현황"],
          ["recipe", "생산 설정"],
        ] as const
      ).map(([id, label]) =>
        h("button", {
          className: `segment${(settings ? id === "recipe" : id === "status") ? " selected" : ""}`,
          text: label,
          attrs: { type: "button", role: "tab", "aria-selected": String(settings ? id === "recipe" : id === "status") },
          on: { click: () => controller.setWorkSection(id) },
        }),
      ),
    ]),
    card(
      null,
      settings
        ? productionSettings(state, content, world, facilityId, facility, rules, selected, controller)
        : [
            h("section", { className: "production-summary", attrs: { "aria-label": "현재 생산 상태" } }, [
              currentWork(state, content, world, facility),
              waitingGuide(content, world, facilityId, controller),
              h("div", { className: "production-order" }, [
                h("span", { text: "적용된 우선순위" }),
                h(
                  "ol",
                  { className: "production-slots" },
                  facility.rules
                    .filter((rule) => rule.enabled)
                    .sort((a, b) => a.priority - b.priority)
                    .map((rule) => h("li", { text: recipeOf(content, rule.recipeId)?.name ?? rule.recipeId })),
                ),
              ]),
            ]),
            facilityCard(state, content, world, facilityId, facility, controller),
          ],
      { className: "work-card" },
    ),
    h("div", { className: "work-stock-actions" }, [
      h("button", {
        className: "button secondary",
        text: "재고 보호",
        attrs: { type: "button" },
        on: {
          click: () => {
            controller.setFacilitiesTab("protection");
            controller.navigate("facilities");
          },
        },
      }),
      h("button", {
        className: "button secondary",
        text: "창고 · 판매",
        attrs: { type: "button" },
        on: {
          click: () => {
            controller.setFacilitiesTab("storage");
            controller.navigate("facilities");
          },
        },
      }),
    ]),
  ];
}

export function renderWorkScreen(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  const sheet =
    world && state.content && state.sheet?.kind === "assign"
      ? renderAssignSheet(state, world, state.content, controller, state.sheet.facilityId)
      : null;
  return renderFrame(state, controller, {
    top: { kind: "sub", title: "공방 작업", back: { route: "home", label: "홈" }, resources: true },
    backdrop: "forest",
    body: world && state.content ? body(state, state.content, world, controller) : [statusLine("세계를 불러오는 중…")],
    nav: true,
    sheet,
  });
}
