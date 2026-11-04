"use client";

import { useActionState } from "react";
import {
  cancelReservationAction,
  confirmReservationAction,
  type ReservationLinkState,
} from "@/app/reservations/actions";

type Props = {
  intent: "confirm" | "cancel";
  params: { e: string; r: string; x?: string; sig: string };
};

const outcomes: Partial<Record<NonNullable<ReservationLinkState["status"]>, string>> = {
  cancelled: "Your place has been cancelled. Thank you for letting us know.",
  expired: "This link has expired. Please ask for your place again from the gathering's page.",
  past: "This gathering has already taken place.",
  invalid: "This link can no longer be used.",
};

export function ReservationLinkButton({ intent, params }: Props) {
  const action = intent === "confirm" ? confirmReservationAction : cancelReservationAction;
  const [state, formAction, pending] = useActionState<ReservationLinkState, FormData>(action, {});

  const outcome = state.status && outcomes[state.status];
  if (outcome) {
    return (
      <p role="status" className="text-ivory">
        {outcome}
      </p>
    );
  }

  return (
    <form action={formAction}>
      {Object.entries(params).map(([name, value]) =>
        value === undefined ? null : <input key={name} type="hidden" name={name} value={value} />,
      )}
      {state.error && (
        <p role="alert" className="mb-8 border border-gold/60 bg-surface p-4 text-sm text-ivory">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="label border border-gold px-8 py-4 text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background disabled:cursor-wait disabled:opacity-60"
      >
        {intent === "confirm" ? (pending ? "Confirming…" : "Confirm my place") : pending ? "Cancelling…" : "Cancel my place"}
      </button>
    </form>
  );
}
