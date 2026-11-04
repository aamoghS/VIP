import { roomRouter } from "@/server/api/routers/room";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  room: roomRouter,
});

export type AppRouter = typeof appRouter;
