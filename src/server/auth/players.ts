import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, lte } from "drizzle-orm";
import { getDb } from "@/server/db";
import { players, sessions, type Role } from "@/server/db/schema";

export const SESSION_COOKIE = "vip_session";
const COOKIE = SESSION_COOKIE;

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

const SESSION_MS = 60 * 60 * 24 * 30 * 1000;

async function setSession(playerId: string) {
  const token = randomBytes(24).toString("hex");
  const db = getDb();
  await db.delete(sessions).where(and(eq(sessions.playerId, playerId), lte(sessions.expiresAt, new Date())));
  await db.insert(sessions).values({ token, playerId, expiresAt: new Date(Date.now() + SESSION_MS) });
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
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const [found] = await getDb()
    .select({ player: players })
    .from(sessions)
    .innerJoin(players, eq(players.id, sessions.playerId))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  const row = found?.player;
  if (!row) return null;
  return { name: row.name, role: row.role, progress: readProgress(row.progress) };
}

export async function currentPlayerId() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await getDb()
    .select({ id: players.id })
    .from(sessions)
    .innerJoin(players, eq(players.id, sessions.playerId))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row?.id ?? null;
}

export async function signUp(name: string, password: string, progress: PlayerProgress, role: Role = "student") {
  const display = nameKey(name);
  if (display.length < 2 || display.length > 24) return { error: "Use a name, 2 to 24 characters." };
  if (password.length < 4 || password.length > 72) return { error: "Password needs at least 4 characters." };
  const id = randomUUID();
  try {
    await getDb().insert(players).values({
      id,
      name: display,
      nameKey: display.toLowerCase(),
      passwordHash: hashPassword(password),
      role,
      progress: readProgress(progress),
    });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") return { error: "That name is taken." };
    throw error;
  }
  await setSession(id);
  return { name: display, role, progress: readProgress(progress) };
}

export async function signIn(name: string, password: string) {
  const display = nameKey(name);
  if (!display || !password) return { error: "Name and password." };
  const [row] = await getDb()
    .select()
    .from(players)
    .where(eq(players.nameKey, display.toLowerCase()))
    .limit(1);
  if (!row || !checkPassword(password, row.passwordHash)) return { error: "Wrong name or password." };
  await setSession(row.id);
  return { name: row.name, role: row.role, progress: readProgress(row.progress) };
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await getDb().delete(sessions).where(eq(sessions.token, token));
  }
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function saveProgress(progress: PlayerProgress) {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const [session] = await getDb()
    .select({ playerId: sessions.playerId })
    .from(sessions)
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  if (!session) return false;
  const updated = await getDb()
    .update(players)
    .set({ progress: readProgress(progress), updatedAt: new Date() })
    .where(eq(players.id, session.playerId))
    .returning({ id: players.id });
  return updated.length > 0;
}
