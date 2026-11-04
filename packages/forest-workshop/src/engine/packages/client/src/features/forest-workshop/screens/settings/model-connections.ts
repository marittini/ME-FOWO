import { hostApi } from "../../app/host-api";
import { readModelConnection, writeModelConnection, type GenerationPurpose } from "../../app/preferences";
import { h } from "../../app/dom";

export function modelConnections(
  expanded = false,
  purposes: readonly GenerationPurpose[] = ["story", "profile", "letter"],
) {
  const box = h(
    "div",
    { className: expanded ? "setting-block onboarding-models" : "setting-block" },
    expanded
      ? []
      : [
          h("strong", { text: "AI 모델 연결" }),
          h("p", { className: "muted", text: "이 기기의 설정이에요. 기존 이야기는 바뀌지 않아요." }),
        ],
  );
  const status = h("p", { className: "muted", text: "연결 목록을 불러오는 중…", attrs: { role: "status" } });
  box.append(status);
  void Promise.resolve()
    .then(() => hostApi().get<unknown[]>("/connections"))
    .then((rows) => {
      if (!Array.isArray(rows)) throw new Error("invalid connections");
      const connections = rows.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const row = item as Record<string, unknown>;
        return typeof row.id === "string" && typeof row.name === "string" && row.id.length <= 128
          ? [{ id: row.id, name: row.name, model: typeof row.model === "string" ? row.model : "" }]
          : [];
      });
      status.textContent = expanded
        ? "AI 모델 연결을 확인해 주세요."
        : "선택한 연결을 사용할 수 없으면 해당 생성이 중단돼요.";
      for (const [purpose, label] of [
        ["story", "이야기 생성"],
        ["profile", "주민 설정 제안"],
        ["letter", "주민 편지"],
      ] as const) {
        if (!purposes.includes(purpose)) continue;
        const current = readModelConnection(purpose);
        const select = h("select", {
          className: "input",
          attrs: { "aria-label": label },
          on: {
            change: () => {
              if (!writeModelConnection(purpose as GenerationPurpose, select.value || null)) {
                select.value = readModelConnection(purpose) ?? "";
                status.textContent = "이 기기에 설정을 저장하지 못했어요.";
              } else status.textContent = "연결 설정을 저장했어요.";
            },
          },
        });
        select.append(h("option", { text: "엔진 기본 연결", attrs: { value: "" } }));
        if (current && !connections.some((c) => c.id === current))
          select.append(h("option", { text: "연결을 찾을 수 없어요 — 다시 선택", attrs: { value: current } }));
        for (const connection of connections)
          select.append(
            h("option", {
              text: connection.model ? `${connection.name} · ${connection.model}` : connection.name,
              attrs: { value: connection.id },
            }),
          );
        select.value = current ?? "";
        box.append(
          h("label", { className: "setting-row" }, [h("span", { className: "setting-label", text: label }), select]),
        );
      }
    })
    .catch(() => {
      status.textContent = "연결 목록을 불러오지 못했어요. 엔진 연결을 확인하고 설정을 다시 열어 주세요.";
    });
  if (expanded) return box;
  return h("details", { className: "setting-block" }, [h("summary", { text: "AI 모델 연결 설정" }), box]);
}
