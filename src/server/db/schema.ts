import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import type { SprintState } from "@/lib/sprint/types";

export const rooms = pgTable("rooms", {
  code: text("code").primaryKey(),
  className: text("class_name").notNull(),
  teacherToken: text("teacher_token").notNull(),
  missionId: text("mission_id"),
  state: jsonb("state").$type<SprintState>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const storyResults = pgTable(
  "story_results",
  {
    id: serial("id").primaryKey(),
    roomCode: text("room_code").notNull().references(() => rooms.code, { onDelete: "cascade" }),
    round: integer("round").notNull(),
    team: text("team").notNull(),
    storyIndex: integer("story_index").notNull(),
    missionId: text("mission_id").notNull(),
    topic: text("topic").notNull(),
    objective: integer("objective").notNull(),
    points: integer("points").notNull(),
    correct: boolean("correct").notNull(),
    answer: text("answer").notNull(),
    reason: text("reason").notNull(),
    trace: jsonb("trace").$type<string[][]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.roomCode, t.round, t.team, t.storyIndex),
    index("story_results_room_code_idx").on(t.roomCode),
  ],
);

export const reflections = pgTable(
  "reflections",
  {
    id: serial("id").primaryKey(),
    roomCode: text("room_code").notNull().references(() => rooms.code, { onDelete: "cascade" }),
    round: integer("round").notNull(),
    team: text("team").notNull(),
    seat: integer("seat").notNull(),
    wentWell: text("went_well").notNull(),
    improvement: text("improvement").notNull(),
    exitAnswer: text("exit_answer").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.roomCode, t.round, t.team, t.seat),
    index("reflections_room_code_idx").on(t.roomCode),
  ],
);

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
