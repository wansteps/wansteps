ALTER TABLE "user" RENAME COLUMN "phone" TO "phone_number";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_phone_unique";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number");