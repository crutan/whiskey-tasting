CREATE TABLE IF NOT EXISTS "user_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(32),
	"tasting_id" uuid NOT NULL,
	"tastingWhiskeyId" uuid NOT NULL,
	"flight" integer DEFAULT 1 NOT NULL,
	"rating" numeric(2, 2),
	"tasting_notes" text,
	"nosing_notes" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_tasting_id_tastings_id_fk" FOREIGN KEY ("tasting_id") REFERENCES "tastings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_tastingWhiskeyId_tasting_whiskeys_id_fk" FOREIGN KEY ("tastingWhiskeyId") REFERENCES "tasting_whiskeys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
