"use server";

import { getDb } from "@/lib/db";
import { deleteRegistration, stopEventEmails, type ManageOutcome } from "@/lib/registration/manage";

export type ManageState = { outcome?: ManageOutcome; error?: string };

export async function manageAction(_previous: ManageState, formData: FormData): Promise<ManageState> {
  const id = formData.get("id");
  const sig = formData.get("sig");
  try {
    const outcome =
      formData.get("intent") === "delete"
        ? await deleteRegistration(id, sig, getDb())
        : await stopEventEmails(id, sig, getDb());
    return { outcome };
  } catch (error) {
    console.error("[manage] Update failed", error);
    return { error: "Something went wrong on our side. Please try again in a few minutes." };
  }
}
