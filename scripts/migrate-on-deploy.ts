import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Runs before `next build` on Vercel so the database matches the code before it goes live.
// Preview deployments share the production database, so only production builds migrate it.
async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log(`[migrate] Skipped (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}); only production deployments migrate.`);
    return;
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  // `prepare: false` keeps this working through transaction-mode poolers, as in lib/db.
  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
  try {
    await migrate(drizzle(sql), { migrationsFolder: "drizzle" });
    console.log("[migrate] Database is up to date.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("[migrate] Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
