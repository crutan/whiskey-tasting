ALTER TABLE "tasting_attendees" ALTER COLUMN "user_id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "tasting_attendees" ALTER COLUMN "user_id" DROP NOT NULL;