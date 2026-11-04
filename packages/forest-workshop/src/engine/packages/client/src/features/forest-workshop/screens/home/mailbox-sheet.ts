import type { AppState, Controller } from "../../app/controller";
import { button, errorLine, h, statusLine } from "../../app/dom";
import { sheetDialog } from "../chrome/sheet";
import { pagePicker } from "../chrome/page-picker";
export function renderMailboxSheet(state: AppState, controller: Controller) {
  const view = state.sheet,
    world = state.world?.state === "ready" ? state.world.value : null;
  if (view?.kind !== "mailbox" || !world) return null;
  const completed = world.state.activities?.completed ?? [];
  const letters = (world.state.mailbox?.letters ?? [])
    .filter(
      (letter) =>
        !completed.some(
          (activity) =>
            activity.mailId === letter.id &&
            world.state.mailbox.letters.some((item) => item.id === `resident-${activity.id}`),
        ),
    )
    .filter((l) => l.archived === Boolean(view.archived))
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
  const source = completed.find((item) => item.mailId === view.id);
  const generated = source
    ? world.state.mailbox.letters.find((item) => item.id === `resident-${source.id}`)
    : undefined;
  const selected = generated ?? world.state.mailbox.letters.find((item) => item.id === view.id);
  const page = Math.max(0, Math.min(view.page ?? 0, Math.ceil(letters.length / 4) - 1));
  const activity = source && selected?.id === source.mailId ? source : undefined;
  const failure = activity ? state.letterErrors?.[`${world.worldId}:${activity.id}`] : undefined;
  const busy = Boolean(state.busy[`mail:${selected?.id}`] || (activity && state.busy[`letter:${activity.id}`]));
  return sheetDialog("fw-mailbox", "우편함", [
    h(
      "div",
      { className: "mail-tabs", attrs: { role: "group", "aria-label": "우편 분류" } },
      [false, true].map((archived) =>
        button(
          archived ? "보관함" : "받은 편지",
          () => controller.setMailboxView({ archived, page: 0, id: undefined }),
          { variant: "secondary", attrs: { "aria-pressed": String(Boolean(view.archived) === archived) } },
        ),
      ),
    ),
    selected
      ? h("article", { className: "letter-detail" }, [
          h("h3", { text: selected.title }),
          h("p", { className: "muted", text: `${selected.sender} · ${selected.createdAt.slice(0, 10)}` }),
          activity && !generated && busy
            ? statusLine("주민의 편지를 준비하고 있어요. 완성되면 바로 보여드릴게요.")
            : h("div", { className: "letter-content" }, [
                activity
                  ? h("div", { className: "letter-retry-state" }, [
                      h("h4", { text: "주민 편지를 기다리고 있어요" }),
                      failure
                        ? errorLine(failure.message)
                        : h("p", { text: "활동 기록은 보관되어 있어요. 주민의 말로 쓴 편지를 받아 보세요." }),
                      h("details", {}, [
                        h("summary", { text: "보관된 활동 기록 확인" }),
                        h("p", { className: "letter-body", text: selected.body }),
                      ]),
                      failure && failure.code !== "invalid_payload"
                        ? button(
                            "편지 모델 설정",
                            () => {
                              controller.setSettingsSection("manage");
                              controller.navigate("settings");
                            },
                            { variant: "secondary" },
                          )
                        : null,
                    ])
                  : h("p", { className: "letter-body", text: selected.body }),
              ]),
          activity && !busy
            ? button(
                generated ? "주민 편지 보기" : busy ? "편지를 준비하고 있어요…" : "편지 다시 불러오기",
                () =>
                  generated
                    ? void controller.openActivityLetter(generated.id)
                    : void controller.generateResidentLetter(activity.id),
                { disabled: busy },
              )
            : null,
          button(
            selected.archived ? "받은 편지로" : "보관하기",
            () => void controller.archiveLetter(selected.id, !selected.archived),
            { disabled: busy },
          ),
          button("목록으로", () => controller.setMailboxView({ id: undefined }), {
            variant: "secondary",
            disabled: busy,
          }),
        ])
      : h(
          "div",
          { className: "mail-list" },
          letters.length
            ? letters
                .slice(page * 4, page * 4 + 4)
                .map((letter) =>
                  button(
                    `${letter.readAt ? "읽음" : "새 편지"} · ${letter.sender} · ${letter.title}`,
                    () => void controller.openLetter(letter.id),
                    { variant: "secondary", disabled: Boolean(state.busy[`mail:${letter.id}`]) },
                  ),
                )
            : [h("p", { className: "empty", text: view.archived ? "보관한 편지가 없어요." : "받은 편지가 없어요." })],
        ),
    !selected
      ? pagePicker(
          "편지 목록 고르기",
          page,
          Array.from(
            { length: Math.ceil(letters.length / 4) },
            (_, i) => `${i + 1} · ${i * 4 + 1}–${Math.min(letters.length, i * 4 + 4)}`,
          ),
          (page) => controller.setMailboxView({ page }),
        )
      : null,
    button("닫기", () => controller.closeSheet(), { variant: "secondary" }),
  ]);
}
