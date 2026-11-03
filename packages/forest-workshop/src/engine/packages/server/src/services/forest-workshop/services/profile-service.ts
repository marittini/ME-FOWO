// Lazily upgrades legacy condensed profiles once. Generation never holds a transaction;
// compare-and-swap protects concurrent profile edits, production and other residents.
import { CHANGE_LOG_LIMIT } from "../domain/model/residents";
import { FwError } from "../domain/errors";
import type { HostPersistence, HostRuntime } from "../host/engine-adapter";
import { loadWorld, updateWorldDocument } from "../store/world-repository";
import { parseModelConnection } from "./model-connection";
import { generateProfile } from "./rebuild-service";

export function createProfileService(runtime: HostRuntime, persistence: HostPersistence) {
  const inFlight = new Map<string, { connection: string | null; promise: Promise<void> }>();
  async function prepare(worldId: string, residentId: string, connection: string | null) {
    const initial = await loadWorld(persistence.documents, worldId);
    const resident = initial.state.residents[residentId];
    if (!resident) throw new FwError("resident_not_found");
    if (resident.profileVersion >= 2) return;
    // A player-authored legacy setting is already canonical. Never silently replace it.
    const edited =
      resident.changes.some((change) => change.kind === "setting") ||
      (resident.changes.length >= CHANGE_LOG_LIMIT && !resident.changes.some((change) => change.kind === "registered"));
    const setting = edited
      ? resident.worldSetting
      : await generateProfile(runtime, resident.kind, resident.source, resident.worldSetting, connection);
    for (let attempt = 0; attempt < 5; attempt++) {
      const current = await loadWorld(persistence.documents, worldId);
      const latest = current.state.residents[residentId];
      if (
        !latest ||
        latest.profileVersion >= 2 ||
        latest.worldSetting !== resident.worldSetting ||
        latest.source.sourceHash !== resident.source.sourceHash
      )
        return;
      const next = {
        ...current.state,
        residents: {
          ...current.state.residents,
          [residentId]: { ...latest, worldSetting: setting, profileVersion: 2 },
        },
      };
      if (await updateWorldDocument(persistence.documents, current, next, new Date().toISOString())) return;
    }
    throw new FwError("stale_view");
  }
  return {
    async ensure(worldId: string, residentIds: string[], connectionRaw: unknown = null) {
      const connection = parseModelConnection(connectionRaw);
      for (const residentId of new Set(residentIds)) {
        const key = `${worldId}:${residentId}`;
        let active = inFlight.get(key);
        if (active && active.connection !== connection) throw new FwError("invalid_request");
        if (!active) {
          active = {
            connection,
            promise: prepare(worldId, residentId, connection).finally(() => inFlight.delete(key)),
          };
          inFlight.set(key, active);
        }
        await active.promise;
      }
    },
  };
}
export type ProfileService = ReturnType<typeof createProfileService>;
