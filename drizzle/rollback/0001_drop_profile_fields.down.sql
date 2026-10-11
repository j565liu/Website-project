-- Reverses drizzle/0001_drop_profile_fields.sql. The dropped values cannot be recovered:
-- existing rows get empty strings for the two required columns, then the defaults are removed
-- so the columns match drizzle/0000_init.sql again.
ALTER TABLE "registrations" ADD COLUMN "industry" varchar(64) NOT NULL DEFAULT '';
ALTER TABLE "registrations" ADD COLUMN "how_did_you_hear" varchar(64);
ALTER TABLE "registrations" ADD COLUMN "why_join" varchar(500) NOT NULL DEFAULT '';
ALTER TABLE "registrations" ALTER COLUMN "industry" DROP DEFAULT;
ALTER TABLE "registrations" ALTER COLUMN "why_join" DROP DEFAULT;
