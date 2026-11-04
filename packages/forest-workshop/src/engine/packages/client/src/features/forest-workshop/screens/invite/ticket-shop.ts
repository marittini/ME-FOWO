import type { AppState, Controller } from "../../app/controller";
import { h } from "../../app/dom";
import { UI_ART, NAV_ART, assetImage } from "../../app/assets";
import { ICONS } from "../chrome/icons";
export function ticketShop(state: AppState, controller: Controller) {
  const tickets = state.world?.state === "ready" ? state.world.value.state.wallet.tickets : 0;
  const gold = state.world?.state === "ready" ? state.world.value.state.wallet.gold : 0;
  const goldTab = state.sheet?.kind === "ticket-shop" && state.sheet.tab === "gold";
  const rate = state.content?.invite.goldPerTicket ?? 100;
  return h("div", { className: "sheet-backdrop player-popup" }, [
    h(
      "section",
      {
        className: "sheet card ticket-store",
        attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": "fw-ticket-shop" },
      },
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
        h("div", { className: "ticket-store-balance", attrs: { "aria-live": "polite" } }, [
          ICONS.ticket("icon"),
          h("span", { text: "보유 초대권" }),
          h("strong", { text: tickets.toLocaleString("ko-KR") }),
        ]),
        h("p", { className: "ticket-store-balance", text: `보유 골드 ${gold.toLocaleString("ko-KR")} G` }),
        h("div", { className: "segmented", attrs: { role: "tablist", "aria-label": "상점 종류" } }, [
          h("button", {
            className: `segment${!goldTab ? " selected" : ""}`,
            text: "초대권 리필",
            attrs: { type: "button", role: "tab", "aria-selected": String(!goldTab) },
            on: { click: () => controller.setTicketShopTab("refill") },
          }),
          h("button", {
            className: `segment${goldTab ? " selected" : ""}`,
            text: "골드 교환",
            attrs: { type: "button", role: "tab", "aria-selected": String(goldTab) },
            on: { click: () => controller.setTicketShopTab("gold") },
          }),
        ]),
        h("p", {
          className: "hint",
          text: goldTab
            ? `초대권 1장당 ${rate} G · 실제 결제는 없어요.`
            : "모든 초대권 묶음은 무료예요. 제한 없이 다시 받을 수 있어요.",
        }),
        h("p", {
          className: "ticket-store-received",
          text: state.ticketRefillMessage ?? "원하는 묶음을 골라 주세요.",
          attrs: { role: "status" },
        }),
        !goldTab
          ? h(
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
                    assetImage(pack === "chest" ? UI_ART.gift : NAV_ART.invite, {
                      className: "ticket-pack-art",
                      fallback: () => ICONS.ticket("icon"),
                    }),
                    h("span", { className: "ticket-pack-reward" }, [
                      h("small", { text: title }),
                      h("strong", { text: `${amount.toLocaleString("ko-KR")}장` }),
                    ]),
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
            )
          : null,
        goldTab
          ? h(
              "div",
              { className: "ticket-shop-list" },
              [1, 10, 100].map((amount) =>
                h("div", { className: "ticket-pack" }, [
                  h("span", { text: `초대권 ${amount}장 사용 → ${amount * rate} G 받기` }),
                  h("button", {
                    className: "button",
                    text: `초대권 ${amount}장 사용`,
                    attrs: { type: "button", "aria-label": `초대권 ${amount}장을 사용해 ${amount * rate} G 받기` },
                    disabled: Boolean(state.busy[`tickets-gold:${amount}`]) || tickets < amount,
                    on: { click: () => void controller.buyGold(amount) },
                  }),
                ]),
              ),
            )
          : null,
      ],
    ),
  ]);
}
