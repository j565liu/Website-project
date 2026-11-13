import type { Metadata } from "next";
import { ReservationLinkButton } from "@/components/ReservationLinkButton";
import { StatusMessage } from "@/components/StatusMessage";
import { site } from "@/content/site";
import { getDb } from "@/lib/db";
import { formatEventDate, formatEventTime, getEventById } from "@/lib/events";
import { parseConfirmLink } from "@/lib/reservations/links";
import { getConfirmStatus, type ConfirmStatus } from "@/lib/reservations/service";

export const metadata: Metadata = {
  title: "Confirm your place",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

// A button, not the bare link, confirms the place, so email link scanners can't do it.
export default async function ConfirmReservationPage({ searchParams }: PageProps<"/reservations/confirm">) {
  const params = await searchParams;
  const link = parseConfirmLink(params);
  const event = getEventById(params.e);

  let status: ConfirmStatus | "error";
  try {
    status = await getConfirmStatus(link, event, { db: getDb() });
  } catch (error) {
    console.error("[reservations] Could not check confirmation link", error);
    status = "error";
  }

  if (status === "pending" && link && event) {
    return (
      <StatusMessage label="One last step" title="Confirm your place.">
        <p>
          {event.title}, {formatEventDate(event.startsAt)} at {formatEventTime(event.startsAt)}. Press
          the button below to reserve your place.
        </p>
        <div className="pt-6">
          <ReservationLinkButton
            intent="confirm"
            params={{ e: link.eventId, r: link.registrationId, x: String(link.expiresAt.getTime()), sig: params.sig as string }}
          />
        </div>
      </StatusMessage>
    );
  }

  switch (status) {
    case "reserved":
      return (
        <StatusMessage label="Confirmed" title="You already have a place." link={site.eventsPublished ? { href: "/events", label: "All gatherings" } : { href: "/", label: "Return home" }}>
          <p>Your place at {event?.title} is confirmed. There is nothing more to do.</p>
        </StatusMessage>
      );
    case "expired":
      return (
        <StatusMessage label="Link expired" title="This link has expired." link={{ href: `/events/${event?.id}`, label: "Ask again" }}>
          <p>Reservation links last 48 hours. Ask for your place again and we will send you a fresh one.</p>
        </StatusMessage>
      );
    case "past":
      return (
        <StatusMessage label="Reservations closed" title="This evening has passed." link={site.eventsPublished ? { href: "/events", label: "All gatherings" } : { href: "/", label: "Return home" }}>
          <p>Reservations for {event?.title} have closed.</p>
        </StatusMessage>
      );
    case "error":
      return (
        <StatusMessage label="Please try again" title="Something went wrong." link={{ href: "/", label: "Return home" }}>
          <p>We couldn&rsquo;t check your link just now. Please try again in a few minutes.</p>
        </StatusMessage>
      );
    default:
      return (
        <StatusMessage label="Link not recognised" title="We couldn’t find that link." link={site.eventsPublished ? { href: "/events", label: "All gatherings" } : { href: "/", label: "Return home" }}>
          <p>The link may be incomplete. Please use the most recent email we sent, or ask for your place again.</p>
        </StatusMessage>
      );
  }
}
