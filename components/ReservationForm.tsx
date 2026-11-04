"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { reserveAction, type ReserveState } from "@/app/events/[id]/actions";
import { HONEYPOT_FIELD, LIMITS } from "@/lib/validation/registration";

export function ReservationForm({ eventId }: { eventId: string }) {
  const [state, formAction, pending] = useActionState<ReserveState, FormData>(reserveAction, {});
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.formError) errorRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} noValidate aria-busy={pending} className="space-y-8">
      <input type="hidden" name="eventId" value={eventId} />
      {state.formError && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="border border-gold/60 bg-surface p-6 text-ivory focus:outline-none">
          {state.formError}
        </p>
      )}

      <div>
        <label htmlFor="email" className="text-base font-medium text-ivory">
          Email
        </label>
        <p id="email-hint" className="mt-2 text-sm text-muted">
          Use the address you registered with.
        </p>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          required
          defaultValue={state.email}
          key={state.email}
          aria-invalid={Boolean(state.emailError)}
          aria-describedby={state.emailError ? "email-hint email-error" : "email-hint"}
          className="mt-3 block w-full border border-charcoal bg-surface px-4 py-3.5 text-base text-ivory transition-colors duration-500 hover:border-muted/50 focus:border-gold focus:outline-none aria-[invalid=true]:border-gold"
        />
        {state.emailError && (
          <p id="email-error" role="alert" className="mt-3 text-sm text-ivory">
            <span aria-hidden="true" className="mr-2 text-gold">
              —
            </span>
            {state.emailError}
          </p>
        )}
      </div>

      {/* Hidden from people; bots that fill it in are quietly discarded. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="space-y-6">
        <button
          type="submit"
          disabled={pending}
          className="label w-full border border-gold px-8 py-4 text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Sending…" : "Reserve My Place"}
        </button>
        <p className="text-sm text-muted">
          Not registered yet?{" "}
          <Link href="/register" className="text-ivory underline decoration-gold underline-offset-4">
            Register first
          </Link>
          , then come back to reserve.
        </p>
      </div>
    </form>
  );
}
