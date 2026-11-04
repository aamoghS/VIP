import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { currentPlayerId } from "@/server/auth/players";
import { files } from "@/server/storage";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;

// Upload one file for the signed-in player. Body: multipart form with a `file` field.
export async function POST(request: Request) {
  const playerId = await currentPlayerId();
  if (!playerId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (5 MB max)." }, { status: 413 });

  const key = `players/${playerId}/${randomUUID()}`;
  await files.upload(key, file, { contentType: file.type || "application/octet-stream" });
  const url = await files.url(key, { expiresIn: 3600 });
  return NextResponse.json({ key, url });
}

// Presigned download URL for one of the signed-in player's own files.
export async function GET(request: Request) {
  const playerId = await currentPlayerId();
  if (!playerId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!key.startsWith(`players/${playerId}/`)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!(await files.exists(key))) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ key, url: await files.url(key, { expiresIn: 3600 }) });
}
