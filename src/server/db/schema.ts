import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { TeamResult } from "@/app/sprint/types";

export const sprintRooms = pgTable("sprint_rooms", {
  id: text("id").primaryKey(),
  selectedMissionId: text("selected_mission_id"),
  groupAResult: jsonb("group_a_result").$type<TeamResult>().notNull(),
  groupBResult: jsonb("group_b_result").$type<TeamResult>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameKey: text("name_key").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  sessionToken: text("session_token").unique(),
  progress: jsonb("progress").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: integer("id").primaryKey(),
  topic: text("topic").notNull(),
  type: text("type").notNull(),
  prompt: text("prompt").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  currentAnswer: text("current_answer").notNull(),
  reasoning: text("reasoning").notNull(),
  complexity: integer("complexity"),
  bloomLevel: text("bloom_level"),
  critical: boolean("critical").notNull().default(false),
});
