CREATE TABLE "room_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_code" text NOT NULL,
	"player_id" text NOT NULL,
	"team" text NOT NULL,
	"seat" integer NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "room_members_room_code_player_id_unique" UNIQUE("room_code","player_id")
);
--> statement-breakpoint
ALTER TABLE "reflections" DROP CONSTRAINT "reflections_room_code_round_team_seat_unique";--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "role" text DEFAULT 'student' NOT NULL;--> statement-breakpoint
ALTER TABLE "reflections" ADD COLUMN "player_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_room_code_rooms_code_fk" FOREIGN KEY ("room_code") REFERENCES "public"."rooms"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "room_members_room_code_idx" ON "room_members" USING btree ("room_code");--> statement-breakpoint
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "teacher_token";--> statement-breakpoint
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_room_code_round_player_id_unique" UNIQUE("room_code","round","player_id");--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_owner_id_players_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
