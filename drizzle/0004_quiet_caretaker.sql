ALTER TABLE "tastings" RENAME COLUMN "false" TO "blind";--> statement-breakpoint
ALTER TABLE "tastings" ALTER COLUMN "blind" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "ready_for_signup" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "tastings" DROP COLUMN IF EXISTS "favorite_whiskey";