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
import { settleWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/production/settle";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createWorldDocument } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/world-repository";
import {
  readAudioPreference,
  writeAudioPreference,
} from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/audio";
const now = "2026-11-03T12:00:00.000Z",
  worldId = "11111111-1111-4111-8111-111111111111";
const fresh = () => createWorldState({ worldId, worldName: "숲", playerNickname: "공방지기", now });
const cmd = (world: ReturnType<typeof fresh>, type: string, payload: unknown) =>
  applyCommand(world, getCommandDefinition(type), payload, { now, commandId: "test" });
async function main() {
  const original = fresh();
  assert.ok(
    Object.values(original.production.facilities).every((f) => f.rules.every((r) => r.enabled)),
    "all recipes start on",
  );
  for (const type of ["production.setMode", "production.queueAdd", "production.queueRemove"])
    assert.throws(() => getCommandDefinition(type), { code: "unknown_command" });
  const raw = JSON.parse(JSON.stringify(original));
  raw.schemaVersion = 12;
  const facility = raw.production.facilities["gather-yard"];
  facility.mode = "count";
  facility.rules[0].enabled = false;
  facility.queue = [
    { entryId: "22222222-2222-4222-8222-222222222222", recipeId: "gather-berry", total: 3, started: 1 },
  ];
  facility.job = JSON.parse(
    JSON.stringify(
      cmd(fresh(), "invite.refillTickets", { pack: "small" }).state.production.facilities["gather-yard"]!.job,
    ),
  );
  facility.job.source = "queue";
  const migrated = migrateWorld(raw);
  assert.deepEqual(
    migrated.production.facilities["gather-yard"]!.job,
    facility.job,
    "in-flight count job finishes once with its original inputs/time",
  );
  assert.equal(migrated.schemaVersion, 14);
  assert.equal(migrated.production.facilities["gather-yard"]!.mode, "auto");
  assert.deepEqual(migrated.production.facilities["gather-yard"]!.queue, []);
  assert.ok(migrated.production.facilities["gather-yard"]!.rules.every((r) => r.enabled));
  assert.deepEqual(migrateWorld(migrated), migrated);
  const switchedOff = structuredClone(migrated);
  switchedOff.production.facilities["gather-yard"]!.rules[0]!.enabled = false;
  assert.equal(
    migrateWorld(switchedOff).production.facilities["gather-yard"]!.rules[0]!.enabled,
    false,
    "post-update manual choices are preserved",
  );
  assert.deepEqual(raw.production.facilities["gather-yard"].queue, facility.queue, "migration leaves input intact");
  const board = cmd(original, "settings.update", { board: { x: 30, y: 65 } }).state;
  assert.deepEqual(board.settings.board, { x: 30, y: 65 });
  assert.throws(() => cmd(board, "settings.update", { board: { x: 101, y: 60 } }), { code: "invalid_payload" });
  let stocked = original;
  for (let i = 0; i < 250; i++) stocked = cmd(stocked, "invite.refillTickets", { pack: "chest" }).state;
  assert.equal(stocked.wallet.tickets, 250000, "no daily or repeat refill gate");
  assert.equal(stocked.wallet.gold, original.wallet.gold);
  assert.throws(() => cmd(stocked, "invite.refillTickets", { amount: 999999 }), { code: "invalid_payload" });
  for (const f of Object.values(stocked.production.facilities)) f.unlocked = true;
  stocked.production.protectedStock["wild-berry"] = 5;
  stocked.production.autoSell["berry-pie"] = { enabled: true, keep: 0, dailyMax: 999 };
  stocked.production.autoSell["wild-berry"] = { enabled: true, keep: 0, dailyMax: 999 };
  const planned = cmd(stocked, "production.setTree", { recipeId: "berry-pie", targetStock: 2 });
  const enabled = Object.values(planned.state.production.facilities).flatMap((f) =>
    f.rules.filter((r) => r.enabled).map((r) => r.recipeId),
  );
  for (const needed of ["berry-pie", "berry-jam", "flour", "gather-berry", "grow-wheat"])
    assert.ok(enabled.includes(needed), needed);
  assert.ok(!enabled.includes("gather-herb"));
  const finished = settleWorld(planned.state, "2026-11-04T12:00:00.000Z", { active: true });
  assert.ok((finished.inventory["berry-pie"] ?? 0) >= 2, "tree actually produces its goal from raw inputs");
  assert.ok((finished.inventory["wild-berry"] ?? 0) >= 5, "protected material remains");
  assert.ok(worldStateSchema.safeParse(finished).success);
  assert.equal(
    cmd(original, "production.setTree", { recipeId: "berry-pie", targetStock: 999 }).state.production.sharedTargetStock,
    999,
    "global target does not multiply intermediate targets past the cap",
  );
  assert.equal(original.inventory["berry-pie"], undefined, "configuration grants no free products");
  const host = new FakeHost();
  await createWorldDocument(host.documents, fresh(), now, "test");
  const commands = createCommandService(host.persistence, () => new Date(now));
  const request = {
    worldId,
    commandId: "33333333-3333-4333-8333-333333333333",
    type: "invite.refillTickets",
    payload: { pack: "large" },
    expectedRevision: 1,
  };
  const once = await commands.execute(request),
    retry = await commands.execute(request);
  assert.deepEqual(once.state, retry.state, "network retry refills only once");
  assert.equal(retry.duplicate, true);
  assert.equal(once.state.wallet.tickets, 100);
  const layoutRequest = {
    worldId,
    commandId: "layout-target-only",
    expectedRevision: 1,
    type: "settings.setLayout",
    payload: {
      ground: { ...original.settings.ground },
      board: { x: 45, y: 70 },
      expectedGround: { ...original.settings.ground },
      expectedBoard: null,
    },
  };
  const layout = await commands.execute(layoutRequest);
  assert.deepEqual(
    layout.state.settings.board,
    { x: 45, y: 70 },
    "unrelated refill revision does not reject layout save",
  );
  await assert.rejects(commands.execute({ ...layoutRequest, commandId: "layout-conflict" }), { code: "stale_view" });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("blocked");
    },
  });
  writeAudioPreference({ music: false, effects: false, volume: 0.2 });
  assert.deepEqual(
    readAudioPreference(),
    { music: false, effects: false, volume: 0.2 },
    "mute works during this session when storage is blocked",
  );
  console.log(
    "Player flow: defaults, legacy migration, tree simulation, protection, board and unlimited idempotent refills OK",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
