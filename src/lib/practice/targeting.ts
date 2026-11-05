export const TOPICS = ["variables", "logic", "loops", "functions", "debugging", "algorithms"] as const;

export type Tier = 1 | 2 | 3;
export type TopicStat = { attempted: number; correct: number };

export function targetTier(stat?: TopicStat): Tier {
  if (!stat || stat.correct < 2) return 1;
  const accuracy = stat.attempted > 0 ? stat.correct / stat.attempted : 0;
  if (accuracy < 0.5) return 1;
  if (stat.correct >= 5 && accuracy >= 0.75) return 3;
  return 2;
}

export function weakestTopic(topicStats: Record<string, TopicStat>): string {
  const fresh = TOPICS.filter((t) => !topicStats[t]?.attempted);
  if (fresh.length > 0) return fresh[Math.floor(Math.random() * fresh.length)];
  let best: string = TOPICS[0];
  let bestAcc = Infinity;
  for (const t of TOPICS) {
    const s = topicStats[t];
    const acc = s.correct / s.attempted;
    if (acc < bestAcc) {
      bestAcc = acc;
      best = t;
    }
  }
  return best;
}
