import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { createWorldService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/world-service";
import { createStory } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/story-repository";
import type { StoryDocument } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/story-document";
import { PACKAGE_ID } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/host/engine-adapter";

async function main() {
  const worldId = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
  const otherWorldId = "bbbbbbbb-cccc-4ddd-8eee-ffffffffffff";
  const host = new FakeHost();
  const worlds = createWorldService(host.persistence);
  const now = new Date().toISOString();

  await host.documents.create({
    id: `fw-world-${worldId}`,
    packageId: PACKAGE_ID,
    kind: "fw-world",
    name: "Unreadable old world",
    description: "legacy",
    data: { oldSchema: true },
    createdAt: now,
    updatedAt: now,
  });
  for (const [id, kind, data] of [
    [`fw-command-${worldId}-cmd-12345678`, "fw-command", { worldId }],
    [`fw-story-${worldId}-story-12345678`, "fw-story", { worldId }],
    [`fw-history-${worldId}-letter-12345678`, "fw-history", { worldId }],
    [`fw-world-${otherWorldId}`, "fw-world", { worldId: otherWorldId }],
    [`fw-story-${otherWorldId}-story-12345678`, "fw-story", { worldId: otherWorldId }],
    [`fw-command-${worldId}-foreign`, "fw-command", { worldId }],
  ] as const) {
    await host.documents.create({
      id,
      packageId: id.endsWith("foreign") ? "another-package" : PACKAGE_ID,
      kind,
      name: id,
      description: "fixture",
      data,
      createdAt: now,
      updatedAt: now,
    });
  }

  assert.deepEqual(await worlds.delete(worldId), { deleted: true });
  assert.deepEqual(await worlds.delete(worldId), { deleted: true });
  assert.equal(await host.documents.getById(PACKAGE_ID, `fw-world-${worldId}`), null);
  for (const kind of ["fw-command", "fw-story", "fw-history"]) {
    assert.equal(
      (await host.documents.list(PACKAGE_ID, kind)).some((record) => record.id.includes(worldId)),
      false,
    );
  }
  assert.ok(await host.documents.getById(PACKAGE_ID, `fw-world-${otherWorldId}`));
  assert.ok(await host.documents.getById(PACKAGE_ID, `fw-story-${otherWorldId}-story-12345678`));
  assert.ok(await host.documents.getById("another-package", `fw-command-${worldId}-foreign`));
  assert.equal(
    (await worlds.list()).some((world) => world.worldId === worldId),
    false,
  );
  await assert.rejects(worlds.create({ worldId, worldName: "Again", playerNickname: "Player" }));
  await assert.rejects(
    createStory(host.documents, {
      schemaVersion: 1,
      worldId,
      storyId: "cccccccc-dddd-4eee-8fff-000000000001",
      pairId: "cccccccc-dddd-4eee-8fff-000000000002",
      title: "late write",
      generatedAt: now,
    } as unknown as StoryDocument),
  );

  // Force creation to resume immediately after deletion commits, between its preflight and final marker check.
  const lateHost = new FakeHost();
  const lateWorlds = createWorldService(lateHost.persistence);
  const originalCreate = lateHost.documents.create;
  let deleteBeforeCreate = true;
  lateHost.documents.create = async (input) => {
    if (deleteBeforeCreate && input.id === `fw-world-${otherWorldId}`) {
      deleteBeforeCreate = false;
      await lateWorlds.delete(otherWorldId);
    }
    return originalCreate(input);
  };
  await assert.rejects(lateWorlds.create({ worldId: otherWorldId, worldName: "Late", playerNickname: "Player" }));
  assert.equal(await lateHost.documents.getById(PACKAGE_ID, `fw-world-${otherWorldId}`), null);

  // A failed revision-checked remove must roll the marker and every earlier removal back.
  const rollbackHost = new FakeHost();
  await rollbackHost.documents.create({
    id: `fw-world-${otherWorldId}`,
    packageId: PACKAGE_ID,
    kind: "fw-world",
    name: "Keep me",
    description: "fixture",
    data: { unreadable: true },
    createdAt: now,
    updatedAt: now,
  });
  const originalRemove = rollbackHost.documents.remove;
  rollbackHost.documents.remove = async (packageId, id, revision) =>
    id === `fw-world-${otherWorldId}` ? false : originalRemove(packageId, id, revision);
  await assert.rejects(createWorldService(rollbackHost.persistence).delete(otherWorldId));
  rollbackHost.documents.remove = originalRemove;
  assert.ok(await rollbackHost.documents.getById(PACKAGE_ID, `fw-world-${otherWorldId}`));
  assert.equal(await rollbackHost.documents.getById(PACKAGE_ID, `fw-world-deletion-${otherWorldId}`), null);

  console.log("Forest Workshop world deletion regression passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
