ALTER TABLE "whiskeys" ALTER COLUMN "abv" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "whiskeys" ALTER COLUMN "abv" DROP DEFAULT;