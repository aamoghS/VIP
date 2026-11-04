CREATE TABLE "reflections" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_code" text NOT NULL,
	"round" integer NOT NULL,
	"team" text NOT NULL,
	"seat" integer NOT NULL,
	"went_well" text NOT NULL,
	"improvement" text NOT NULL,
	"exit_answer" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reflections_room_code_round_team_seat_unique" UNIQUE("room_code","round","team","seat")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"code" text PRIMARY KEY NOT NULL,
	"class_name" text NOT NULL,
	"teacher_token" text NOT NULL,
	"mission_id" text,
	"state" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_code" text NOT NULL,
	"round" integer NOT NULL,
	"team" text NOT NULL,
	"story_index" integer NOT NULL,
	"mission_id" text NOT NULL,
	"topic" text NOT NULL,
	"objective" integer NOT NULL,
	"points" integer NOT NULL,
	"correct" boolean NOT NULL,
	"answer" text NOT NULL,
	"reason" text NOT NULL,
	"trace" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_results_room_code_round_team_story_index_unique" UNIQUE("room_code","round","team","story_index")
);
--> statement-breakpoint
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "public"."rooms"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_results" ADD CONSTRAINT "story_results_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "public"."rooms"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reflections_room_code_idx" ON "reflections" USING btree ("room_code");--> statement-breakpoint
CREATE INDEX "story_results_room_code_idx" ON "story_results" USING btree ("room_code");
--> statement-breakpoint
DROP TABLE "sprint_rooms" CASCADE;
