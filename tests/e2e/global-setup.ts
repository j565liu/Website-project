import { rm } from "node:fs/promises";
import postgres from "postgres";
import migrateTestDatabase from "../unit/global-setup";
import { testDatabaseUrl } from "../unit/test-db";

export default async function setup() {
  await rm(".outbox/e2e", { recursive: true, force: true });
  await migrateTestDatabase();
  // Every run comes from the same address; start fresh so repeated runs don't hit the attempt limits.
  const sql = postgres(testDatabaseUrl(), { max: 1, onnotice: () => {} });
  await sql`delete from rate_limit_hits`;
  await sql.end();
}
