import { CRITICAL_THINKING_QUESTIONS, QUESTIONS, type Question } from "./bank";
import type { Tier } from "@/lib/practice/targeting";

const ALL: Question[] = [...QUESTIONS, ...CRITICAL_THINKING_QUESTIONS];
const BY_ID = new Map(ALL.map((q) => [q.id, q]));

export function tierOf(q: Question): Tier {
  if (q.id >= 900) return (q.complexity ?? 2) >= 3 ? 3 : 2;
  if (q.id >= 300) return Math.min(3, Math.max(1, q.complexity ?? 2)) as Tier;
  if (q.id >= 200) return 1;
  if (q.id >= 100) return 2;
  return 1;
}

export function findQuestion(id: number): Question | undefined {
  return BY_ID.get(id);
}

export type PublicQuestion = Pick<Question, "id" | "topic" | "type" | "question" | "options" | "complexity" | "bloomLevel"> & {
  tier: Tier;
};

export function pickQuestion({ topic, tier, exclude = [] }: { topic?: string | null; tier: Tier; exclude?: number[] }): PublicQuestion | null {
  let pool = topic ? ALL.filter((q) => q.topic === topic) : [];
  if (pool.length === 0) pool = ALL;

  const skip = new Set(exclude);
  let candidates = pool.filter((q) => !skip.has(q.id));
  if (candidates.length === 0) {
    const last = exclude[exclude.length - 1];
    candidates = pool.filter((q) => q.id !== last);
    if (candidates.length === 0) candidates = pool;
  }
  if (candidates.length === 0) return null;

  // distance first; on a tie the lower tier wins
  const rank = (q: Question) => Math.abs(tierOf(q) - tier) * 10 + (tierOf(q) > tier ? 1 : 0);
  const best = Math.min(...candidates.map(rank));
  const nearest = candidates.filter((q) => rank(q) === best);
  const q = nearest[Math.floor(Math.random() * nearest.length)];
  return {
    id: q.id,
    topic: q.topic,
    type: q.type,
    question: q.question,
    options: q.options,
    complexity: q.complexity,
    bloomLevel: q.bloomLevel,
    tier: tierOf(q),
  };
}
