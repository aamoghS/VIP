import { randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { aggregate } from "@/lib/sprint/aggregate";
import { getMission, questionsFor, toPublicMission } from "@/lib/sprint/mission";
import * as sprint from "@/lib/sprint/state";
import { SprintError } from "@/lib/sprint/state";
import { traceLayout } from "@/lib/sprint/trace";
import type { SprintState, TeamId } from "@/lib/sprint/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getDb } from "@/server/db";
import { reflections, rooms, storyResults } from "@/server/db/schema";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const code = z.string().trim().toUpperCase().length(6);
const team = z.enum(["A", "B"]);
const teacherToken = z.string().min(1).max(100);
const storyIndex = z.number().int().min(0).max(29);
const trace = z.array(z.array(z.string().max(40)).max(10)).max(30);

const bad = (message: string) => new TRPCError({ code: "BAD_REQUEST", message });

type Tx = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];
type Room = typeof rooms.$inferSelect;

function tokenMatches(given: string, stored: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(stored);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Runs one mutation under a row lock on the room: load, check the teacher token
 * if given, apply a pure transition, save. SprintError becomes BAD_REQUEST.
 */
async function mutate<T>(
  input: { code: string; teacherToken?: string },
  run: (ctx: { room: Room; state: SprintState; tx: Tx; now: string }) => Promise<{ state?: SprintState; missionId?: string; out: T }>,
): Promise<T> {
  return getDb().transaction(async (tx) => {
    const [room] = await tx.select().from(rooms).where(eq(rooms.code, input.code)).for("update");
    if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found." });
    if (input.teacherToken !== undefined && !tokenMatches(input.teacherToken, room.teacherToken)) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Wrong teacher token." });
    }
    try {
      const result = await run({ room, state: room.state, tx, now: new Date().toISOString() });
      await tx
        .update(rooms)
        .set({ state: result.state ?? room.state, missionId: result.missionId ?? room.missionId, updatedAt: new Date() })
        .where(eq(rooms.code, room.code));
      return result.out;
    } catch (e) {
      throw e instanceof SprintError ? bad(e.message) : e;
    }
  });
}

/** Simple state change, answered with the new state. */
const transition = (
  input: { code: string; teacherToken?: string },
  change: (state: SprintState, now: string) => SprintState,
) =>
  mutate(input, async ({ state, now }) => {
    const next = change(state, now);
    return { state: next, out: { state: next } };
  });

function missionOf(room: Room) {
  const mission = getMission(room.missionId);
  if (!mission) throw bad("Teacher has not picked a mission yet.");
  return mission;
}

/** Trace mat size for a story, or null when it has no code or no variables. */
function traceShape(code?: string) {
  const layout = code ? traceLayout(code) : null;
  return layout && layout.variables.length ? { rows: layout.lines.length, cols: layout.variables.length } : null;
}

function view(room: Room) {
  const mission = getMission(room.missionId);
  return {
    code: room.code,
    className: room.className,
    missionId: room.missionId,
    state: room.state,
    mission: mission ? toPublicMission(mission) : null,
    updatedAt: room.updatedAt,
  };
}

async function loadRoom(roomCode: string) {
  const [room] = await getDb().select().from(rooms).where(eq(rooms.code, roomCode)).limit(1);
  if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found." });
  return room;
}

export const roomRouter = createTRPCRouter({
  // Teacher

  create: publicProcedure
    .input(z.object({ className: z.string().trim().min(1).max(40) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const token = randomBytes(24).toString("hex");
      for (let attempt = 0; attempt < 10; attempt++) {
        const newCode = Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
        const inserted = await db
          .insert(rooms)
          .values({
            code: newCode,
            className: input.className,
            teacherToken: token,
            state: sprint.newSprintState(new Date().toISOString()),
          })
          .onConflictDoNothing()
          .returning({ code: rooms.code });
        if (inserted.length) return { code: newCode, teacherToken: token };
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not make a room code. Try again." });
    }),

  setMission: publicProcedure
    .input(z.object({ code, teacherToken, missionId: z.string().max(40) }))
    .mutation(({ input }) =>
      mutate(input, async ({ state }) => {
        if (!getMission(input.missionId)) throw bad("Unknown mission.");
        if (state.phase !== "lobby") throw bad("Pick a mission before planning starts.");
        return { missionId: input.missionId, out: { missionId: input.missionId } };
      }),
    ),

  startPlanning: publicProcedure.input(z.object({ code, teacherToken })).mutation(({ input }) =>
    mutate(input, async ({ room, state, now }) => {
      const mission = missionOf(room);
      const points = (t: TeamId) => questionsFor(mission, t).map((q) => q.points);
      const next = sprint.startPlanning(state, { A: points("A"), B: points("B") }, now);
      return { state: next, out: { state: next } };
    }),
  ),

  startWork: publicProcedure
    .input(z.object({ code, teacherToken, force: z.boolean().optional() }))
    .mutation(({ input }) => transition(input, (s, now) => sprint.startWork(s, input.force ?? false, now))),

  startRetro: publicProcedure
    .input(z.object({ code, teacherToken }))
    .mutation(({ input }) => transition(input, (s, now) => sprint.goToRetro(s, now))),

  newRound: publicProcedure
    .input(z.object({ code, teacherToken }))
    .mutation(({ input }) => transition(input, (s, now) => sprint.newRound(s, now))),

  dashboard: publicProcedure.input(z.object({ code, teacherToken })).query(async ({ input }) => {
    const room = await loadRoom(input.code);
    if (!tokenMatches(input.teacherToken, room.teacherToken)) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Wrong teacher token." });
    }
    const db = getDb();
    const results = await db.select().from(storyResults).where(eq(storyResults.roomCode, room.code));
    const notes = await db.select().from(reflections).where(eq(reflections.roomCode, room.code));
    return {
      ...view(room),
      results,
      reflections: notes,
      aggregates: {
        round: aggregate(results.filter((r) => r.round === room.state.round)),
        all: aggregate(results),
      },
    };
  }),

  // Students

  get: publicProcedure.input(z.object({ code })).query(async ({ input }) => view(await loadRoom(input.code))),

  join: publicProcedure
    .input(z.object({ code, team, name: z.string().trim().min(1).max(30) }))
    .mutation(({ input }) => transition(input, (s) => sprint.joinTeam(s, input.team, input.name))),

  savePlan: publicProcedure
    .input(z.object({ code, team, goal: z.string().max(200), estimates: z.array(z.number().int()).max(30) }))
    .mutation(({ input }) => transition(input, (s) => sprint.savePlan(s, input.team, input.goal, input.estimates))),

  markPlanned: publicProcedure
    .input(z.object({ code, team }))
    .mutation(({ input }) => transition(input, (s) => sprint.markPlanned(s, input.team))),

  checkAnswer: publicProcedure
    .input(z.object({ code, team, storyIndex, answer: z.string().max(300), reason: z.string().max(500), trace }))
    .mutation(({ input }) =>
      mutate(input, async ({ room, state }) => {
        const question = questionsFor(missionOf(room), input.team)[input.storyIndex];
        if (!question) throw bad("No such story.");
        if (!question.options.includes(input.answer)) throw bad("Pick one of the options.");
        const next = sprint.recordAnswer(
          state,
          input.team,
          input.storyIndex,
          { answer: input.answer, correct: input.answer === question.answer, reason: input.reason, trace: input.trace },
          traceShape(question.code),
        );
        // The first check locks the answer, so report the stored result.
        const correct = next.teams[input.team].stories[input.storyIndex].correct === true;
        return { state: next, out: { correct, explanation: question.explanation, state: next } };
      }),
    ),

  completeStory: publicProcedure.input(z.object({ code, team, storyIndex })).mutation(({ input }) =>
    mutate(input, async ({ room, state, tx, now }) => {
      const mission = missionOf(room);
      const question = questionsFor(mission, input.team)[input.storyIndex];
      if (!question) throw bad("No such story.");
      const next = sprint.completeStory(state, input.team, input.storyIndex, traceShape(question.code), now);
      const story = next.teams[input.team].stories[input.storyIndex];
      const row = {
        roomCode: room.code,
        round: next.round,
        team: input.team,
        storyIndex: input.storyIndex,
        missionId: mission.id,
        topic: mission.topic,
        objective: question.objective,
        points: next.teams[input.team].estimates[input.storyIndex],
        correct: story.correct === true,
        answer: story.answer ?? "",
        reason: story.reason,
        trace: story.trace,
      };
      await tx
        .insert(storyResults)
        .values(row)
        .onConflictDoUpdate({
          target: [storyResults.roomCode, storyResults.round, storyResults.team, storyResults.storyIndex],
          set: row,
        });
      return { state: next, out: { state: next } };
    }),
  ),

  passBaton: publicProcedure
    .input(z.object({ code, note: z.string().max(500) }))
    .mutation(({ input }) => transition(input, (s, now) => sprint.passBaton(s, input.note, now))),

  goToRetro: publicProcedure
    .input(z.object({ code }))
    .mutation(({ input }) => transition(input, (s, now) => sprint.goToRetro(s, now))),

  submitReflection: publicProcedure
    .input(
      z.object({
        code,
        team,
        seat: z.number().int().min(1).max(4),
        wentWell: z.string().trim().max(500),
        improvement: z.string().trim().min(1).max(500),
        exitAnswer: z.string().trim().min(1).max(500),
      }),
    )
    .mutation(({ input }) =>
      mutate(input, async ({ room, state, tx }) => {
        sprint.assertRetro(state);
        const row = {
          roomCode: room.code,
          round: state.round,
          team: input.team,
          seat: input.seat,
          wentWell: input.wentWell,
          improvement: input.improvement,
          exitAnswer: input.exitAnswer,
        };
        await tx
          .insert(reflections)
          .values(row)
          .onConflictDoUpdate({
            target: [reflections.roomCode, reflections.round, reflections.team, reflections.seat],
            set: row,
          });
        return { out: { ok: true as const } };
      }),
    ),
});
