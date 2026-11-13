"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { manageAction, type ManageState } from "@/app/register/manage/actions";

type Props = {
  id: string;
  sig: string;
  eventEmails: boolean;
};

const buttonClass =
  "label border border-gold px-8 py-4 text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background disabled:cursor-wait disabled:opacity-60";
const quietButtonClass =
  "label border border-charcoal px-8 py-4 text-ivory transition-colors duration-500 ease-luxe hover:border-muted disabled:cursor-wait disabled:opacity-60";

export function ManageRegistration({ id, sig, eventEmails }: Props) {
  const [state, formAction, pending] = useActionState<ManageState, FormData>(manageAction, {});
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (state.outcome === "deleted") {
    return (
      <div role="status" className="space-y-4">
        <p className="text-ivory">Your details have been deleted.</p>
        <p>We no longer hold your registration. You are welcome to register again at any time.</p>
        <Link href="/" className="label inline-block py-3 text-ivory underline decoration-gold underline-offset-8">
          Return home
        </Link>
      </div>
    );
  }

  if (state.outcome === "invalid" || state.outcome === "missing") {
    return (
      <p role="alert" className="text-ivory">
        We couldn&rsquo;t find this registration. It may already have been removed.
      </p>
    );
  }

  const receivingEventEmails = state.outcome === "started" || (eventEmails && state.outcome !== "stopped");
  const hidden = (
    <>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="sig" value={sig} />
    </>
  );

  return (
    <div className="space-y-12">
      {state.error && (
        <p role="alert" className="border border-gold/60 bg-surface p-4 text-ivory">
          {state.error}
        </p>
      )}

      <section aria-labelledby="event-emails-heading" className="space-y-4">
        <h2 id="event-emails-heading" className="font-display text-3xl font-medium text-ivory">
          Invitations to gatherings
        </h2>
        {state.outcome === "stopped" && (
          <p role="status" className="text-ivory">
            Done. You won&rsquo;t receive invitations to gatherings.
          </p>
        )}
        {state.outcome === "started" && (
          <p role="status" className="text-ivory">
            Done. We will email you invitations to upcoming gatherings.
          </p>
        )}
        {receivingEventEmails ? (
          <>
            {state.outcome !== "started" && <p>You receive invitations to upcoming gatherings by email.</p>}
            <form action={formAction}>
              {hidden}
              <input type="hidden" name="intent" value="stop-emails" />
              <button type="submit" disabled={pending} className={buttonClass}>
                Stop invitations
              </button>
            </form>
          </>
        ) : (
          <>
            {state.outcome !== "stopped" && (
              <p>
                Invitations are sent by email only. You haven&rsquo;t asked for them, so you won&rsquo;t
                hear about upcoming gatherings.
              </p>
            )}
            <form action={formAction}>
              {hidden}
              <input type="hidden" name="intent" value="start-emails" />
              <button type="submit" disabled={pending} className={buttonClass}>
                Send me invitations
              </button>
            </form>
            <p className="text-sm">Every invitation includes a link to unsubscribe.</p>
          </>
        )}
      </section>

      <section aria-labelledby="delete-heading" className="space-y-4 border-t border-charcoal pt-12">
        <h2 id="delete-heading" className="font-display text-3xl font-medium text-ivory">
          Remove your details
        </h2>
        <p>This permanently deletes your registration, including your name, email and phone number.</p>
        {confirmingDelete ? (
          <form action={formAction} className="space-y-6">
            {hidden}
            <input type="hidden" name="intent" value="delete" />
            <p role="alert" className="text-ivory">
              Are you sure? This can&rsquo;t be undone.
            </p>
            <div className="flex flex-wrap gap-4">
              <button type="submit" disabled={pending} className={buttonClass}>
                {pending ? "Deleting…" : "Yes, delete my details"}
              </button>
              <button type="button" disabled={pending} onClick={() => setConfirmingDelete(false)} className={quietButtonClass}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setConfirmingDelete(true)} className={quietButtonClass}>
            Delete my registration
          </button>
        )}
      </section>
    </div>
  );
}
