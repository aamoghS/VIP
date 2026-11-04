export type ResultRow = { topic: string; objective: number; correct: boolean };
export type Rate = { key: string; total: number; correct: number };

function group(rows: ResultRow[], keyOf: (r: ResultRow) => string): Rate[] {
  const map = new Map<string, Rate>();
  for (const r of rows) {
    const key = keyOf(r);
    const rate = map.get(key) ?? { key, total: 0, correct: 0 };
    rate.total += 1;
    if (r.correct) rate.correct += 1;
    map.set(key, rate);
  }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/** Correct counts per topic and per objective (key is the objective number as text). */
export const aggregate = (rows: ResultRow[]) => ({
  byTopic: group(rows, (r) => r.topic),
  byObjective: group(rows, (r) => String(r.objective)),
});
