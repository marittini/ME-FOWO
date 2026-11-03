import { z } from "zod";
import { RECIPES, recipeDefinition } from "../../content/production";
import { FwError } from "../errors";
import { completeRules } from "../production/initial";
import { defineCommand } from "./command";

/** Expand shared ingredients once per additional batch; never create items or unlock facilities. */
export const setProductionTree = defineCommand({
  type: "production.setTree",
  payloadSchema: z.object({ recipeId: z.string().max(64), targetStock: z.number().int().min(1).max(999) }).strict(),
  requiresFreshView: false,
  apply(state, payload) {
    const goal = recipeDefinition(payload.recipeId);
    if (!goal) throw new FwError("invalid_payload");
    const targets = new Map<string, number>();
    function need(recipeId: string, quantity: number, path: Set<string>) {
      if (path.has(recipeId)) throw new FwError("invalid_rules");
      const recipe = recipeDefinition(recipeId)!;
      const output = Object.values(recipe.outputs)[0]!;
      const before = targets.get(recipeId) ?? 0;
      const after = before + quantity;
      if (after > 999)
        throw new FwError("invalid_request", {
          message: "하위 재료의 목표가 999개를 넘어요. 목표 재고를 줄여 주세요.",
        });
      targets.set(recipeId, after);
      const batches = Math.ceil(after / output) - Math.ceil(before / output);
      if (!batches) return;
      for (const [item, amount] of Object.entries(recipe.inputs)) {
        const source = RECIPES.find((candidate) => (candidate.outputs[item] ?? 0) > 0);
        if (!source) throw new FwError("invalid_rules");
        need(source.id, batches * amount, new Set([...path, recipeId]));
      }
    }
    need(goal.id, payload.targetStock, new Set());
    const facilities = Object.fromEntries(
      Object.entries(state.production.facilities).map(([id, facility]) => {
        let priority = 0;
        const rules = completeRules(state.worldId, id, facility.rules).map((rule) => {
          const target = targets.get(rule.recipeId);
          if (target === undefined) return { ...rule, enabled: false };
          const recipe = recipeDefinition(rule.recipeId)!;
          const protectedAmount = Math.max(
            0,
            ...Object.keys(recipe.outputs).map((item) => state.production.protectedStock[item] ?? 0),
          );
          if (target + protectedAmount > 999)
            throw new FwError("invalid_request", {
              message: "재고 보호량과 목표 합계가 999개를 넘어요. 목표를 줄여 주세요.",
            });
          return { ...rule, enabled: true, targetStock: target + protectedAmount, priority: Math.min(5, ++priority) };
        });
        return [id, { ...facility, mode: "auto" as const, queue: [], rules }];
      }),
    );
    const autoSell = { ...state.production.autoSell };
    for (const [recipeId, amount] of targets) {
      const recipe = recipeDefinition(recipeId)!;
      for (const item of Object.keys(recipe.outputs)) {
        const sale = autoSell[item];
        if (sale)
          autoSell[item] = {
            ...sale,
            keep: Math.max(sale.keep, amount + (state.production.protectedStock[item] ?? 0)),
          };
      }
    }
    const locked = [...new Set([...targets.keys()].map((id) => recipeDefinition(id)!.facilityId))].filter(
      (id) => !facilities[id]!.unlocked,
    );
    return {
      state: { ...state, production: { ...state.production, facilities, autoSell } },
      result: { recipes: [...targets.keys()], locked },
    };
  },
});
