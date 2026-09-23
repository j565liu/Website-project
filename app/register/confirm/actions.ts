"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { confirmRegistration, type TokenStatus } from "@/lib/registration/service";
import { siteUrl } from "@/lib/site-url";

export type ConfirmState = { status?: TokenStatus; error?: string };

export async function confirmAction(_previous: ConfirmState, formData: FormData): Promise<ConfirmState> {
  let status: TokenStatus;
  try {
    status = await confirmRegistration(formData.get("token"), { db: getDb(), sendEmail, baseUrl: siteUrl() });
  } catch (error) {
    console.error("[register] Confirmation failed", error);
    return { error: "Something went wrong on our side. Please try again in a few minutes." };
  }
  if (status === "confirmed") redirect("/register/confirmed");
  return { status };
}
