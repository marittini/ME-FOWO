import { readModelConnection } from "./preferences";
// One function per package route. Paths are relative to the Engine API root (`/api`).
import { hostApi } from "./host-api";
import type {
  BackupDocument,
  CommandResponse,
  DeliveryList,
  StoryDocument,
  StoryOverview,
  GameContent,
  ResidentKind,
  SourceEntry,
  SourcePreview,
  StorageUsage,
  WorldSummary,
  WorldView,
  LiveWeather,
} from "./types";

const ROOT = "/forest-workshop";

export interface CommandInput {
  worldId: string;
  commandId: string;
  expectedRevision: number;
  type: string;
  payload: Record<string, unknown>;
}

export const gameApi = {
  getWeather: (city: string) => hostApi().get<LiveWeather>(`${ROOT}/weather?city=${encodeURIComponent(city)}`),
  listWorlds: () => hostApi().get<{ worlds: WorldSummary[] }>(`${ROOT}/worlds`),
  createWorld: (input: { worldId: string; worldName: string; playerNickname: string }) =>
    hostApi().post<WorldView & { created: boolean; content: GameContent }>(`${ROOT}/worlds`, input),
  getState: (worldId: string) =>
    hostApi().get<WorldView & { content: GameContent }>(`${ROOT}/state?worldId=${encodeURIComponent(worldId)}`),
  prepareStory: (worldId: string, pairId: string) =>
    hostApi().post<StoryOverview>(`${ROOT}/stories/prepare`, {
      worldId,
      pairId,
      connectionId: readModelConnection("story"),
      profileConnectionId: readModelConnection("profile"),
    }),
  preparePairRelationship: (worldId: string, pairId: string) =>
    hostApi().post<{ ok: boolean }>(`${ROOT}/pairs/relationship`, {
      worldId,
      pairId,
      connectionId: readModelConnection("story"),
      profileConnectionId: readModelConnection("profile"),
    }),
  getStoryOverview: (worldId: string) =>
    hostApi().get<StoryOverview>(`${ROOT}/stories?worldId=${encodeURIComponent(worldId)}`),
  getStory: (worldId: string, storyId: string) =>
    hostApi().get<StoryDocument>(
      `${ROOT}/stories/${encodeURIComponent(storyId)}?worldId=${encodeURIComponent(worldId)}`,
    ),
  /** Writes the episode's scene once (or returns it); may take a while — a language model call. */
  generateStory: (worldId: string, pairId: string, episode: number) =>
    hostApi().post<StoryDocument>(`${ROOT}/stories/generate`, {
      worldId,
      pairId,
      episode,
      connectionId: readModelConnection("story"),
      profileConnectionId: readModelConnection("profile"),
    }),
  generateResidentLetter: (worldId: string, activityId: string) =>
    hostApi().post<CommandResponse>(`${ROOT}/mail/generate`, {
      worldId,
      activityId,
      connectionId: readModelConnection("letter"),
      profileConnectionId: readModelConnection("profile"),
    }),
  getDeliveries: (worldId: string) =>
    hostApi().get<DeliveryList>(`${ROOT}/deliveries?worldId=${encodeURIComponent(worldId)}`),
  heartbeat: (worldId: string) => hostApi().post<WorldView>(`${ROOT}/heartbeat`, { worldId }),
  sendCommand: (input: CommandInput) => hostApi().post<CommandResponse>(`${ROOT}/commands`, input),
  getStorage: (worldId: string) =>
    hostApi().get<StorageUsage>(`${ROOT}/storage?worldId=${encodeURIComponent(worldId)}`),
  getBackup: (worldId: string) =>
    hostApi().get<BackupDocument>(`${ROOT}/backup?worldId=${encodeURIComponent(worldId)}`),
  listSources: (worldId: string) =>
    hostApi().get<{ sources: SourceEntry[]; available: { characters: boolean; personas: boolean } }>(
      `${ROOT}/sources?worldId=${encodeURIComponent(worldId)}`,
    ),
  previewSource: (worldId: string, kind: ResidentKind, id: string) =>
    hostApi().get<SourcePreview>(
      `${ROOT}/sources/preview?worldId=${encodeURIComponent(worldId)}&kind=${kind}&id=${encodeURIComponent(id)}`,
    ),
  prepareProfile: (worldId: string, residentId: string) =>
    hostApi().post<WorldView>(`${ROOT}/residents/prepare`, {
      worldId,
      residentId,
      profileConnectionId: readModelConnection("profile"),
    }),
  rebuildSuggestion: (worldId: string, source: { kind: ResidentKind; id: string }) =>
    hostApi().post<{ suggestion: string }>(`${ROOT}/rebuild-suggestion`, {
      worldId,
      source,
      connectionId: readModelConnection("profile"),
    }),
  /** Multipart: worldId, residentId, uploadKey and the file. The upload key makes a retry safe. */
  uploadResidentImage: (input: { worldId: string; residentId: string; uploadKey: string; file: File }) => {
    const form = new FormData();
    // Fields first: the server reads them from the multipart stream before the file.
    form.append("worldId", input.worldId);
    form.append("residentId", input.residentId);
    form.append("uploadKey", input.uploadKey);
    form.append("file", input.file, input.file.name);
    return hostApi().upload<CommandResponse>(`${ROOT}/residents/image`, form);
  },
  restore: (newWorldId: string, backup: unknown) =>
    hostApi().post<WorldView & { created: boolean; restoredFrom: string; content: GameContent }>(`${ROOT}/restore`, {
      newWorldId,
      backup,
    }),
};
