// 다시 제안 (board 05-3): asks the player's language model for a 공방 세계 설정 draft. Nothing is stored: the draft
// goes back to the form, and only 재구축 확정 saves a resident. No transaction waits on the model (plan §6).
//
// ponytail: a synchronous request bounded by the Engine's agent-call timeout. Long-running generations with
// resumable status (POST /generation, GET /generation/:id in plan §5) arrive with the story phase (P4), which
// needs them; a lost suggestion here costs one retry and no saved data.
import { FwError } from "../domain/errors";
import { assertWorldId } from "../domain/ids";
import type { ResidentKind, SourceSnapshot } from "../domain/model/residents";
import type { HostRuntime } from "../host/engine-adapter";
import { REBUILD_PROMPT_VERSION, buildRebuildMessages, cleanRebuildSuggestion } from "../prompts/rebuild";
import type { SourceService } from "./source-service";

const MAX_OUTPUT_TOKENS = 8000;

export function createRebuildService(runtime: HostRuntime, sources: SourceService) {
  return {
    async suggest(body: unknown) {
      const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
      const worldId = assertWorldId(raw.worldId);
      if (
        raw.connectionId != null &&
        (typeof raw.connectionId !== "string" || raw.connectionId.length < 1 || raw.connectionId.length > 128)
      )
        throw new FwError("invalid_request");
      const connectionId = (raw.connectionId as string | null | undefined) ?? null;
      const source = (raw.source ?? {}) as Record<string, unknown>;
      const kind = source.kind as ResidentKind;
      const preview = await sources.preview(worldId, kind, source.id);

      const suggestion = await generateProfile(runtime, kind, preview.snapshot, "", connectionId);
      return { suggestion, promptVersion: REBUILD_PROMPT_VERSION };
    },
  };
}

export type RebuildService = ReturnType<typeof createRebuildService>;

export async function generateProfile(
  runtime: HostRuntime,
  kind: ResidentKind,
  snapshot: SourceSnapshot,
  existingSetting = "",
  connectionId: string | null = null,
) {
  const logger = runtime.logger;
  const resolve = runtime.languageModels?.resolve;
  if (typeof resolve !== "function") throw new FwError("lm_unavailable");
  let model;
  try {
    model = await resolve.call(runtime.languageModels, connectionId);
  } catch {
    throw new FwError("lm_unavailable");
  }
  if (typeof model.chatComplete !== "function") throw new FwError("lm_unavailable");

  const messages = buildRebuildMessages(kind, snapshot, existingSetting);
  const outputTokens = Math.min(
    MAX_OUTPUT_TOKENS,
    model.maxOutputTokens ?? MAX_OUTPUT_TOKENS,
    model.maxContext ? Math.floor(model.maxContext * 0.4) : MAX_OUTPUT_TOKENS,
  );
  const budget = model.maxContext ? model.maxContext - outputTokens : 16000;
  if (budget < 1 || model.fitContext(messages, { maxTokens: budget }).trimmed) throw new FwError("context_too_large");
  const debug = process.env.DEBUG_AGENTS === "true" || process.env.DEBUG_AGENTS === "1";
  const log = debug ? logger?.info.bind(logger) : logger?.debug?.bind(logger);
  log?.(
    "[forest-workshop] rebuild prompt v%d → %s:%s\n%s",
    REBUILD_PROMPT_VERSION,
    model.connectionId,
    model.model,
    JSON.stringify(messages),
  );

  let content: string;
  try {
    const completion = await model.chatComplete(messages, {
      temperature: 0.8,
      maxTokens: outputTokens,
      debugMode: debug,
    });
    if (completion.finishReason === "length" || completion.finishReason === "max_tokens")
      throw new Error("incomplete profile");
    content = completion.content ?? "";
  } catch (error) {
    logger?.warn(
      "[forest-workshop] rebuild suggestion failed: %s",
      error instanceof Error ? error.message : String(error),
    );
    throw new FwError("generation_failed");
  }
  const suggestion = cleanRebuildSuggestion(content);
  if (!suggestion) throw new FwError("generation_failed");
  return suggestion;
}
