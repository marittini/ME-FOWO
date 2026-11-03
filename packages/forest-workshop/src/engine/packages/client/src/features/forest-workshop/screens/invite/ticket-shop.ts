import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import { ICONS } from "../chrome/icons";
export function ticketShop(state: AppState, controller: Controller) {
  return h("div", { className: "sheet-backdrop player-popup" }, [
    h(
      "section",
      { className: "sheet card", attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-ticket-shop" } },
      [
        h("div", { className: "sheet-head" }, [
          h("h2", { text: "초대권 상점", attrs: { id: "fw-ticket-shop" } }),
          h("button", {
            className: "popup-close",
            text: "×",
            attrs: { type: "button", "aria-label": "초대권 상점 닫기" },
            on: { click: () => controller.closeSheet() },
          }),
        ]),
        h("p", { className: "hint", text: "결제 없이 무료로 받으세요. 횟수·일일 제한 없이 언제든 채울 수 있어요." }),
        h(
          "div",
          { className: "ticket-shop-list" },
          (
            [
              ["small", 10, "작은 초대 묶음"],
              ["large", 100, "넉넉한 초대 주머니"],
              ["chest", 1000, "인연의 보물 상자"],
            ] as const
          ).map(([pack, amount, title]) =>
            h("div", { className: "ticket-pack" }, [
              h("div", { className: "ticket-pack-copy" }, [
                ICONS.ticket("icon"),
                h("strong", { text: title }),
                h("span", { text: `초대권 ${amount}장` }),
              ]),
              h("button", {
                className: "button",
                text: "무료로 받기",
                attrs: { type: "button", "aria-label": `초대권 ${amount}장 무료로 받기` },
                disabled: Boolean(state.busy["tickets-refill"]),
                on: { click: () => void controller.refillTickets(pack) },
              }),
            ]),
          ),
        ),
      ],
    ),
  ]);
}
