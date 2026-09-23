import type { RegistrationRow } from "@/lib/db/schema";
import { TIME_ZONE } from "@/lib/events";

export const exportStatuses = ["all", "confirmed", "unconfirmed"] as const;
export type ExportStatus = (typeof exportStatuses)[number];

const columns: { header: string; value: (row: RegistrationRow) => string | Date | null }[] = [
  { header: "Preferred name", value: (r) => r.preferredName },
  { header: "Email", value: (r) => r.email },
  { header: "Industry", value: (r) => r.industry },
  { header: "How they heard", value: (r) => r.howDidYouHear },
  { header: "Why they are interested", value: (r) => r.whyJoin },
  { header: "Status", value: (r) => (r.confirmedAt ? "Confirmed" : "Unconfirmed") },
  { header: "Registered (Toronto time)", value: (r) => r.createdAt },
  { header: "Confirmed (Toronto time)", value: (r) => r.confirmedAt },
  { header: "Consent given (Toronto time)", value: (r) => r.consentAcceptedAt },
];

// "sv-SE" formats as "2026-10-01 08:00", which spreadsheets recognise as a date and time.
const torontoTime = new Intl.DateTimeFormat("sv-SE", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function cell(value: string | Date | null): string {
  if (value === null) return "";
  let text = value instanceof Date ? torontoTime.format(value) : value;
  // Stop spreadsheet apps from running visitor-entered text as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: RegistrationRow[]): string {
  const lines = [columns.map((c) => c.header), ...rows.map((row) => columns.map((c) => cell(c.value(row))))];
  // The byte-order mark makes Excel read accented names correctly.
  return "﻿" + lines.map((line) => line.join(",")).join("\r\n") + "\r\n";
}
