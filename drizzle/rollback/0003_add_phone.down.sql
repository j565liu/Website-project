-- Reverses drizzle/0003_add_phone.sql. Stored phone numbers are lost.
ALTER TABLE "registrations" DROP COLUMN IF EXISTS "phone";
