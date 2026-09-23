import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";

loadEnvConfig(process.cwd());

type JournalEntry = { idx: number; tag: string; when: number };

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const drizzleDir = path.join(process.cwd(), "drizzle");
  const journal = JSON.parse(
    readFileSync(path.join(drizzleDir, "meta", "_journal.json"), "utf8"),
  ) as { entries: JournalEntry[] };

  const sql = postgres(url, { max: 1, onnotice: () => {} });
  try {
    const [latest] = await sql<{ id: number; created_at: string }[]>`
      select id, created_at from drizzle.__drizzle_migrations order by created_at desc limit 1
    `.catch((error: { code?: string }) => {
      // 42P01: the migrations table doesn't exist yet, so nothing has been applied.
      if (error.code === "42P01") return [];
      throw error;
    });
    if (!latest) {
      console.log("No applied migrations to roll back.");
      return;
    }

    // drizzle-kit records each migration by its journal timestamp.
    const entry = journal.entries.find((e) => String(e.when) === String(latest.created_at));
    if (!entry) throw new Error(`Applied migration ${latest.created_at} is not in the journal`);

    const downFile = path.join(drizzleDir, "rollback", `${entry.tag}.down.sql`);
    if (!existsSync(downFile)) throw new Error(`Missing rollback file: ${downFile}`);

    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(downFile, "utf8"));
      await tx`delete from drizzle.__drizzle_migrations where id = ${latest.id}`;
    });
    console.log(`Rolled back ${entry.tag}`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
