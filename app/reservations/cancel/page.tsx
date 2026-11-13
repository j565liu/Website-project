import type { Metadata } from "next";
import { ReservationLinkButton } from "@/components/ReservationLinkButton";
import { StatusMessage } from "@/components/StatusMessage";
import { site } from "@/content/site";
import { getDb } from "@/lib/db";
import { formatEventDate, formatEventTime, getEventById } from "@/lib/events";
import { parseCancelLink } from "@/lib/reservations/links";
import { getCancelStatus, type CancelStatus } from "@/lib/reservations/service";

export const metadata: Metadata = {
  title: "Cancel your place",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function CancelReservationPage({ searchParams }: PageProps<"/reservations/cancel">) {
  const params = await searchParams;
  const link = parseCancelLink(params);
  const event = getEventById(params.e);

  let status: CancelStatus | "error";
  try {
    status = await getCancelStatus(link, event, { db: getDb() });
  } catch (error) {
    console.error("[reservations] Could not check cancellation link", error);
    status = "error";
  }

  if (status === "active" && link && event) {
    return (
      <StatusMessage label="Your place" title="Cancel your place?">
        <p>
          {event.title}, {formatEventDate(event.startsAt)} at {formatEventTime(event.startsAt)}. If you
          can no longer come, press the button below and we will offer your place to another guest.
        </p>
        <div className="pt-6">
          <ReservationLinkButton intent="cancel" params={{ e: link.eventId, r: link.registrationId, sig: params.sig as string }} />
        </div>
      </StatusMessage>
    );
  }

  switch (status) {
    case "cancelled":
      return (
        <StatusMessage label="Cancelled" title="Your place is cancelled." link={{ href: `/events/${event?.id}`, label: "Reserve again" }}>
          <p>You no longer have a place at {event?.title}. If your plans change again, you can reserve from its page.</p>
        </StatusMessage>
      );
    case "past":
      return (
        <StatusMessage label="Reservations closed" title="This evening has passed." link={site.eventsPublished ? { href: "/events", label: "All gatherings" } : { href: "/", label: "Return home" }}>
          <p>{event?.title} has already taken place.</p>
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
          <p>The link may be incomplete. Please use the link in the most recent email we sent.</p>
        </StatusMessage>
      );
  }
}
