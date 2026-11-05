import { randomInt } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { aggregate } from "@/lib/sprint/aggregate";
import { getMission, questionsFor, toPublicMission } from "@/lib/sprint/mission";
import * as sprint from "@/lib/sprint/state";
import { SprintError } from "@/lib/sprint/state";
import { traceLayout } from "@/lib/sprint/trace";
import type { SprintState, TeamId } from "@/lib/sprint/types";
import { authedProcedure, createTRPCRouter, teacherProcedure, type SessionPlayer } from "@/server/api/trpc";
import { getDb } from "@/server/db";
import { players, reflections, roomMembers, rooms, storyResults } from "@/server/db/schema";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const code = z.string().trim().toUpperCase().length(6);
const team = z.enum(["A", "B"]);
const storyIndex = z.number().int().min(0).max(29);
const trace = z.array(z.array(z.string().max(40)).max(10)).max(30);

const bad = (message: string) => new TRPCError({ code: "BAD_REQUEST", message });

type Tx = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];
type Room = typeof rooms.$inferSelect;

type Check = (ctx: { room: Room; tx: Tx }) => Promise<void> | void;

/**
 * Runs one mutation under a row lock on the room: load, run the permission
 * check, apply a pure transition, save. SprintError becomes BAD_REQUEST.
 */
async function mutate<T>(
  input: { code: string },
  run: (ctx: { room: Room; state: SprintState; tx: Tx; now: string }) => Promise<{ state?: SprintState; missionId?: string; out: T }>,
  check?: Check,
): Promise<T> {
  return getDb().transaction(async (tx) => {
    const [room] = await tx.select().from(rooms).where(eq(rooms.code, input.code)).for("update");
    if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found." });
    await check?.({ room, tx });
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

const forbid = (message: string) => new TRPCError({ code: "FORBIDDEN", message });

function assertOwner(room: Room, player: SessionPlayer) {
  if (room.ownerId !== player.id) throw forbid("This is not your room.");
}

const asOwner = (player: SessionPlayer): Check => ({ room }) => assertOwner(room, player);

async function membership(tx: Tx | ReturnType<typeof getDb>, roomCode: string, playerId: string) {
  const [row] = await tx
    .select()
    .from(roomMembers)
    .where(and(eq(roomMembers.roomCode, roomCode), eq(roomMembers.playerId, playerId)))
    .limit(1);
  return row ?? null;
}

/** The caller must be on a team (and on `team` if one is named). */
const asMember = (player: SessionPlayer, team?: TeamId): Check => async ({ room, tx }) => {
  const me = await membership(tx, room.code, player.id);
  if (!me) throw forbid("Join a team first.");
  if (team && me.team !== team) throw forbid(`You're on Team ${me.team}.`);
};

/** Simple state change, answered with the new state. */
const transition = (
  input: { code: string },
  change: (state: SprintState, now: string) => SprintState,
  check?: Check,
) =>
  mutate(
    input,
    async ({ state, now }) => {
      const next = change(state, now);
      return { state: next, out: { state: next } };
    },
    check,
  );

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

async function membersOf(roomCode: string) {
  return getDb()
    .select({ name: players.name, team: roomMembers.team, seat: roomMembers.seat, playerId: roomMembers.playerId })
    .from(roomMembers)
    .innerJoin(players, eq(players.id, roomMembers.playerId))
    .where(eq(roomMembers.roomCode, roomCode))
    .orderBy(roomMembers.team, roomMembers.seat);
}

async function view(room: Room, viewer: SessionPlayer) {
  const mission = getMission(room.missionId);
  const [all, [sent]] = await Promise.all([
    membersOf(room.code),
    getDb()
      .select({ createdAt: reflections.createdAt })
      .from(reflections)
      .where(and(eq(reflections.roomCode, room.code), eq(reflections.round, room.state.round), eq(reflections.playerId, viewer.id)))
      .limit(1),
  ]);
  const mine = all.find((m) => m.playerId === viewer.id);
  return {
    members: all.map(({ name, team, seat }) => ({ name, team: team as TeamId, seat })),
    me: mine ? { team: mine.team as TeamId, seat: mine.seat } : null,
    code: room.code,
    className: room.className,
    missionId: room.missionId,
    state: room.state,
    mission: mission ? toPublicMission(mission) : null,
    updatedAt: room.updatedAt,
    myReflection: sent ? { createdAt: sent.createdAt } : null,
  };
}

async function loadRoom(roomCode: string) {
  const [room] = await getDb().select().from(rooms).where(eq(rooms.code, roomCode)).limit(1);
  if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found." });
  return room;
}

export const roomRouter = createTRPCRouter({
  // Teacher

  create: teacherProcedure
    .input(z.object({ className: z.string().trim().min(1).max(40) }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      for (let attempt = 0; attempt < 10; attempt++) {
        const newCode = Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
        const inserted = await db
          .insert(rooms)
          .values({
            code: newCode,
            className: input.className,
            ownerId: ctx.player.id,
            state: sprint.newSprintState(new Date().toISOString()),
          })
          .onConflictDoNothing()
          .returning({ code: rooms.code });
        if (inserted.length) return { code: newCode };
      }
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not make a room code. Try again." });
    }),

  mine: teacherProcedure.query(async ({ ctx }) => {
    const rows = await getDb()
      .select({ code: rooms.code, className: rooms.className, state: rooms.state, createdAt: rooms.createdAt })
      .from(rooms)
      .where(eq(rooms.ownerId, ctx.player.id))
      .orderBy(desc(rooms.createdAt));
    return rows.map((r) => ({ code: r.code, className: r.className, phase: r.state.phase, createdAt: r.createdAt }));
  }),

  setMission: teacherProcedure
    .input(z.object({ code, missionId: z.string().max(40) }))
    .mutation(({ input, ctx }) =>
      mutate(
        input,
        async ({ state }) => {
          if (!getMission(input.missionId)) throw bad("Unknown mission.");
          if (state.phase !== "lobby") throw bad("Pick a mission before planning starts.");
          return { missionId: input.missionId, out: { missionId: input.missionId } };
        },
        asOwner(ctx.player),
      ),
    ),

  startPlanning: teacherProcedure.input(z.object({ code })).mutation(({ input, ctx }) =>
    mutate(
      input,
      async ({ room, state, now }) => {
        const mission = missionOf(room);
        const points = (t: TeamId) => questionsFor(mission, t).map((q) => q.points);
        const next = sprint.startPlanning(state, { A: points("A"), B: points("B") }, now);
        return { state: next, out: { state: next } };
      },
      asOwner(ctx.player),
    ),
  ),

  startWork: teacherProcedure
    .input(z.object({ code, force: z.boolean().optional() }))
    .mutation(({ input, ctx }) =>
      transition(input, (s, now) => sprint.startWork(s, input.force ?? false, now), asOwner(ctx.player)),
    ),

  startRetro: teacherProcedure
    .input(z.object({ code }))
    .mutation(({ input, ctx }) => transition(input, (s, now) => sprint.goToRetro(s, now), asOwner(ctx.player))),

  newRound: teacherProcedure
    .input(z.object({ code }))
    .mutation(({ input, ctx }) => transition(input, (s, now) => sprint.newRound(s, now), asOwner(ctx.player))),

  dashboard: teacherProcedure.input(z.object({ code })).query(async ({ input, ctx }) => {
    const room = await loadRoom(input.code);
    assertOwner(room, ctx.player);
    const db = getDb();
    const resultsQuery = db.select().from(storyResults).where(eq(storyResults.roomCode, room.code));
    const notesQuery = db
      .select({
        id: reflections.id,
        playerName: players.name,
        round: reflections.round,
        team: reflections.team,
        seat: reflections.seat,
        wentWell: reflections.wentWell,
        improvement: reflections.improvement,
        exitAnswer: reflections.exitAnswer,
        createdAt: reflections.createdAt,
      })
      .from(reflections)
      .innerJoin(players, eq(players.id, reflections.playerId))
      .where(eq(reflections.roomCode, room.code));
    const [results, notes, roomView] = await Promise.all([resultsQuery, notesQuery, view(room, ctx.player)]);
    return {
      ...roomView,
      results,
      reflections: notes,
      aggregates: {
        round: aggregate(results.filter((r) => r.round === room.state.round)),
        all: aggregate(results),
      },
    };
  }),

  // Students (any signed-in account)

  get: authedProcedure
    .input(z.object({ code }))
    .query(async ({ input, ctx }) => view(await loadRoom(input.code), ctx.player)),

  join: authedProcedure
    .input(z.object({ code, team, name: z.string().trim().max(30).optional() }))
    .mutation(({ input, ctx }) =>
      mutate(input, async ({ room, state, tx }) => {
        const existing = await membership(tx, room.code, ctx.player.id);
        if (!existing || existing.team !== input.team) {
          if (existing) {
            if (state.phase !== "lobby" && state.phase !== "planning") throw bad("You can only switch teams before work starts.");
            await tx.delete(roomMembers).where(eq(roomMembers.id, existing.id));
          }
          const onTeam = await tx
            .select({ seat: roomMembers.seat })
            .from(roomMembers)
            .where(and(eq(roomMembers.roomCode, room.code), eq(roomMembers.team, input.team)));
          const taken = new Set(onTeam.map((m) => m.seat));
          let seat = 1;
          while (taken.has(seat)) seat++;
          await tx.insert(roomMembers).values({ roomCode: room.code, playerId: ctx.player.id, team: input.team, seat });
        }
        const all = await tx.select({ team: roomMembers.team }).from(roomMembers).where(eq(roomMembers.roomCode, room.code));
        const has = new Set(all.map((m) => m.team));
        const next = sprint.syncTeams(state, { A: has.has("A"), B: has.has("B") }, { [input.team]: input.name });
        return { state: next, out: { state: next } };
      }),
    ),

  savePlan: authedProcedure
    .input(z.object({ code, team, goal: z.string().max(200), estimates: z.array(z.number().int()).max(30) }))
    .mutation(({ input, ctx }) =>
      transition(input, (s) => sprint.savePlan(s, input.team, input.goal, input.estimates), asMember(ctx.player, input.team)),
    ),

  markPlanned: authedProcedure
    .input(z.object({ code, team }))
    .mutation(({ input, ctx }) =>
      transition(input, (s) => sprint.markPlanned(s, input.team), asMember(ctx.player, input.team)),
    ),

  checkAnswer: authedProcedure
    .input(z.object({ code, team, storyIndex, answer: z.string().max(300), reason: z.string().max(500), trace }))
    .mutation(({ input, ctx }) =>
      mutate(
        input,
        async ({ room, state }) => {
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
        },
        asMember(ctx.player, input.team),
      ),
    ),

  completeStory: authedProcedure.input(z.object({ code, team, storyIndex })).mutation(({ input, ctx }) =>
    mutate(
      input,
      async ({ room, state, tx, now }) => {
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
      },
      asMember(ctx.player, input.team),
    ),
  ),

  passBaton: authedProcedure
    .input(z.object({ code, note: z.string().max(500) }))
    .mutation(({ input, ctx }) =>
      transition(input, (s, now) => sprint.passBaton(s, input.note, now), asMember(ctx.player, "A")),
    ),

  goToRetro: authedProcedure
    .input(z.object({ code }))
    .mutation(({ input, ctx }) => transition(input, (s, now) => sprint.goToRetro(s, now), asMember(ctx.player))),

  submitReflection: authedProcedure
    .input(
      z.object({
        code,
        wentWell: z.string().trim().max(500),
        improvement: z.string().trim().min(1).max(500),
        exitAnswer: z.string().trim().min(1).max(500),
      }),
    )
    .mutation(({ input, ctx }) =>
      mutate(input, async ({ room, state, tx }) => {
        sprint.assertRetro(state);
        const me = await membership(tx, room.code, ctx.player.id);
        if (!me) throw forbid("Join a team first.");
        const row = {
          roomCode: room.code,
          playerId: ctx.player.id,
          round: state.round,
          team: me.team,
          seat: me.seat,
          wentWell: input.wentWell,
          improvement: input.improvement,
          exitAnswer: input.exitAnswer,
        };
        await tx
          .insert(reflections)
          .values(row)
          .onConflictDoUpdate({
            target: [reflections.roomCode, reflections.round, reflections.playerId],
            set: row,
          });
        return { out: { ok: true as const } };
      }),
    ),
});
