-- Reverses drizzle/0004_age_group_gender.sql. Stored age groups and genders are lost.
ALTER TABLE "registrations" DROP COLUMN IF EXISTS "gender_description";
ALTER TABLE "registrations" DROP COLUMN IF EXISTS "gender";
ALTER TABLE "registrations" DROP COLUMN IF EXISTS "age_group";
