import assert from "node:assert/strict";
import {
  buildResidentLetterMessages,
  parseResidentLetter,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/prompts/resident-letter";
import type { Fact } from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/domain/model/memory";

const base: Fact = {
  factId: 1,
  text: "나만 아는 사건",
  factType: "event",
  knowerIds: ["alice"],
  subjectIds: [],
  visibility: "knowers",
  pairId: null,
  storyId: null,
  occurredAt: "2026-10-29T00:00:00.000Z",
  status: "active",
  supersedes: null,
};
const messages = buildResidentLetterMessages({
  residentId: "alice",
  residentName: "앨리스",
  worldSetting: "차분함",
  activitySummary: "공방 주변을 조사했다",
  worldGuideline: "짧게",
  trust: 63,
  recentLetters: [
    { title: "오래된 편지", body: "이 편지는 제외되어야 해요." },
    { title: "지난 편지 하나", body: "반복을 피할 참고예요." },
    { title: "지난 편지 둘", body: "이것도 참고일 뿐 사실이 아니에요." },
  ],
  memory: {
    nextFactId: 5,
    facts: [
      base,
      { ...base, factId: 2, text: "남의 비밀", knowerIds: ["bob"], factType: "event" },
      { ...base, factId: 3, text: "그때 조금 서운했다", factType: "feeling" },
      { ...base, factId: 4, text: "중지된 기억", status: "invalidated" },
    ],
  },
});
const prompt = messages.map((m) => m.content).join("\n");
assert.ok(prompt.includes("나만 아는 사건"));
assert.ok(prompt.includes('\"kind\":\"feeling\"'));
assert.ok(prompt.includes("그때 조금 서운했다"));
assert.ok(!prompt.includes("남의 비밀"));
assert.ok(!prompt.includes("중지된 기억"));
assert.ok(prompt.includes("지난 편지 하나"));
assert.ok(prompt.includes("지난 편지 둘"));
assert.ok(!prompt.includes("오래된 편지"));
assert.ok(prompt.includes('"trust":63'));
assert.ok(prompt.includes("비연애 친밀감"));
assert.ok(prompt.includes("수치나 점수를 본문에 쓰지"));
assert.ok(prompt.includes("개인 편지"));
assert.deepEqual(parseResidentLetter('{"title":" 안녕 ","body":" 오늘은 맑았어요. "}'), {
  title: "안녕",
  body: "오늘은 맑았어요.",
});
assert.deepEqual(parseResidentLetter('```json\n{"title":"안녕","body":"내용"}\n```'), { title: "안녕", body: "내용" });
assert.deepEqual(parseResidentLetter('```\n{"title":"안녕","body":"내용"}\n```'), { title: "안녕", body: "내용" });
assert.throws(() => parseResidentLetter('설명\n```json\n{"title":"안녕","body":"내용"}\n```'));
assert.throws(() => parseResidentLetter('{"title":"안녕","body":"내용","reward":999}'));
assert.throws(() => parseResidentLetter(JSON.stringify({ title: "안녕", body: "x".repeat(1001) })));
assert.throws(() => parseResidentLetter("잘못된 응답"));
console.log("Resident letter draft: memory scope and response validation OK");
