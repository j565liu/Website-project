import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { asc, isNotNull, isNull } from "drizzle-orm";
import { createDb } from "@/lib/db";
import { registrations } from "@/lib/db/schema";
import { exportStatuses, toCsv, type ExportStatus } from "@/lib/registration/csv";

loadEnvConfig(process.cwd());

function parseStatus(): ExportStatus {
  const arg = process.argv.slice(2).find((a) => a.startsWith("--status="));
  const status = (arg?.split("=")[1] ?? "all") as ExportStatus;
  if (!exportStatuses.includes(status)) {
    console.error(`Unknown status "${status}". Use one of: ${exportStatuses.join(", ")}`);
    process.exit(1);
  }
  return status;
}

async function main() {
  const status = parseStatus();
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const db = createDb(url, { max: 1 });

  try {
    const filter =
      status === "confirmed"
        ? isNotNull(registrations.confirmedAt)
        : status === "unconfirmed"
          ? isNull(registrations.confirmedAt)
          : undefined;
    const rows = await db.select().from(registrations).where(filter).orderBy(asc(registrations.createdAt));

    const date = new Date().toISOString().slice(0, 10);
    const dir = path.join(process.cwd(), "exports");
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `registrations-${status}-${date}.csv`);
    writeFileSync(file, toCsv(rows));
    console.log(`Exported ${rows.length} ${status === "all" ? "" : `${status} `}registration(s) to ${path.relative(process.cwd(), file)}`);
  } finally {
    await db.$client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
