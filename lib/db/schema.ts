import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const registrations = pgTable(
  "registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    preferredName: varchar("preferred_name", { length: 80 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    industry: varchar("industry", { length: 64 }).notNull(),
    howDidYouHear: varchar("how_did_you_hear", { length: 64 }),
    whyJoin: varchar("why_join", { length: 500 }).notNull(),
    consentAcceptedAt: timestamp("consent_accepted_at", { withTimezone: true }).notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    confirmationTokenHash: text("confirmation_token_hash").notNull(),
    confirmationExpiresAt: timestamp("confirmation_expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("registrations_email_lower_key").on(sql`lower(${table.email})`),
    uniqueIndex("registrations_confirmation_token_hash_key").on(table.confirmationTokenHash),
    index("registrations_confirmed_at_idx").on(table.confirmedAt),
    index("registrations_created_at_idx").on(table.createdAt),
  ],
);

// One row per counted form submission. `key_hash` is an HMAC of the visitor's IP,
// so raw addresses are never stored. Rows older than 24 hours are purged.
export const rateLimitHits = pgTable(
  "rate_limit_hits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    keyHash: text("key_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("rate_limit_hits_key_created_idx").on(table.keyHash, table.createdAt)],
);

export type RegistrationRow = typeof registrations.$inferSelect;
