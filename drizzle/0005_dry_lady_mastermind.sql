CREATE TABLE IF NOT EXISTS "tastings_whiskeys" (
	"tasting_id" uuid NOT NULL,
	"whiskey_id" uuid NOT NULL,
	CONSTRAINT "tastings_whiskeys_tasting_id_whiskey_id_pk" PRIMARY KEY("tasting_id","whiskey_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "whiskeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"age_statement" varchar,
	"distillery" varchar NOT NULL,
	"abv" integer DEFAULT 0,
	"msrp" numeric(4, 2),
	"mash_bill" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tastings_whiskeys" ADD CONSTRAINT "tastings_whiskeys_tasting_id_tastings_id_fk" FOREIGN KEY ("tasting_id") REFERENCES "tastings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tastings_whiskeys" ADD CONSTRAINT "tastings_whiskeys_whiskey_id_whiskeys_id_fk" FOREIGN KEY ("whiskey_id") REFERENCES "whiskeys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
