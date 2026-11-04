import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";
import { createWorldState } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/world-model";
import { residentSchema } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/residents";
import {
  createWorldDocument,
  loadWorld,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/world-repository";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import { createResidentLetterService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/resident-letter-service";
import type { HostResolvedLanguageModel } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/host/engine-adapter";
const worldId = "11111111-1111-4111-8111-111111111111",
  residentId = "22222222-2222-4222-8222-222222222222",
  activityId = "33333333-3333-4333-8333-333333333333",
  now = "2026-11-04T00:00:00.000Z";
async function scenario(
  options: {
    reply?: string;
    finishReason?: string;
    throws?: boolean;
    limit?: number;
    trimmed?: boolean;
    full?: boolean;
    preserveReport?: boolean;
    archived?: boolean;
  } = {},
) {
  const host = new FakeHost(),
    state = createWorldState({ worldId, worldName: "숲", playerNickname: "공방지기", now });
  state.residents[residentId] = residentSchema.parse({
    residentId,
    kind: "character",
    sourceId: "source",
    source: {
      name: "솔이",
      description: "다정한 이웃",
      personality: "차분함",
      scenario: "숲",
      sourceHash: "1".repeat(64),
      takenAt: now,
    },
    displayName: "솔이",
    worldSetting: "숲의 공방에서 도구를 돌보는 차분한 이웃이다.",
    profileVersion: 2,
    recruited: true,
    field: "gather",
    talentId: "berry-eye",
    breakthrough: 0,
    trust: 0,
    registeredAt: now,
    image: { current: null, history: [], placement: { scale: 100, offsetX: 0, markerHeight: 0 } },
    changes: [],
  });
  const summary = "공방 주변의 풀잎을 살펴봤어요.",
    mailId = `activity-${activityId}`;
  state.activities.completed = [{ id: activityId, kind: "survey", residentId, completedAt: now, summary, mailId }];
  state.mailbox.letters.unshift({
    id: mailId,
    eventId: mailId,
    sender: "솔이",
    title: "조사 기록",
    body: options.preserveReport ? summary + " 추가 원문" : summary,
    createdAt: now,
    readAt: null,
    archived: options.archived ?? false,
  });
  if (options.full)
    for (let i = state.mailbox.letters.length; i < 200; i++)
      state.mailbox.letters.push({ ...state.mailbox.letters[1]!, id: `fill-${i}`, eventId: `fill-${i}` });
  await createWorldDocument(host.documents, state, now, "letter test");
  let calls = 0,
    tokens = 0;
  const model: HostResolvedLanguageModel = {
    connectionId: "letter",
    model: "scripted",
    maxContext: 16000,
    maxOutputTokens: options.limit ?? 4096,
    fitContext: (messages) => ({
      messages,
      estimatedTokensBefore: 100,
      estimatedTokensAfter: 100,
      trimmed: options.trimmed ?? false,
    }),
    chatComplete: async (_messages, request) => {
      calls++;
      tokens = request?.maxTokens ?? 0;
      if (options.throws) throw new Error("secret provider error must not be exposed");
      return {
        content:
          options.reply ??
          '```json\n{"title":"숲에서 온 안부","body":"공방지기님, 오늘은 풀잎 끝에 이슬이 남아 있었어요."}\n```',
        finishReason: options.finishReason,
      };
    },
  };
  const service = createResidentLetterService(
    { languageModels: { resolve: async () => model } },
    host.persistence,
    createCommandService(host.persistence, () => new Date(now)),
  );
  return { state, host, service, calls: () => calls, tokens: () => tokens, request: { worldId, activityId } };
}
async function main() {
  const one = await scenario({ full: true, archived: true });
  const [a, b] = await Promise.all([one.service.generate(one.request), one.service.generate(one.request)]);
  assert.equal(one.calls(), 1, "no repair model call or duplicate concurrent calls for fenced JSON");
  assert.equal(one.tokens(), 2048, "Korean output no longer capped at 600 tokens");
  assert.equal(a.result.id, b.result.id);
  assert.equal(a.state.mailbox.letters.length, 200, "reuse system-report slot even at full mailbox");
  const letter = a.state.mailbox.letters.find((l) => l.id === a.result.id)!;
  assert.equal(letter.archived, true, "folder choice is preserved");
  assert.equal(
    a.state.activities.completed[0]!.summary,
    one.state.activities.completed[0]!.summary,
    "original activity summary is retained",
  );
  await one.service.generate(one.request);
  assert.equal(one.calls(), 1, "saved letter reopens without model work");
  const small = await scenario({ limit: 1000 });
  await small.service.generate(small.request);
  assert.equal(small.tokens(), 1000, "respect connection output limit");
  for (const [config, stage] of [
    [{ finishReason: "length" }, "output_limit"],
    [{ reply: "" }, "empty"],
    [{ reply: '{"title":"안녕","body":"내용","reward":99}' }, "format"],
    [{ reply: '{"title":"안녕","body":"잘린' }, "format"],
    [{ throws: true }, "request"],
    [{ limit: 128 }, "output_limit"],
  ] as const) {
    const test = await scenario(config);
    await assert.rejects(test.service.generate(test.request), (error) => {
      const e = error as { code: string; details?: { stage?: string }; message: string };
      assert.equal(e.code, "generation_failed");
      assert.equal(e.details?.stage, stage);
      assert.ok(!e.message.includes("secret provider"));
      return true;
    });
    assert.deepEqual(
      (await loadWorld(test.host.documents, worldId)).state.mailbox,
      test.state.mailbox,
      "failed attempt preserves original record",
    );
  }
  const full = await scenario({ full: true, preserveReport: true });
  await assert.rejects(full.service.generate(full.request), { code: "invalid_payload" });
  assert.equal(full.calls(), 0, "cannot overwrite non-system prose to make room");
  const context = await scenario({ trimmed: true });
  await assert.rejects(context.service.generate(context.request), { code: "context_too_large" });
  assert.equal(context.calls(), 0, "do not silently truncate canonical profiles");
  console.log(
    "Letter reliability: fenced JSON, budgets, failure stages, full-slot reuse, archive, retry and data preservation OK",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
