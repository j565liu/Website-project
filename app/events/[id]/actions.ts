"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { getEventById, hasStarted } from "@/lib/events";
import { hasInvitation, INVITATION_COOKIE } from "@/lib/invitation";
import { clientIpFrom, consumeRateLimit, hashClientKey } from "@/lib/rate-limit";
import { requestReservation } from "@/lib/reservations/service";
import { siteUrl } from "@/lib/site-url";
import { emailSchema, HONEYPOT_FIELD } from "@/lib/validation/registration";

export type ReserveState = { email?: string; emailError?: string; formError?: string };

export async function reserveAction(_previous: ReserveState, formData: FormData): Promise<ReserveState> {
  // Server Actions can be called directly, so the proxy's invitation check is repeated here.
  if (!hasInvitation((await cookies()).get(INVITATION_COOKIE)?.value)) {
    return { formError: "Your invitation code has expired on this device. Please reload the page and enter it again." };
  }

  // Bots that fill the hidden field get the normal success page so they learn nothing.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") redirect("/reservations/check-email");

  const event = getEventById(formData.get("eventId"));
  if (!event || hasStarted(event)) {
    return { formError: "This gathering is no longer taking reservations." };
  }

  const rawEmail = formData.get("email");
  const typed = typeof rawEmail === "string" ? rawEmail.slice(0, 300) : "";
  const email = emailSchema.safeParse(typed);
  if (!email.success) return { email: typed, emailError: email.error.issues[0].message };

  try {
    const db = getDb();
    const allowed = await consumeRateLimit(db, hashClientKey(`reserve:${clientIpFrom(await headers())}`), {
      limit: Number(process.env.RATE_LIMIT_MAX || 5),
      windowMs: 60 * 60 * 1000,
    });
    if (!allowed) {
      return { email: typed, formError: "We have received several requests from your connection. Please try again in an hour." };
    }
    await requestReservation(event, email.data, { db, sendEmail, baseUrl: siteUrl() });
  } catch (error) {
    console.error("[reservations] Request failed", error);
    return { email: typed, formError: "Something went wrong on our side. Please try again in a few minutes." };
  }
  redirect("/reservations/check-email");
}
