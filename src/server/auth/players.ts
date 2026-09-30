import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/server/db";
import { players } from "@/server/db/schema";

const COOKIE = "vip_session";

export type PlayerProgress = {
  xp: number;
  unlockedItems: { id: string; name: string; icon: string }[];
  sprintStage: number;
  questionsSolved: number;
  teamMissionsCompleted: number;
  topicStats: Record<string, { attempted: number; correct: number }>;
  explanations: { topic: string; text: string }[];
};

const emptyProgress = (): PlayerProgress => ({
  xp: 0,
  unlockedItems: [],
  sprintStage: 1,
  questionsSolved: 0,
  teamMissionsCompleted: 0,
  topicStats: {},
  explanations: [],
});

let tableReady: Promise<void> | null = null;

function ensureTable() {
  tableReady ??= (async () => {
    const db = getDb();
    await db.execute(sql`
      create table if not exists public.players (
        id text primary key,
        name text not null,
        name_key text not null unique,
        password_hash text not null,
        session_token text unique,
        progress jsonb not null default '{}'::jsonb,
        updated_at timestamptz not null default now()
      )
    `);
    await db.execute(sql`alter table public.players enable row level security`);
    await db.execute(sql`revoke all on public.players from anon, authenticated`);
  })();
  return tableReady;
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

function checkPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function nameKey(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function readProgress(value: unknown): PlayerProgress {
  if (!value || typeof value !== "object") return emptyProgress();
  const row = value as Partial<PlayerProgress>;
  return {
    xp: Number.isFinite(row.xp) ? Number(row.xp) : 0,
    unlockedItems: Array.isArray(row.unlockedItems) ? row.unlockedItems : [],
    sprintStage: Number.isFinite(row.sprintStage) ? Number(row.sprintStage) : 1,
    questionsSolved: Number.isFinite(row.questionsSolved) ? Number(row.questionsSolved) : 0,
    teamMissionsCompleted: Number.isFinite(row.teamMissionsCompleted) ? Number(row.teamMissionsCompleted) : 0,
    topicStats: row.topicStats && typeof row.topicStats === "object" ? row.topicStats : {},
    explanations: Array.isArray(row.explanations) ? row.explanations : [],
  };
}

async function setSession(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function currentPlayer() {
  await ensureTable();
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await getDb().select().from(players).where(eq(players.sessionToken, token)).limit(1);
  if (!row) return null;
  return { name: row.name, progress: readProgress(row.progress) };
}

export async function signUp(name: string, password: string, progress: PlayerProgress) {
  const display = nameKey(name);
  if (display.length < 2 || display.length > 24) return { error: "Use a name, 2 to 24 characters." };
  if (password.length < 4 || password.length > 72) return { error: "Password needs at least 4 characters." };
  await ensureTable();
  const token = randomBytes(24).toString("hex");
  try {
    await getDb().insert(players).values({
      id: randomUUID(),
      name: display,
      nameKey: display.toLowerCase(),
      passwordHash: hashPassword(password),
      sessionToken: token,
      progress: readProgress(progress),
    });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") return { error: "That name is taken." };
    throw error;
  }
  await setSession(token);
  return { name: display, progress: readProgress(progress) };
}

export async function signIn(name: string, password: string) {
  const display = nameKey(name);
  if (!display || !password) return { error: "Name and password." };
  await ensureTable();
  const [row] = await getDb()
    .select()
    .from(players)
    .where(eq(players.nameKey, display.toLowerCase()))
    .limit(1);
  if (!row || !checkPassword(password, row.passwordHash)) return { error: "Wrong name or password." };
  const token = randomBytes(24).toString("hex");
  await getDb().update(players).set({ sessionToken: token, updatedAt: new Date() }).where(eq(players.id, row.id));
  await setSession(token);
  return { name: row.name, progress: readProgress(row.progress) };
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await ensureTable();
    await getDb().update(players).set({ sessionToken: null }).where(eq(players.sessionToken, token));
  }
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function saveProgress(progress: PlayerProgress) {
  await ensureTable();
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const updated = await getDb()
    .update(players)
    .set({ progress: readProgress(progress), updatedAt: new Date() })
    .where(eq(players.sessionToken, token))
    .returning({ id: players.id });
  return updated.length > 0;
}
