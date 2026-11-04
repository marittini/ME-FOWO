import assert from "node:assert/strict";
import {
  createWorldState,
  worldStateSchema,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/world-model";
import { migrateWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/migrations";
import {
  applyCommand,
  getCommandDefinition,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/commands/registry";
import { advanceProduction } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/simulation";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { createWorldDocument } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/world-repository";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
const now = "2026-11-04T00:00:00.000Z",
  worldId = "11111111-1111-4111-8111-111111111111";
const fresh = () => createWorldState({ worldId, worldName: "숲", playerNickname: "공방지기", now });
const cmd = (state: ReturnType<typeof fresh>, type: string, payload: unknown) =>
  applyCommand(state, getCommandDefinition(type), payload, { now, commandId: "shared-test" }).state;
async function main() {
  const original = fresh();
  const advanced = advanceProduction(original.production, original.inventory, 0);
  const old = JSON.parse(
    JSON.stringify({ ...original, production: advanced.production, inventory: advanced.inventory }),
  );
  old.schemaVersion = 13;
  delete old.production.sharedTargetStock;
  for (const facility of Object.values(old.production.facilities) as Array<{
    rules: Array<{ targetStock: number; enabled: boolean }>;
  }>)
    for (const rule of facility.rules) rule.targetStock = 4;
  old.production.facilities["gather-yard"].rules[0].targetStock = 17;
  old.production.facilities["gather-yard"].rules[1].enabled = false;
  const before = JSON.stringify(old),
    migrated = migrateWorld(old);
  assert.equal(JSON.stringify(old), before, "migration never mutates old backup");
  assert.equal(migrated.schemaVersion, 14);
  assert.equal(migrated.production.sharedTargetStock, 17);
  for (const [id, facility] of Object.entries(migrated.production.facilities)) {
    assert.ok(facility.rules.every((rule) => rule.targetStock === 17));
    assert.deepEqual(facility.job, old.production.facilities[id].job, "in-flight work survives");
  }
  assert.equal(migrated.production.facilities["gather-yard"]!.rules[1]!.enabled, false);
  assert.deepEqual(migrated.inventory, old.inventory);
  assert.deepEqual(migrated.wallet, old.wallet);
  assert.deepEqual(migrateWorld(migrated), migrated);
  const shared = cmd(migrated, "production.setSharedTarget", { targetStock: 3 });
  assert.equal(shared.production.sharedTargetStock, 3);
  assert.ok(Object.values(shared.production.facilities).every((f) => f.rules.every((r) => r.targetStock === 3)));
  const rule = shared.production.facilities["gather-yard"]!.rules[0]!;
  const forged = cmd(shared, "production.setRules", {
    facilityId: "gather-yard",
    rules: [{ ...rule, targetStock: 900 }],
  });
  assert.equal(
    forged.production.facilities["gather-yard"]!.rules[0]!.targetStock,
    3,
    "per-rule payload cannot change common goal",
  );
  for (const targetStock of [0, -1, 1000, 1.5, "5"])
    assert.throws(() => cmd(shared, "production.setSharedTarget", { targetStock }));
  const production = fresh();
  for (const facility of Object.values(production.production.facilities)) facility.unlocked = true;
  production.production.protectedStock["wild-berry"] = 5;
  const planned = cmd(production, "production.setTree", { recipeId: "berry-pie", targetStock: 1 });
  const result = advanceProduction(planned.production, planned.inventory, 24 * 3600000);
  assert.ok((result.inventory["berry-pie"] ?? 0) >= 1, "one shared target still supplies minimum input batches");
  assert.ok((result.inventory["wild-berry"] ?? 0) >= 5, "protected stock remains");
  assert.ok(Object.values(planned.production.facilities).every((f) => f.rules.every((r) => r.targetStock === 1)));
  assert.ok(
    worldStateSchema.safeParse({ ...planned, production: result.production, inventory: result.inventory }).success,
  );
  const host = new FakeHost();
  await createWorldDocument(host.documents, fresh(), now, "shared");
  const service = createCommandService(host.persistence, () => new Date(now));
  const request = {
    worldId,
    commandId: "shared-target-retry",
    expectedRevision: 1,
    type: "production.setSharedTarget",
    payload: { targetStock: 7 },
  };
  const once = await service.execute(request),
    twice = await service.execute(request);
  assert.equal(twice.duplicate, true);
  assert.deepEqual(once.state, twice.state);
  console.log("Shared stock: migration, all facilities, protected batch minimum, forging rejection and retry: OK");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
