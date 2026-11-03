import assert from "node:assert/strict";
import { FakeHost } from "./support/forest-workshop-fake-host";
import {
  createWorldState,
  type WorldState,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/world-model";
import { migrateWorld } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/migrations";
import { RECIPES } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/production";
import { residentSchema } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/residents";
import {
  createWorldDocument,
  loadWorld,
  updateWorldDocument,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/store/world-repository";
import { createProfileService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/profile-service";
import { createChapterPlanService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/chapter-plan-service";
import { createResidentLetterService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/resident-letter-service";
import { createCommandService } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/command-service";
import {
  createWeatherService,
  weatherKind,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/weather-service";
import type { HostRuntime } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/host/engine-adapter";

const W = "11111111-1111-4111-8111-111111111111";
const A = "aaaaaaaa-0000-4000-8000-000000000001";
const B = "aaaaaaaa-0000-4000-8000-000000000002";
const P = "bbbbbbbb-0000-4000-8000-000000000001";
const ACTIVITY = "cccccccc-0000-4000-8000-000000000001";
const NOW = "2026-11-03T12:00:00.000Z";
const adapted =
  "성격과 행동\n조용하지만 호기심이 많다.\n\n말투와 호칭\n상대에게 존댓말을 쓰며 '그렇군요'라는 말을 자주 쓴다.\n\n공방에서의 생활\n숲속 공방의 작은 도구를 손질한다.";
const plan = {
  title: "두 사람과 말 없는 풍경",
  place: "개울 다리",
  discovery: "다리 난간에 무언가 놓여 있어요",
  episodes: [0, 1, 2].map((i) => ({
    title: `난간의 쪽지 ${i + 1}`,
    beat: "작은 물건을 서로 다른 습관으로 살펴본다.",
    background: "river-bridge",
  })),
};
async function setup() {
  const host = new FakeHost();
  const state = createWorldState({ worldId: W, worldName: "숲", playerNickname: "공방지기", now: NOW });
  for (const id of [A, B])
    state.residents[id] = residentSchema.parse({
      residentId: id,
      kind: "character",
      sourceId: id,
      source: {
        name: id === A ? "다람" : "토끼",
        description: "원본 왕국에서 기사를 지냈다.",
        personality: "조용하지만 호기심이 많다. 존댓말을 쓴다.",
        scenario: "원본 왕국의 성에 산다.",
        sourceHash: "1".repeat(64),
        takenAt: NOW,
      },
      displayName: id === A ? "다람" : "토끼",
      worldSetting: "숲에서 산다.",
      profileVersion: 0,
      recruited: true,
      field: "gather",
      talentId: "gather-steady",
      breakthrough: 0,
      trust: 0,
      registeredAt: NOW,
      image: { current: null, history: [], placement: { scale: 100, offsetX: 0, markerHeight: 0 } },
      changes: [],
    });
  // Obtain a valid field-specific talent from the content rather than inventing one.
  const { TALENTS } =
    await import("../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/talents");
  for (const resident of Object.values(state.residents))
    resident.talentId = TALENTS.find((talent) => talent.field === "gather")!.id;
  state.pairs[P] = {
    pairId: P,
    residentIds: [A, B],
    archived: false,
    archivedAt: null,
    lastEvent: null,
    familiarity: 0,
    ease: 0,
    createdAt: NOW,
  };
  await createWorldDocument(host.documents, state, NOW, "test");
  let calls = 0;
  const connections: (string | null | undefined)[] = [];
  let beforeAnswer: (() => Promise<void>) | undefined;
  let badPlan = false;
  let letterPrompt = "";
  const runtime: HostRuntime = {
    persistence: host.persistence,
    languageModels: {
      resolve: async (connectionId) => {
        connections.push(connectionId);
        return {
          connectionId: "test",
          model: "scripted",
          maxContext: 64000,
          maxOutputTokens: 8000,
          fitContext: (messages) => ({
            messages,
            trimmed: false,
            estimatedTokensBefore: 100,
            estimatedTokensAfter: 100,
          }),
          chatComplete: async (messages) => {
            calls++;
            if (beforeAnswer) {
              const action = beforeAnswer;
              beforeAnswer = undefined;
              await action();
            }
            const system = messages[0]!.content;
            if (system.includes("3편짜리")) return { content: badPlan ? "{}" : JSON.stringify(plan) };
            if (system.includes("편지")) {
              letterPrompt = JSON.stringify(messages);
              return {
                content: JSON.stringify({
                  title: "다리의 작은 발견",
                  body: "공방지기님, 그렇군요. 오늘 본 잎사귀를 조금 더 살펴보고 싶어요.",
                }),
              };
            }
            return { content: adapted };
          },
        };
      },
    },
  };
  async function change(update: (state: WorldState) => WorldState) {
    const current = await loadWorld(host.documents, W);
    assert.ok(await updateWorldDocument(host.documents, current, update(current.state), NOW));
  }
  return {
    host,
    runtime,
    change,
    calls: () => calls,
    connections,
    before: (action: () => Promise<void>) => {
      beforeAnswer = action;
    },
    bad: () => {
      badPlan = true;
    },
    letterPrompt: () => letterPrompt,
  };
}

async function main() {
  // Legacy profile upgrade is single-flight, persistent, and keeps unrelated concurrent progress.
  {
    const env = await setup();
    const profiles = createProfileService(env.runtime, env.host.persistence);
    env.before(() => env.change((state) => ({ ...state, wallet: { ...state.wallet, gold: 321 } })));
    await Promise.all([profiles.ensure(W, [A], "profile-selected"), profiles.ensure(W, [A], "profile-selected")]);
    const world = await loadWorld(env.host.documents, W);
    assert.equal(env.calls(), 1);
    assert.deepEqual(env.connections, ["profile-selected"]);
    assert.equal(world.state.residents[A]!.worldSetting, adapted);
    assert.equal(world.state.wallet.gold, 321);
    await profiles.ensure(W, [A]);
    assert.equal(env.calls(), 1, "saved profile never regenerates");
  }
  // A player's edit made during generation always wins.
  {
    const env = await setup();
    env.before(() =>
      env.change((state) => ({
        ...state,
        residents: {
          ...state.residents,
          [A]: { ...state.residents[A]!, worldSetting: "플레이어가 직접 수정한 프로필", profileVersion: 2 },
        },
      })),
    );
    await createProfileService(env.runtime, env.host.persistence).ensure(W, [A]);
    assert.equal(
      (await loadWorld(env.host.documents, W)).state.residents[A]!.worldSetting,
      "플레이어가 직접 수정한 프로필",
    );
  }
  // A resident name edit compares the name, so unrelated production revisions cannot reject it.
  {
    const env = await setup();
    const before = await loadWorld(env.host.documents, W);
    await env.change((state) => ({ ...state, wallet: { ...state.wallet, gold: state.wallet.gold + 1 } }));
    const commands = createCommandService(env.host.persistence, () => new Date(NOW));
    const request = {
      worldId: W,
      commandId: "rename-target-only",
      expectedRevision: before.revision,
      type: "residents.rename",
      payload: { residentId: A, expectedName: "다람", displayName: "소나무" },
    };
    const renamed = await commands.execute(request);
    assert.equal(renamed.state.residents[A]!.displayName, "소나무");
    assert.equal(renamed.state.residents[A]!.source.name, "다람");
    await assert.rejects(
      commands.execute({
        ...request,
        commandId: "rename-conflict",
        payload: { ...request.payload, displayName: "겹친 수정" },
      }),
      { code: "stale_view" },
    );
  }
  // Planner writes one stable plan; mechanics and future retry IDs are unchanged.
  {
    const env = await setup();
    await env.change((state) => ({
      ...state,
      residents: Object.fromEntries(
        Object.entries(state.residents).map(([id, r]) => [id, { ...r, profileVersion: 2, worldSetting: adapted }]),
      ),
    }));
    const plans = createChapterPlanService(env.runtime, env.host.persistence);
    await Promise.all([plans.ensure(W, P, null), plans.ensure(W, P, null)]);
    const stored = (await loadWorld(env.host.documents, W)).state.stories.pairs[P]!.current!;
    assert.deepEqual(stored.generated, plan);
    await plans.ensure(W, P, null);
    assert.equal(env.calls(), 1);
    assert.equal(
      (await loadWorld(env.host.documents, W)).state.stories.pairs[P]!.current!.episodes[0].storyId,
      stored.episodes[0].storyId,
    );
    assert.equal(
      (await loadWorld(env.host.documents, W)).state.stories.expedition,
      null,
      "planning spends no materials and starts no expedition",
    );
  }
  // Two pairs sharing a resident retain separate plans, even when prepared concurrently.
  {
    const env = await setup();
    const C = "aaaaaaaa-0000-4000-8000-000000000003",
      Q = "bbbbbbbb-0000-4000-8000-000000000002";
    await env.change((state) => ({
      ...state,
      residents: {
        ...state.residents,
        [C]: { ...state.residents[B]!, residentId: C, sourceId: C, displayName: "셋째 주민" },
      },
      pairs: { ...state.pairs, [Q]: { ...state.pairs[P]!, pairId: Q, residentIds: [A, C] } },
    }));
    const planner = createChapterPlanService(env.runtime, env.host.persistence);
    await Promise.all([planner.ensure(W, P, null), planner.ensure(W, Q, null)]);
    const saved = (await loadWorld(env.host.documents, W)).state;
    assert.ok(saved.stories.pairs[P]!.current!.generated);
    assert.ok(saved.stories.pairs[Q]!.current!.generated);
    assert.notEqual(
      saved.stories.pairs[P]!.current!.episodes[0].storyId,
      saved.stories.pairs[Q]!.current!.episodes[0].storyId,
    );
  }
  // Bad plans are never published and can be retried without changing progress.
  {
    const env = await setup();
    env.bad();
    await assert.rejects(createChapterPlanService(env.runtime, env.host.persistence).ensure(W, P, null), {
      code: "story_generation_failed",
    });
    assert.equal((await loadWorld(env.host.documents, W)).state.stories.pairs[P], undefined);
  }
  // Letter uses only the adapted profile and survives an unrelated production update during generation.
  {
    const env = await setup();
    await env.change((state) => ({
      ...state,
      residents: { ...state.residents, [A]: { ...state.residents[A]!, profileVersion: 2, worldSetting: adapted } },
      activities: {
        running: null,
        completed: [
          {
            id: ACTIVITY,
            kind: "survey",
            residentId: A,
            completedAt: NOW,
            summary: "공방 근처 풀잎을 관찰했다.",
            mailId: "result-test",
          },
        ],
      },
    }));
    env.before(() => env.change((state) => ({ ...state, wallet: { ...state.wallet, gold: 654 } })));
    const commands = createCommandService(env.host.persistence, () => new Date(NOW));
    const letters = createResidentLetterService(env.runtime, env.host.persistence, commands);
    const [one, two] = await Promise.all([
      letters.generate({ worldId: W, activityId: ACTIVITY }),
      letters.generate({ worldId: W, activityId: ACTIVITY }),
    ]);
    assert.deepEqual(one, two);
    assert.equal(env.calls(), 1);
    assert.equal(one.state.wallet.gold, 654);
    assert.ok(env.letterPrompt().includes("그렇군요"));
    assert.ok(!env.letterPrompt().includes("원본 왕국"));
    await letters.generate({ worldId: W, activityId: ACTIVITY });
    assert.equal(env.calls(), 1, "existing letter is returned without another model request");
  }
  // Existing rule choices survive migration; every recipe appears exactly once without enabling new production.
  {
    const env = await setup();
    const raw = structuredClone((await loadWorld(env.host.documents, W)).state);
    raw.schemaVersion = 11 as 13;
    raw.production.facilities["gather-yard"]!.rules = [
      { ...raw.production.facilities["gather-yard"]!.rules[0]!, enabled: false, targetStock: 37 },
    ];
    const migrated = migrateWorld(raw);
    const rules = migrated.production.facilities["gather-yard"]!.rules;
    assert.equal(rules.length, RECIPES.filter((recipe) => recipe.facilityId === "gather-yard").length);
    assert.equal(rules[0]!.targetStock, 37);
    assert.ok(rules.every((rule) => rule.enabled));
    assert.deepEqual(migrateWorld(migrated), migrated);
  }
  // Weather validates the city before any request and caches/coalesces calls to a fixed host.
  {
    let calls = 0;
    const weather = createWeatherService(
      (async (url) => {
        calls++;
        assert.equal(new URL(String(url)).origin, "https://api.open-meteo.com");
        return new Response(
          JSON.stringify({ current: { temperature_2m: 12.4, weather_code: 61, time: "2026-11-03T14:00" } }),
        );
      }) as typeof fetch,
      () => Date.parse(NOW),
    );
    await assert.rejects(weather.current("https://localhost/secret"), { code: "invalid_request" });
    assert.equal(calls, 0);
    const [one, two] = await Promise.all([weather.current("seoul"), weather.current("seoul")]);
    assert.deepEqual(one, two);
    assert.equal(one.kind, "rain");
    assert.equal(calls, 1);
    await weather.current("seoul");
    assert.equal(calls, 1);
    assert.equal(weatherKind(75), "snow");
    assert.equal(weatherKind(2), "cloudy");
    const broken = createWeatherService(
      (async () => new Response(JSON.stringify({ current: { temperature_2m: 999 } }))) as typeof fetch,
    );
    await assert.rejects(broken.current("seoul"), { code: "weather_unavailable" });
  }
  console.log("Generated profiles, chapters, letters, recipe migration and real weather: OK");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
