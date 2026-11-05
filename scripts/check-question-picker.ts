// Pure logic checks, no DB: npx tsx scripts/check-question-picker.ts
import { strict as assert } from "node:assert";
import { TOPICS, targetTier, weakestTopic, type Tier } from "../src/lib/practice/targeting";
import { findQuestion, pickQuestion, tierOf } from "../src/server/questions/pick";
import { CRITICAL_THINKING_QUESTIONS, QUESTIONS } from "../src/server/questions/bank";

const ALL = [...QUESTIONS, ...CRITICAL_THINKING_QUESTIONS];
const pick = (o: Parameters<typeof pickQuestion>[0]) => {
  const q = pickQuestion(o);
  assert(q, "expected a question");
  return q;
};

assert.equal(targetTier(undefined), 1);
assert.equal(targetTier({ attempted: 1, correct: 1 }), 1);
assert.equal(targetTier({ attempted: 10, correct: 4 }), 1);
assert.equal(targetTier({ attempted: 4, correct: 3 }), 2);
assert.equal(targetTier({ attempted: 6, correct: 6 }), 3);
assert.equal(targetTier({ attempted: 12, correct: 5 }), 1);

for (let i = 0; i < 100; i++) {
  assert.equal(pick({ topic: "loops", tier: targetTier() }).tier, 1);
  assert.equal(pick({ topic: "loops", tier: targetTier({ attempted: 8, correct: 8 }) }).tier, 3);
  assert.equal(pick({ topic: "loops", tier: targetTier({ attempted: 8, correct: 2 }) }).tier, 1);
  assert.equal(pick({ topic: "debugging", tier: 2 }).topic, "debugging");
  assert.equal(pick({ topic: "nonsense", tier: 1 }).tier, 1);
}

for (const topic of TOPICS) {
  const pool = ALL.filter((q) => q.topic === topic);
  const seen: number[] = [];
  for (let i = 0; i < pool.length; i++) {
    const q = pick({ topic, tier: 2, exclude: seen });
    assert(!seen.includes(q.id), `repeat before exhaustion in ${topic}`);
    seen.push(q.id);
  }
  const after = pick({ topic, tier: 2, exclude: seen });
  assert.notEqual(after.id, seen[seen.length - 1], "exhausted pool repeats most recent id");
}

const leaked = JSON.stringify(ALL.map((q) => pick({ topic: q.topic, tier: tierOf(q), exclude: [] })));
assert(!leaked.includes("currentAnswer") && !leaked.includes("reasoning"));
for (let i = 0; i < 50; i++) {
  const q = pick({ tier: 1 }) as Record<string, unknown>;
  assert(!("currentAnswer" in q) && !("reasoning" in q));
}

const crit = findQuestion(CRITICAL_THINKING_QUESTIONS[0].id);
assert.equal(crit?.currentAnswer, CRITICAL_THINKING_QUESTIONS[0].currentAnswer);
const reg = findQuestion(QUESTIONS[0].id);
assert.equal(reg?.currentAnswer, QUESTIONS[0].currentAnswer);
assert.equal(findQuestion(-5), undefined);

const w = weakestTopic({ variables: { attempted: 3, correct: 3 }, logic: { attempted: 3, correct: 1 }, loops: { attempted: 1, correct: 1 }, functions: { attempted: 1, correct: 1 }, debugging: { attempted: 1, correct: 1 }, algorithms: { attempted: 1, correct: 1 } });
assert.equal(w, "logic");
assert.equal(weakestTopic({ variables: { attempted: 1, correct: 1 } }) !== "variables", true);

console.log("topic        t1   t2   t3");
for (const topic of TOPICS) {
  const c: Record<Tier, number> = { 1: 0, 2: 0, 3: 0 };
  for (const q of ALL.filter((x) => x.topic === topic)) c[tierOf(q)]++;
  console.log(`${topic.padEnd(12)} ${String(c[1]).padStart(3)}  ${String(c[2]).padStart(3)}  ${String(c[3]).padStart(3)}`);
  for (const t of [1, 2, 3] as Tier[]) assert(pickQuestion({ topic, tier: t }), `no question for ${topic} tier ${t}`);
}
console.log("all checks passed");
