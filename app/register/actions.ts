"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { clientIpFrom, hashClientKey } from "@/lib/rate-limit";
import { handleSubmission, type SubmissionResult } from "@/lib/registration/service";
import { siteUrl } from "@/lib/site-url";
import type { FieldErrors } from "@/lib/validation/registration";

export type RegisterState = {
  errors?: FieldErrors;
  formError?: string;
};

export async function registerAction(_previous: RegisterState, formData: FormData): Promise<RegisterState> {
  let result: SubmissionResult;
  try {
    result = await handleSubmission(formData, {
      db: getDb(),
      sendEmail,
      baseUrl: siteUrl(),
      clientKeyHash: hashClientKey(clientIpFrom(await headers())),
      rateLimit: { limit: Number(process.env.RATE_LIMIT_MAX || 5), windowMs: 60 * 60 * 1000 },
    });
  } catch (error) {
    console.error("[register] Submission failed", error);
    return { formError: "Something went wrong on our side. Please try again in a few minutes." };
  }

  if (result.kind === "invalid") {
    return { errors: result.errors, formError: "Please review the fields below." };
  }
  if (result.kind === "rate_limited") {
    return {
      formError: "We have received several registrations from your connection. Please try again in an hour.",
    };
  }
  redirect("/register/check-email");
}
