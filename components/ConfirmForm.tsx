"use client";

import Link from "next/link";
import { useActionState } from "react";
import { confirmAction, type ConfirmState } from "@/app/register/confirm/actions";

export function ConfirmForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ConfirmState, FormData>(confirmAction, {});

  if (state.status === "expired" || state.status === "invalid") {
    return (
      <p role="alert" className="text-ivory">
        This link can no longer be used.{" "}
        <Link href="/register" className="underline decoration-gold underline-offset-4">
          Register again
        </Link>{" "}
        to receive a fresh one.
      </p>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      {state.error && (
        <p role="alert" className="mb-8 border border-gold/60 bg-surface p-4 text-sm text-ivory">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="label border border-gold px-8 py-4 text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Confirming…" : "Confirm my email"}
      </button>
    </form>
  );
}
