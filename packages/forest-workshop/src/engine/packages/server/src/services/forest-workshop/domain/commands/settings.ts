// settings.update — renames the world or the player's nickname. The player has a nickname only, no appearance
// (plan §3). Edits what the player saw, so it refuses an outdated screen.
import { z } from "zod";
import { boardSchema, groundSchema, nicknameSchema, worldNameSchema } from "../world-model";
import { FwError } from "../errors";
import { defineCommand } from "./command";

const payloadSchema = z
  .object({
    worldName: worldNameSchema.optional(),
    playerNickname: nicknameSchema.optional(),
    ground: groundSchema.optional(),
    board: boardSchema.nullable().optional(),
  })
  .strict()
  .refine(
    (payload) =>
      payload.worldName !== undefined ||
      payload.playerNickname !== undefined ||
      payload.ground !== undefined ||
      payload.board !== undefined,
    {
      message: "nothing to change",
    },
  );

export const updateSettings = defineCommand({
  type: "settings.update",
  payloadSchema,
  requiresFreshView: true,
  apply(state, payload) {
    const settings = {
      board: payload.board !== undefined ? payload.board : state.settings.board,
      ground: payload.ground ?? state.settings.ground,
      worldName: payload.worldName ?? state.settings.worldName,
      playerNickname: payload.playerNickname ?? state.settings.playerNickname,
    };
    return { state: { ...state, settings }, result: { settings } };
  },
});

/** Compare the layout being edited, not unrelated inventory or clock revisions. */
export const setLayout = defineCommand({
  type: "settings.setLayout",
  requiresFreshView: false,
  payloadSchema: z
    .object({
      ground: groundSchema,
      board: boardSchema.nullable(),
      expectedGround: groundSchema,
      expectedBoard: boardSchema.nullable(),
    })
    .strict(),
  apply(state, payload) {
    const equal = (a: object | null, b: object | null) => {
      if (!a || !b) return a === b;
      return Object.keys(a).every((key) => (a as Record<string, unknown>)[key] === (b as Record<string, unknown>)[key]);
    };
    if (!equal(state.settings.ground, payload.expectedGround) || !equal(state.settings.board, payload.expectedBoard))
      throw new FwError("stale_view");
    return {
      state: { ...state, settings: { ...state.settings, ground: payload.ground, board: payload.board } },
      result: {},
    };
  },
});
