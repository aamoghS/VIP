import { NextResponse } from "next/server";
import { and, eq, gte, lte, lt, ne, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/server/db";
import { questions } from "@/server/db/schema";

export const dynamic = "force-dynamic";

const publicColumns = {
  id: questions.id,
  topic: questions.topic,
  type: questions.type,
  question: questions.prompt,
  options: questions.options,
  complexity: questions.complexity,
  bloomLevel: questions.bloomLevel,
};

function filters(search: URLSearchParams, topicOverride?: string | null): SQL[] {
  const topic = topicOverride === undefined ? search.get("topic") : topicOverride;
  const critical = search.get("critical");
  const complexity = search.get("complexity");
  const audience = search.get("audience");
  const id = search.get("id");
  const parts: SQL[] = [];

  if (critical === "1") {
    parts.push(eq(questions.critical, true));
    if (topic) parts.push(eq(questions.topic, topic));
  } else if (complexity === "simple") {
    parts.push(eq(questions.critical, false), gte(questions.id, 200), lte(questions.id, 293));
  } else if (complexity === "complex") {
    parts.push(eq(questions.critical, false), gte(questions.id, 100), lte(questions.id, 193));
  } else if (audience === "middle") {
    parts.push(eq(questions.critical, false), lt(questions.id, 300));
  } else if (topic) {
    parts.push(eq(questions.critical, false), gte(questions.id, 300), eq(questions.topic, topic));
  } else {
    parts.push(eq(questions.critical, false), gte(questions.id, 300));
  }

  if (id && Number.isFinite(Number(id))) parts.push(ne(questions.id, Number(id)));
  return parts;
}

async function pick(search: URLSearchParams, topicOverride?: string | null) {
  const db = getDb();
  return db
    .select(publicColumns)
    .from(questions)
    .where(and(...filters(search, topicOverride)))
    .orderBy(sql`random()`)
    .limit(1);
}

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  try {
    let rows = await pick(search);
    if (rows.length === 0 && search.get("critical") === "1" && search.get("topic")) {
      rows = await pick(search, null);
    }
    if (rows.length === 0 && search.get("topic") && search.get("critical") !== "1") {
      const db = getDb();
      rows = await db
        .select(publicColumns)
        .from(questions)
        .where(and(eq(questions.critical, false), eq(questions.topic, search.get("topic")!)))
        .orderBy(sql`random()`)
        .limit(1);
    }
    const selected = rows[0];
    if (!selected) {
      return NextResponse.json({ error: "No questions found for this topic." }, { status: 404 });
    }
    return NextResponse.json(selected);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unavailable";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
