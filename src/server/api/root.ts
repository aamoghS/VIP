import { sprintRouter } from "@/server/api/routers/sprint";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  sprint: sprintRouter,
});

export type AppRouter = typeof appRouter;
