"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  INVITATION_COOKIE,
  INVITATION_MAX_AGE_SECONDS,
  invitationCookieValue,
  isValidInvitationCode,
  safeNextPath,
} from "@/lib/invitation";
import { clientIpFrom, consumeRateLimit, hashClientKey } from "@/lib/rate-limit";

export type InvitationState = { error?: string; code?: string };

const ATTEMPTS_PER_HOUR = 10;

export async function enterInvitationAction(_previous: InvitationState, formData: FormData): Promise<InvitationState> {
  const code = formData.get("code");
  if (typeof code !== "string" || !code.trim()) {
    return { error: "Please enter your invitation code." };
  }
  // Returned with every error so the field keeps what the guest typed.
  const typed = code.slice(0, 200);

  try {
    const allowed = await consumeRateLimit(
      getDb(),
      hashClientKey(`invitation:${clientIpFrom(await headers())}`),
      { limit: ATTEMPTS_PER_HOUR, windowMs: 60 * 60 * 1000 },
    );
    if (!allowed) return { error: "Too many attempts from your connection. Please try again in an hour.", code: typed };
  } catch (error) {
    // Without a working database the attempt limit can't be checked; let the code through
    // rather than lock every guest out of the events page.
    console.error("[invitation] Could not check the attempt limit", error);
  }

  const cookieValue = invitationCookieValue();
  if (!cookieValue) {
    // INVITATION_CODE or RATE_LIMIT_SECRET is missing from this deployment (logged above).
    return { error: "Invitations aren’t available on this site at the moment. Please try again later.", code: typed };
  }
  if (!isValidInvitationCode(code)) {
    return { error: "That code isn’t recognised. Please check your invitation and try again.", code: typed };
  }

  (await cookies()).set(INVITATION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: INVITATION_MAX_AGE_SECONDS,
  });
  redirect(safeNextPath(formData.get("next")));
}
