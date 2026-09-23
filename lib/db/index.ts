import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { db?: Database };

export function createDb(url: string, options: postgres.Options<Record<string, never>> = {}) {
  // `prepare: false` keeps us compatible with transaction-mode poolers (Supabase, Neon, PgBouncer).
  const client = postgres(url, { max: 5, prepare: false, ...options });
  return drizzle(client, { schema });
}

// Created lazily so builds and pages that never touch the database don't need DATABASE_URL.
export function getDb(): Database {
  if (!globalForDb.db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    globalForDb.db = createDb(url);
  }
  return globalForDb.db;
}
