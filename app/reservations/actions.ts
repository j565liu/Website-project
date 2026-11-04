"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { getEventById } from "@/lib/events";
import { parseCancelLink, parseConfirmLink } from "@/lib/reservations/links";
import { cancelReservation, confirmReservation, type CancelStatus, type ConfirmStatus } from "@/lib/reservations/service";
import { siteUrl } from "@/lib/site-url";

export type ReservationLinkState = { status?: ConfirmStatus | CancelStatus; error?: string };

function linkParams(formData: FormData) {
  const read = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : undefined;
  };
  return { e: read("e"), r: read("r"), x: read("x"), sig: read("sig") };
}

function deps() {
  return { db: getDb(), sendEmail, baseUrl: siteUrl(), notifyEmail: process.env.REGISTRATION_NOTIFY_EMAIL };
}

export async function confirmReservationAction(
  _previous: ReservationLinkState,
  formData: FormData,
): Promise<ReservationLinkState> {
  const params = linkParams(formData);
  let status: ConfirmStatus;
  try {
    status = await confirmReservation(parseConfirmLink(params), getEventById(params.e), deps());
  } catch (error) {
    console.error("[reservations] Confirmation failed", error);
    return { error: "Something went wrong on our side. Please try again in a few minutes." };
  }
  if (status === "reserved") redirect(`/reservations/confirmed?e=${encodeURIComponent(params.e ?? "")}`);
  return { status };
}

export async function cancelReservationAction(
  _previous: ReservationLinkState,
  formData: FormData,
): Promise<ReservationLinkState> {
  const params = linkParams(formData);
  try {
    return { status: await cancelReservation(parseCancelLink(params), getEventById(params.e), deps()) };
  } catch (error) {
    console.error("[reservations] Cancellation failed", error);
    return { error: "Something went wrong on our side. Please try again in a few minutes." };
  }
}
