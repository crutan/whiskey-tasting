CREATE TABLE IF NOT EXISTS "tasting_attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tasting_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "started" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasting_attendees" ADD CONSTRAINT "tasting_attendees_tasting_id_tastings_id_fk" FOREIGN KEY ("tasting_id") REFERENCES "tastings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasting_attendees" ADD CONSTRAINT "tasting_attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
