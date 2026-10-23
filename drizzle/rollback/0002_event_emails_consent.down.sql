-- Reverses drizzle/0002_event_emails_consent.sql. Event email choices are lost.
ALTER TABLE "registrations" DROP COLUMN IF EXISTS "event_emails_consent_at";
