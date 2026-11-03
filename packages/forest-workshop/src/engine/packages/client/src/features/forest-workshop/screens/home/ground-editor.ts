import type { AppState, Controller } from "../../app/controller";
import { button, h } from "../../app/dom";

/** Stored coordinates refer to the visible scene, independent of the backdrop camera crop. */
export function positionBoard(prop: HTMLElement, value: { x: number; y: number }) {
  prop.style.cssText = "inset:0;width:100%;height:100%;left:0;top:0;";
  const board = prop.querySelector<HTMLElement>(".scene-board");
  if (board)
    board.style.cssText = `left:clamp(12px,calc(${value.x}% - 32px),calc(100% - 76px));top:clamp(12px,calc(${value.y}% - 32px),calc(100% - 76px));width:64px;`;
}

export function editingGround(state: AppState) {
  return (
    Boolean(state.groundEditingWorld) &&
    state.world?.state === "ready" &&
    state.groundEditingWorld === state.world.value.worldId
  );
}

export function groundOverlay(state: AppState, controller: Controller, cast: HTMLElement | null) {
  if (state.world?.state !== "ready") return null;
  const world = state.world.value;
  const ground = {
    ...(state.settingsGroundDraft?.worldId === world.worldId
      ? state.settingsGroundDraft.value
      : world.state.settings.ground),
  };
  const overlay = h("div", { className: "ground-overlay", attrs: { "aria-label": "홈 이동영역 편집" } });
  const area = h("div", { className: "ground-selection" }, [
    h("span", { className: "ground-caption", text: "주민 이동 가능 영역" }),
  ]);
  const draw = () => {
    const style = `left:${ground.left}%;top:${ground.top}%;width:${ground.right - ground.left}%;height:${ground.bottom - ground.top}%;`;
    area.style.cssText = style;
    if (cast) cast.style.cssText = style + "right:auto;bottom:auto;padding:0;";
  };
  for (const [key, label] of [
    ["left", "왼쪽"],
    ["right", "오른쪽"],
    ["top", "위쪽"],
    ["bottom", "아래쪽"],
  ] as const) {
    const handle = h("button", {
      className: `ground-handle ${key}`,
      text: key === "left" || key === "right" ? "↔" : "↕",
      attrs: { type: "button", "aria-label": `이동영역 ${label} 경계 조절` },
    });
    const change = (value: number) => {
      const min =
        key === "left" ? 0 : key === "right" ? ground.left + 20 : key === "top" ? 35 : Math.max(55, ground.top + 10);
      const max =
        key === "left"
          ? ground.right - 20
          : key === "right"
            ? 100
            : key === "top"
              ? Math.min(85, ground.bottom - 10)
              : 100;
      ground[key] = Math.round(Math.max(min, Math.min(max, value)));
      controller.rememberGround(world.worldId, ground);
      handle.setAttribute("aria-label", `이동영역 ${label} 경계 ${ground[key]}%`);
      draw();
    };
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", (event) => {
      if (!handle.hasPointerCapture(event.pointerId)) return;
      const bounds = overlay.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      change(
        key === "left" || key === "right"
          ? ((event.clientX - bounds.left) / bounds.width) * 100
          : ((event.clientY - bounds.top) / bounds.height) * 100,
      );
    });
    handle.addEventListener("pointerup", (event) => {
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    });
    handle.addEventListener("keydown", (event) => {
      const direction =
        event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : event.key === "ArrowRight" || event.key === "ArrowDown"
            ? 1
            : 0;
      if (direction) {
        event.preventDefault();
        change(ground[key] + direction);
      }
    });
    area.append(handle);
  }
  const boardPosition = {
    ...((state.settingsBoardDraft?.worldId === world.worldId
      ? state.settingsBoardDraft.value
      : world.state.settings.board) ?? { x: 86, y: 72 }),
  };
  const marker = h("button", {
    className: "board-handle",
    text: "게시판 이동",
    attrs: { type: "button", "aria-label": "게시판 위치 조절" },
  });
  const drawBoard = () => {
    marker.style.left = `${boardPosition.x}%`;
    marker.style.top = `${boardPosition.y}%`;
    const prop = overlay.parentElement?.querySelector<HTMLElement>(".scene-props");
    if (prop) positionBoard(prop, boardPosition);
  };
  const moveBoard = (x: number, y: number) => {
    boardPosition.x = Math.round(Math.min(90, Math.max(10, x)));
    boardPosition.y = Math.round(Math.min(90, Math.max(40, y)));
    controller.rememberBoard(world.worldId, boardPosition);
    drawBoard();
  };
  marker.addEventListener("pointerdown", (event) => {
    if (event.button === 0) {
      event.preventDefault();
      marker.setPointerCapture(event.pointerId);
    }
  });
  marker.addEventListener("pointermove", (event) => {
    if (!marker.hasPointerCapture(event.pointerId)) return;
    const bounds = overlay.getBoundingClientRect();
    if (bounds.width && bounds.height)
      moveBoard(
        ((event.clientX - bounds.left) * 100) / bounds.width,
        ((event.clientY - bounds.top) * 100) / bounds.height,
      );
  });
  marker.addEventListener("pointerup", (event) => {
    if (marker.hasPointerCapture(event.pointerId)) marker.releasePointerCapture(event.pointerId);
  });
  marker.addEventListener("keydown", (event) => {
    const delta = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[event.key];
    if (delta) {
      event.preventDefault();
      moveBoard(boardPosition.x + delta[0]!, boardPosition.y + delta[1]!);
    }
  });
  marker.style.left = `${boardPosition.x}%`;
  marker.style.top = `${boardPosition.y}%`;
  overlay.append(area, marker);
  draw();
  return overlay;
}

export function groundActions(state: AppState, controller: Controller) {
  const world = state.world?.state === "ready" ? state.world.value : null;
  if (!world) return null;
  const busy = Boolean(state.busy["ground-save"]);
  return h("div", { className: "ground-actions" }, [
    h("p", {
      text: "경계로 주민 이동 영역을, 게시판 손잡이로 게시판 위치를 조정해 주세요. 저장 전에는 적용되지 않아요.",
    }),
    h("div", { className: "ground-action-row" }, [
      button("기본 범위", () => controller.resetGroundEditor(), { variant: "secondary", disabled: busy }),
      button("취소", () => controller.cancelGroundEditor(), { variant: "secondary", disabled: busy }),
      button(
        busy ? "저장 중…" : "저장",
        () =>
          void controller.saveGround(controller.store.get().settingsGroundDraft?.value ?? world.state.settings.ground),
        { disabled: busy },
      ),
    ]),
  ]);
}
