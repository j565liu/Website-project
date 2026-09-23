import { createHmac } from "node:crypto";
import { and, count, eq, gte, lt } from "drizzle-orm";
import type { Database } from "./db";
import { rateLimitHits } from "./db/schema";

const RETENTION_MS = 24 * 60 * 60 * 1000;

export function hashClientKey(ip: string): string {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET is not set");
  return createHmac("sha256", secret).update(ip).digest("hex");
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

export async function consumeRateLimit(
  db: Database,
  keyHash: string,
  { limit, windowMs, now = new Date() }: { limit: number; windowMs: number; now?: Date },
): Promise<boolean> {
  await db.delete(rateLimitHits).where(lt(rateLimitHits.createdAt, new Date(now.getTime() - RETENTION_MS)));

  const [{ hits }] = await db
    .select({ hits: count() })
    .from(rateLimitHits)
    .where(
      and(
        eq(rateLimitHits.keyHash, keyHash),
        gte(rateLimitHits.createdAt, new Date(now.getTime() - windowMs)),
      ),
    );
  if (hits >= limit) return false;

  await db.insert(rateLimitHits).values({ keyHash, createdAt: now });
  return true;
}
