import { eq } from "drizzle-orm";
import { z } from "zod";
import { freshTeam, type TeamResult } from "@/app/sprint/types";
import { getDb } from "@/server/db";
import { sprintRooms } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const teamResult = z.object({
  questionsAnswered: z.number(),
  questionsCorrect: z.number(),
  points: z.number(),
  completed: z.boolean(),
});

export const sprintRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string().default("default") }))
    .query(async ({ input }) => {
      const db = getDb();
      const [room] = await db.select().from(sprintRooms).where(eq(sprintRooms.id, input.id)).limit(1);
      return room ?? null;
    }),

  save: publicProcedure
    .input(z.object({
      id: z.string().default("default"),
      selectedMissionId: z.string().nullable().optional(),
      groupAResult: teamResult.optional(),
      groupBResult: teamResult.optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const groupA: TeamResult = input.groupAResult ?? freshTeam();
      const groupB: TeamResult = input.groupBResult ?? freshTeam();
      await db
        .insert(sprintRooms)
        .values({
          id: input.id,
          selectedMissionId: input.selectedMissionId ?? null,
          groupAResult: groupA,
          groupBResult: groupB,
        })
        .onConflictDoUpdate({
          target: sprintRooms.id,
          set: {
            ...(input.selectedMissionId !== undefined ? { selectedMissionId: input.selectedMissionId } : {}),
            ...(input.groupAResult ? { groupAResult: input.groupAResult } : {}),
            ...(input.groupBResult ? { groupBResult: input.groupBResult } : {}),
            updatedAt: new Date(),
          },
        });
      return { ok: true };
    }),
});
