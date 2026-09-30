import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { questions } from "../src/server/db/schema";
import { CRITICAL_THINKING_QUESTIONS, QUESTIONS } from "../src/server/questions/bank";

const raw = process.env.DATABASE_URL;
if (!raw) throw new Error("DATABASE_URL is not set");

const url = new URL(raw);
const sql = postgres({
  host: url.hostname,
  port: Number(url.port || 5432),
  database: url.pathname.replace(/^\//, ""),
  username: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  prepare: false,
  max: 1,
  ssl: "require",
});

async function main() {
await sql.unsafe(`
  create table if not exists public.questions (
    id integer primary key,
    topic text not null,
    type text not null,
    prompt text not null,
    options jsonb not null,
    current_answer text not null,
    reasoning text not null,
    complexity integer,
    bloom_level text,
    critical boolean not null default false
  );
  alter table public.questions enable row level security;
  revoke all on public.questions from anon, authenticated;
`);

await sql`truncate public.questions`;

const db = drizzle(sql);
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

const [{ count }] = await sql<{ count: string }[]>`select count(*) from public.questions`;
const [{ critical }] = await sql<{ critical: string }[]>`select count(*) as critical from public.questions where critical`;
console.log(JSON.stringify({ questions: Number(count), critical: Number(critical) }));
await sql.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
