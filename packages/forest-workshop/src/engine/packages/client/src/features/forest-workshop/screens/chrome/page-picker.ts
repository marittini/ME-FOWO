import { h } from "../../app/dom";
/** Sequential paging: fixed-size arrows, a readable range, no dropdown. */
export function pagePicker(label: string, page: number, groups: string[], onChange: (page: number) => void) {
  if (groups.length <= 1) return null;
  const current = Math.max(0, Math.min(page, groups.length - 1));
  const arrow = (delta: number) =>
    h("button", {
      className: "page-arrow",
      text: delta < 0 ? "‹" : "›",
      disabled: current + delta < 0 || current + delta >= groups.length,
      attrs: { type: "button", "aria-label": `${label} · ${delta < 0 ? "이전" : "다음"} 페이지` },
      on: { click: () => onChange(current + delta) },
    });
  return h("nav", { className: "page-picker", attrs: { "aria-label": label } }, [
    arrow(-1),
    h("span", { className: "page-picker-label", attrs: { "aria-live": "polite" } }, [
      h("strong", { text: `${current + 1} / ${groups.length}` }),
      h("small", { text: groups[current] }),
    ]),
    arrow(1),
  ]);
}
