import { NextResponse } from "next/server";
import { targetTier } from "@/lib/practice/targeting";
import { pickQuestion } from "@/server/questions/pick";

export const dynamic = "force-dynamic";

function count(value: string | null) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const topic = search.get("topic");
  const attempted = count(search.get("attempted"));
  const correct = Math.min(count(search.get("correct")), attempted);
  const exclude = (search.get("exclude") ?? "")
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n))
    .slice(-50);

  const selected = pickQuestion({ topic, tier: targetTier({ attempted, correct }), exclude });
  if (!selected) {
    return NextResponse.json({ error: "No questions found for this topic." }, { status: 404 });
  }
  return NextResponse.json(selected, { headers: { "Cache-Control": "no-store" } });
}
