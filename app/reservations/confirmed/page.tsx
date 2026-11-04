import type { Metadata } from "next";
import { StatusMessage } from "@/components/StatusMessage";
import { formatEventDate, formatEventTime, getEventById } from "@/lib/events";

export const metadata: Metadata = {
  title: "You’re on the list",
  robots: { index: false, follow: false },
};

export default async function ReservationConfirmedPage({ searchParams }: PageProps<"/reservations/confirmed">) {
  const event = getEventById((await searchParams).e);
  return (
    <StatusMessage label="Confirmed" title="You’re on the list." link={{ href: "/events", label: "All gatherings" }}>
      {event && (
        <p>
          Your place at {event.title} on {formatEventDate(event.startsAt)} at{" "}
          {formatEventTime(event.startsAt)} is confirmed.
        </p>
      )}
      <p>
        We have sent you an email to keep. We will share the location and any details before the
        evening. If your plans change, the email has a link to cancel.
      </p>
    </StatusMessage>
  );
}
