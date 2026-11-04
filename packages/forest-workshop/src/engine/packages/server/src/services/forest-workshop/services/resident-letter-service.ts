import { reusableActivityReport } from "../domain/commands/mailbox";
import { FwError } from "../domain/errors";
import { assertWorldId } from "../domain/ids";
import type { HostPersistence, HostRuntime } from "../host/engine-adapter";
import { buildResidentLetterMessages, parseResidentLetter } from "../prompts/resident-letter";
import { parseModelConnection } from "./model-connection";
import { createProfileService, type ProfileService } from "./profile-service";
import { loadWorld } from "../store/world-repository";
import type { CommandResponse, CommandService } from "./command-service";

export function createResidentLetterService(
  runtime: HostRuntime,
  persistence: HostPersistence,
  commands: CommandService,
  profiles: ProfileService = createProfileService(runtime, persistence),
) {
  const inFlight = new Map<
    string,
    { connection: string | null; profileConnection: string | null; promise: Promise<CommandResponse> }
  >();
  return {
    async generate(body: unknown): Promise<CommandResponse> {
      const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
      const worldId = assertWorldId(raw.worldId);
      const activityId = raw.activityId;
      if (
        typeof activityId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(activityId)
      )
        throw new FwError("invalid_request");
      if (
        raw.connectionId != null &&
        (typeof raw.connectionId !== "string" || !raw.connectionId.length || raw.connectionId.length > 128)
      )
        throw new FwError("invalid_request");
      const connection = (raw.connectionId as string | null | undefined) ?? null;
      const profileConnection = parseModelConnection(raw.profileConnectionId);
      const key = `${worldId}:${activityId}`;
      const active = inFlight.get(key);
      if (active) {
        if (active.connection !== connection || active.profileConnection !== profileConnection)
          throw new FwError("invalid_request", { message: "다른 연결로 편지를 작성 중이에요." });
        return active.promise;
      }
      const task = (async () => {
        let world = await loadWorld(persistence.documents, worldId);
        const activity = world.state.activities.completed.find((item) => item.id === activityId);
        if (!activity) throw new FwError("invalid_payload", { message: "완료된 활동을 찾지 못했어요." });
        const id = `resident-${activityId}`;
        if (world.state.mailbox.letters.some((letter) => letter.id === id))
          return {
            duplicate: true,
            type: "mail.saveResidentLetter",
            result: { id },
            revision: world.revision,
            state: world.state,
          };
        if (
          world.state.mailbox.letters.length -
            (reusableActivityReport(world.state, activity) ? 1 : 0) +
            (world.state.activities.running ? 1 : 0) >=
          200
        )
          throw new FwError("invalid_payload", {
            message: "우편 저장 한도에 도달해 새 편지를 저장할 수 없어요. 보관함으로 옮겨도 저장 공간은 줄지 않아요.",
            details: { stage: "capacity" },
          });
        try {
          await profiles.ensure(worldId, [activity.residentId], profileConnection);
        } catch (error) {
          if (
            error instanceof FwError &&
            ["generation_failed", "lm_unavailable", "context_too_large"].includes(error.code)
          )
            throw new FwError(error.code, {
              message:
                "편지에 사용할 주민 설정을 먼저 준비하지 못했어요. 주민 설정 제안의 모델 연결과 출력·문맥 한도를 확인한 뒤 다시 시도해 주세요.",
              details: { stage: "profile", purpose: "profile" },
            });
          throw error;
        }
        world = await loadWorld(persistence.documents, worldId);
        const resident = world.state.residents[activity.residentId];
        if (!resident) throw new FwError("invalid_payload");
        const resolve = runtime.languageModels?.resolve;
        if (!resolve) throw new FwError("lm_unavailable");
        let model;
        try {
          model = await resolve.call(runtime.languageModels, connection);
        } catch {
          throw new FwError("lm_unavailable");
        }
        const ownLetterIds = new Set(
          world.state.activities.completed
            .filter((item) => item.residentId === resident.residentId && item.id !== activityId)
            .map((item) => `resident-${item.id}`),
        );
        const recentLetters = world.state.mailbox.letters
          .filter((letter) => ownLetterIds.has(letter.id))
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
          .slice(-2)
          .map(({ title, body }) => ({ title, body }));
        const letterInput = {
          residentId: resident.residentId,
          residentName: resident.displayName,
          playerNickname: world.state.settings.playerNickname,
          trust: resident.trust,
          recentLetters,
          worldSetting: resident.worldSetting,
          activitySummary: activity.summary,
          memory: world.state.memory,
          worldGuideline: world.state.guidelines.world.enabled ? world.state.guidelines.world.text : "",
        };
        let messages = buildResidentLetterMessages(letterInput);
        const outputTokens = Math.min(
          2048,
          model.maxOutputTokens && model.maxOutputTokens > 0 ? model.maxOutputTokens : 2048,
        );
        if (outputTokens < 256)
          throw new FwError("generation_failed", {
            message: "현재 연결의 출력 한도가 편지를 쓰기에 너무 작아요. AI 연결의 최대 출력 길이를 늘려 주세요.",
            details: { stage: "output_limit" },
          });
        const inputTokens = model.maxContext ? model.maxContext - outputTokens - 256 : 12000;
        // Earlier letters are optional style references; never let them displace the canonical profile or memories.
        if (inputTokens > 0)
          while (model.fitContext(messages, { maxTokens: inputTokens }).trimmed && letterInput.recentLetters.length) {
            letterInput.recentLetters.shift();
            messages = buildResidentLetterMessages(letterInput);
          }
        if (inputTokens <= 0 || model.fitContext(messages, { maxTokens: inputTokens }).trimmed)
          throw new FwError("context_too_large", {
            message:
              "편지에 필요한 주민 설정과 기억이 연결의 문맥 한도보다 길어요. 문맥이 더 큰 모델 연결을 선택해 주세요. 원문은 그대로 보관되어 있어요.",
          });
        let completion;
        try {
          completion = await model.chatComplete(messages, { temperature: 0.8, maxTokens: outputTokens });
        } catch {
          throw new FwError("generation_failed", {
            message: "AI 연결에서 편지 응답을 받지 못했어요. 연결을 확인한 뒤 다시 시도해 주세요.",
            details: { stage: "request" },
          });
        }
        if (["length", "max_tokens", "max_output_tokens"].includes((completion.finishReason ?? "").toLowerCase()))
          throw new FwError("generation_failed", {
            message:
              "AI가 편지를 끝까지 쓰기 전에 출력 한도에 도달했어요. 연결의 출력 길이를 늘린 뒤 다시 시도해 주세요.",
            details: { stage: "output_limit" },
          });
        if (!completion.content?.trim())
          throw new FwError("generation_failed", {
            message: "AI가 빈 응답을 보냈어요. 선택한 편지 모델과 출력 설정을 확인해 주세요.",
            details: { stage: "empty" },
          });
        let draft;
        try {
          draft = parseResidentLetter(completion.content);
        } catch {
          throw new FwError("generation_failed", {
            message: "AI의 편지 응답 형식을 읽지 못했어요. 활동 기록은 그대로 있으니 다시 시도할 수 있어요.",
            details: { stage: "format" },
          });
        }
        return commands.execute(
          {
            worldId,
            commandId: `resident-letter-${activityId}`,
            expectedRevision: world.revision,
            type: "mail.saveResidentLetter",
            payload: { activityId, ...draft },
          },
          { internal: true, identity: { activityId } },
        );
      })().finally(() => inFlight.delete(key));
      inFlight.set(key, { connection, profileConnection, promise: task });
      return task;
    },
  };
}
export type ResidentLetterService = ReturnType<typeof createResidentLetterService>;
