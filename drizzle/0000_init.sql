CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_key" text NOT NULL,
	"password_hash" text NOT NULL,
	"session_token" text,
	"progress" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_name_key_unique" UNIQUE("name_key"),
	CONSTRAINT "players_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" integer PRIMARY KEY NOT NULL,
	"topic" text NOT NULL,
	"type" text NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"current_answer" text NOT NULL,
	"reasoning" text NOT NULL,
	"complexity" integer,
	"bloom_level" text,
	"critical" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sprint_rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"selected_mission_id" text,
	"group_a_result" jsonb NOT NULL,
	"group_b_result" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
