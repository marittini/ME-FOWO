// 홈 (board 01-1): top bar with the sign, gold, tickets, gear, weather and mail; the workshop scene; the work-report
// card with 작업 보고 and the 72-hour absence bar (work-report.ts); the story card; the bottom bar. Blocks without their
// feature yet are locked in place (docs/forest-workshop/ui-spec.md). The welcome package opens as a sheet above.
import type { AppState, Controller } from "../../app/controller";
import { modelConnections } from "../settings/settings-screen";
import { button, errorLine, h, statusLine } from "../../app/dom";
import { card, renderFrame } from "../chrome/frame";
import { ICONS } from "../chrome/icons";
import { editingGround, groundActions } from "./ground-editor";
import { renderHomeScene } from "./home-scene";
import { renderStarterKitSheet } from "./starter-kit-sheet";
import { absenceStrip, compactWorkReport, workReportSheet } from "./work-report";

export function renderHomeScreen(state: AppState, controller: Controller) {
  const world = state.world;
  if (!world || world.state !== "ready") {
    return renderFrame(state, controller, {
      top: { kind: "home" },
      backdrop: "forest",
      nav: false,
      body: [
        world?.state === "error"
          ? card(null, [
              errorLine(world.message),
              button("세계 목록으로", () => controller.navigate("worlds"), { variant: "secondary" }),
            ])
          : statusLine("세계를 불러오는 중…"),
      ],
    });
  }
  if (!world.value.state.progress.starterResidentId)
    return renderFrame(state, controller, {
      top: { kind: "sub", title: "공방 시작 준비", resources: false },
      backdrop: "forest",
      nav: false,
      body: [
        card(
          "먼저 함께할 주민을 정해요",
          [
            h("p", { text: "AI 연결을 확인한 뒤 첫 주민을 골라 주세요." }),
            modelConnections(true),
            h("p", {
              className: "hint",
              text: "기본 연결을 사용해도 좋아요. 꾸러미는 주민을 선택한 뒤 받을 수 있어요.",
            }),
            button("처음 함께할 주민 고르기", () => controller.openRegister(1)),
            button("세계 목록으로", () => controller.navigate("worlds"), { variant: "secondary" }),
          ],
          { className: "onboarding-card" },
        ),
      ],
    });
  return renderFrame(state, controller, {
    top: { kind: "home" },
    backdrop: "forest",
    hero: renderHomeScene(state, controller),
    homeLayout: true,
    body: editingGround(state)
      ? [groundActions(state, controller)]
      : [
          compactWorkReport(state, world.value, controller),
          absenceStrip(world.value, state.content, controller),
          h(
            "button",
            {
              className: "home-summary delivery-summary",
              attrs: { type: "button" },
              on: { click: () => controller.openDeliveries() },
            },
            [ICONS.document("icon"), h("span", { text: "오늘의 납품 의뢰" }), ICONS.chevron("icon")],
          ),
        ],
    nav: true,
    sheet:
      state.sheet?.kind === "work-report"
        ? workReportSheet(state, world.value, controller)
        : renderStarterKitSheet(state, controller),
  });
}
