import { z } from "zod";
import { RECIPES, recipeDefinition } from "../../content/production";
import { FwError } from "../errors";
import { completeRules } from "../production/initial";
import { materialBatchFloor } from "../production/simulation";
import { defineCommand } from "./command";

/** Select the dependency chain; the same global stock goal applies to every item. */
export const setProductionTree = defineCommand({
  type: "production.setTree",
  requiresFreshView: false,
  payloadSchema: z.object({ recipeId: z.string().max(64), targetStock: z.number().int().min(1).max(999) }).strict(),
  apply(state, payload) {
    if (!recipeDefinition(payload.recipeId)) throw new FwError("invalid_payload");
    const needed = new Set<string>();
    function visit(recipeId: string, path: Set<string>) {
      if (path.has(recipeId)) throw new FwError("invalid_rules");
      if (needed.has(recipeId)) return;
      needed.add(recipeId);
      for (const item of Object.keys(recipeDefinition(recipeId)!.inputs)) {
        const source = RECIPES.find((recipe) => (recipe.outputs[item] ?? 0) > 0);
        if (!source) throw new FwError("invalid_rules");
        visit(source.id, new Set([...path, recipeId]));
      }
    }
    visit(payload.recipeId, new Set());
    const facilities = Object.fromEntries(
      Object.entries(state.production.facilities).map(([id, facility]) => {
        let priority = 0;
        return [
          id,
          {
            ...facility,
            rules: completeRules(state.worldId, id, facility.rules).map((rule) => ({
              ...rule,
              enabled: needed.has(rule.recipeId),
              targetStock: payload.targetStock,
              priority: needed.has(rule.recipeId) ? Math.min(5, ++priority) : rule.priority,
            })),
          },
        ];
      }),
    );
    const production = { ...state.production, sharedTargetStock: payload.targetStock, facilities };
    const autoSell = { ...production.autoSell };
    for (const id of needed)
      for (const item of Object.keys(recipeDefinition(id)!.outputs)) {
        const sale = autoSell[item];
        if (sale)
          autoSell[item] = {
            ...sale,
            keep: Math.max(sale.keep, payload.targetStock, materialBatchFloor(production, item)),
          };
      }
    const locked = [...new Set([...needed].map((id) => recipeDefinition(id)!.facilityId))].filter(
      (id) => !facilities[id]!.unlocked,
    );
    return { state: { ...state, production: { ...production, autoSell } }, result: { recipes: [...needed], locked } };
  },
});
