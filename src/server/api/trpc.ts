import { initTRPC, TRPCError } from "@trpc/server";
import { and, eq, gt } from "drizzle-orm";
import superjson from "superjson";
import { ZodError } from "zod";
import { SESSION_COOKIE } from "@/server/auth/players";
import { getDb } from "@/server/db";
import { players, sessions } from "@/server/db/schema";

export type SessionPlayer = { id: string; name: string; role: "student" | "teacher" };

/** The signed-in player from the vip_session cookie, or null. */
async function playerFromHeaders(headers: Headers): Promise<SessionPlayer | null> {
  const token = headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === SESSION_COOKIE)?.[1];
  if (!token) return null;
  const [row] = await getDb()
    .select({ id: players.id, name: players.name, role: players.role })
    .from(sessions)
    .innerJoin(players, eq(players.id, sessions.playerId))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row ? { id: row.id, name: row.name, role: row.role as SessionPlayer["role"] } : null;
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return { ...opts, player: await playerFromHeaders(opts.headers) };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.player) throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in first." });
  return next({ ctx: { ...ctx, player: ctx.player } });
});

export const teacherProcedure = authedProcedure.use(({ ctx, next }) => {
  if (ctx.player.role !== "teacher") throw new TRPCError({ code: "FORBIDDEN", message: "Teacher accounts only." });
  return next();
});
