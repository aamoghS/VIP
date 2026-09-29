import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { TeamResult } from "@/app/sprint/types";

export const sprintRooms = pgTable("sprint_rooms", {
  id: text("id").primaryKey(),
  selectedMissionId: text("selected_mission_id"),
  groupAResult: jsonb("group_a_result").$type<TeamResult>().notNull(),
  groupBResult: jsonb("group_b_result").$type<TeamResult>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
