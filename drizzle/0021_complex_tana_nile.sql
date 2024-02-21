DO $$ BEGIN
 CREATE TYPE "tastingState" AS ENUM('setup', 'signup', 'started', 'finished');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "tastingState" "tastingState" DEFAULT 'setup';--> statement-breakpoint
ALTER TABLE "tastings" DROP COLUMN IF EXISTS "ready_for_signup";--> statement-breakpoint
ALTER TABLE "tastings" DROP COLUMN IF EXISTS "started";