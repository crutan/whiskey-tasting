ALTER TABLE "tasting_whiskeys" ALTER COLUMN "whiskey_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasting_whiskeys" ALTER COLUMN "tasting_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "whiskeys" ALTER COLUMN "msrp" SET DATA TYPE numeric(6, 2);