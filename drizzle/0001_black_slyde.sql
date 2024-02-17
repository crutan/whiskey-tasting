CREATE TABLE IF NOT EXISTS "tastings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"host_id" varchar(32),
	"date" date,
	"false" boolean
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tastings" ADD CONSTRAINT "tastings_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
