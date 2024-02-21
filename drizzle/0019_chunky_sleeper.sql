ALTER TABLE "user_ratings" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_ratings" ADD COLUMN "whiskey_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_whiskey_id_whiskeys_id_fk" FOREIGN KEY ("whiskey_id") REFERENCES "whiskeys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
