CREATE TABLE IF NOT EXISTS "tasting_whiskeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whiskey_id" uuid NOT NULL,
	"tasting_id" uuid NOT NULL,
	"position" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasting_whiskeys" ADD CONSTRAINT "tasting_whiskeys_whiskey_id_whiskeys_id_fk" FOREIGN KEY ("whiskey_id") REFERENCES "whiskeys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasting_whiskeys" ADD CONSTRAINT "tasting_whiskeys_tasting_id_tastings_id_fk" FOREIGN KEY ("tasting_id") REFERENCES "tastings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
