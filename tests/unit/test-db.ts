import { existsSync } from "node:fs";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
// Next skips .env.local when NODE_ENV is "test", so load it here for local runs.
if (!process.env.DATABASE_URL && !process.env.TEST_DATABASE_URL && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

// Tests never touch the development database: they use a sibling database with a `_test` suffix.
export function testDatabaseUrl(): string {
  if (process.env.TEST_DATABASE_URL) return process.env.TEST_DATABASE_URL;
  const base = process.env.DATABASE_URL;
  if (!base) throw new Error("Set DATABASE_URL or TEST_DATABASE_URL to run the tests");
  const url = new URL(base);
  url.pathname = `${url.pathname.replace(/^\//, "")}_test`;
  return url.toString();
}
