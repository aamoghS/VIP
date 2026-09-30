import { NextResponse } from "next/server";
import { currentPlayer, saveProgress, signIn, signOut, signUp, type PlayerProgress } from "@/server/auth/players";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const player = await currentPlayer();
    return NextResponse.json({ player });
  } catch {
    return NextResponse.json({ error: "Score book is down." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "");
    const password = String(body.password ?? "");
    const result = body.mode === "create"
      ? await signUp(name, password, body.progress as PlayerProgress)
      : await signIn(name, password);
    if ("error" in result && result.error) return NextResponse.json(result, { status: 400 });
    return NextResponse.json({ player: result });
  } catch {
    return NextResponse.json({ error: "Score book is down." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const ok = await saveProgress(body as PlayerProgress);
    if (!ok) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Score book is down." }, { status: 503 });
  }
}

export async function DELETE() {
  try {
    await signOut();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Score book is down." }, { status: 503 });
  }
}
