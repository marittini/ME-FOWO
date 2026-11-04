import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { FwError } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/errors";
import {
  applyCommand,
  getCommandDefinition,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/commands/registry";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";

const WORLD = "11111111-1111-4111-8111-111111111111";
const clock = () => new Date("2026-11-04T12:00:00.000Z");

async function rejects(promise: Promise<unknown>, code: string) {
  await assert.rejects(promise, (error: unknown) => error instanceof FwError && error.code === code);
}

async function main() {
  const host = new FakeHost();
  const worlds = createWorldService(host.persistence, clock);
  const commands = createCommandService(host.persistence, clock);
  await worlds.create({ worldId: WORLD, worldName: "숲결 마을", playerNickname: "공방지기" });
  const starter = await commands.execute({
    worldId: WORLD,
    commandId: "starter-kit-001",
    expectedRevision: 1,
    type: "onboarding.claimStarterKit",
    payload: {},
  });
  const tickets = starter.state.wallet.tickets;
  assert.ok(tickets >= 1);
  const exchange = {
    worldId: WORLD,
    commandId: "gold-exchange-001",
    expectedRevision: starter.revision,
    type: "invite.buyGold",
    payload: { amount: 1 },
  };
  const result = await commands.execute(exchange);
  assert.equal(result.state.wallet.tickets, tickets - 1);
  assert.equal(result.state.wallet.gold, starter.state.wallet.gold + 100);
  assert.deepEqual(result.result, { ticketsSpent: 1, goldReceived: 100 });
  const replay = await commands.execute(exchange);
  assert.equal(replay.duplicate, true);
  assert.equal(replay.state.wallet.gold, result.state.wallet.gold);

  await rejects(
    commands.execute({
      ...exchange,
      commandId: "gold-bad-001",
      expectedRevision: result.revision,
      payload: { amount: 0 },
    }),
    "invalid_payload",
  );
  await rejects(
    commands.execute({
      ...exchange,
      commandId: "gold-low-001",
      expectedRevision: result.revision,
      payload: { amount: tickets + 1 },
    }),
    "not_enough_tickets",
  );

  for (const amount of [-1, 1.5, 10_001])
    await rejects(
      commands.execute({ ...exchange, commandId: `bad-gold-${amount}`, payload: { amount } }),
      "invalid_payload",
    );
  await rejects(
    commands.execute({ ...exchange, commandId: "forged-gold", payload: { amount: 1, gold: 999999 } }),
    "invalid_payload",
  );
  const definition = getCommandDefinition("invite.buyGold");
  const overflowState = {
    ...result.state,
    wallet: { ...result.state.wallet, gold: Number.MAX_SAFE_INTEGER, tickets: 1 },
  };
  assert.throws(
    () => applyCommand(overflowState, definition, { amount: 1 }, { commandId: "overflow", now: clock().toISOString() }),
    (error: unknown) => error instanceof FwError && error.code === "invalid_request",
  );
}

void main().then(() => console.log("forest-workshop gold exchange regressions: OK"));
