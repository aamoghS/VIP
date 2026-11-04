import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { questions } from "../src/server/db/schema";
import { CRITICAL_THINKING_QUESTIONS, QUESTIONS } from "../src/server/questions/bank";

// Table comes from the Drizzle migration (npm run db:push). Direct URL for bulk writes.
const raw = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!raw) throw new Error("DATABASE_URL is not set");

const pool = new Pool({ connectionString: raw, max: 1 });

async function main() {
await pool.query("truncate public.questions");

const db = drizzle(pool);
const rows = [
  ...QUESTIONS.map((q) => ({
    id: q.id,
    topic: q.topic,
    type: q.type,
    prompt: q.question,
    options: q.options,
    currentAnswer: q.currentAnswer,
    reasoning: q.reasoning,
    complexity: q.complexity ?? null,
    bloomLevel: q.bloomLevel ?? null,
    critical: false,
  })),
  ...CRITICAL_THINKING_QUESTIONS.map((q, i) => ({
    id: 900 + i,
    topic: q.topic,
    type: q.type,
    prompt: q.question,
    options: q.options,
    currentAnswer: q.currentAnswer,
    reasoning: q.reasoning,
    complexity: q.complexity ?? null,
    bloomLevel: q.bloomLevel ?? null,
    critical: true,
  })),
];

for (let i = 0; i < rows.length; i += 40) {
  await db.insert(questions).values(rows.slice(i, i + 40));
}

const { rows: [{ count, critical }] } = await pool.query<{ count: string; critical: string }>(
  "select count(*) as count, count(*) filter (where critical) as critical from public.questions",
);
console.log(JSON.stringify({ questions: Number(count), critical: Number(critical) }));
await pool.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
