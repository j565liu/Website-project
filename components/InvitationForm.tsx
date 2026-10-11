"use client";

import { useActionState } from "react";
import { enterInvitationAction, type InvitationState } from "@/app/invitation/actions";

export function InvitationForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<InvitationState, FormData>(enterInvitationAction, {});

  return (
    <form action={formAction} aria-busy={pending} className="space-y-10">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="code" className="text-base font-medium text-ivory">
          Invitation code
        </label>
        <p id="code-hint" className="mt-2 text-sm text-muted">
          Capital or small letters both work.
        </p>
        <input
          id="code"
          name="code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          required
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "code-hint code-error" : "code-hint"}
          className="mt-3 block w-full border border-charcoal bg-surface px-4 py-3.5 text-base tracking-widest text-ivory transition-colors duration-500 hover:border-muted/50 focus:border-gold focus:outline-none aria-[invalid=true]:border-gold"
        />
        <div role="alert">
          {state.error && (
            <p id="code-error" className="mt-3 text-sm text-ivory">
              <span aria-hidden="true" className="mr-2 text-gold">
                —
              </span>
              {state.error}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="label w-full border border-gold px-8 py-4 text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
