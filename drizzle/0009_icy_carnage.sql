ALTER TABLE "tasting_whiskeys" ALTER COLUMN "whiskey_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tasting_whiskeys" ALTER COLUMN "whiskey_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasting_whiskeys" ALTER COLUMN "tasting_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "tasting_whiskeys" ALTER COLUMN "tasting_id" DROP NOT NULL;