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

  const receivingEventEmails = eventEmails && state.outcome !== "stopped";
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
          Emails about gatherings
        </h2>
        {state.outcome === "stopped" ? (
          <p role="status" className="text-ivory">
            Done. You won&rsquo;t receive emails about gatherings.
          </p>
        ) : receivingEventEmails ? (
          <>
            <p>You have asked to hear about upcoming gatherings.</p>
            <form action={formAction}>
              {hidden}
              <input type="hidden" name="intent" value="stop-emails" />
              <button type="submit" disabled={pending} className={buttonClass}>
                Stop emails about gatherings
              </button>
            </form>
          </>
        ) : (
          <p>You won&rsquo;t receive emails about gatherings.</p>
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
