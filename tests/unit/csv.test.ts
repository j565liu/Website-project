import { describe, expect, it } from "vitest";
import type { RegistrationRow } from "@/lib/db/schema";
import { toCsv } from "@/lib/registration/csv";

const row = (overrides: Partial<RegistrationRow> = {}): RegistrationRow => ({
  id: "00000000-0000-0000-0000-000000000000",
  preferredName: "Alex",
  email: "alex@example.com",
  industry: "Law",
  howDidYouHear: null,
  whyJoin: "Conversation.",
  consentAcceptedAt: new Date("2026-10-01T12:00:00Z"),
  confirmedAt: null,
  confirmationTokenHash: "hash",
  confirmationExpiresAt: new Date("2026-10-03T12:00:00Z"),
  createdAt: new Date("2026-10-01T12:00:00Z"),
  updatedAt: new Date("2026-10-01T12:00:00Z"),
  ...overrides,
});

const lines = (csv: string) => csv.replace(/^﻿/, "").trimEnd().split("\r\n");

describe("CSV export", () => {
  it("writes a header and one line per registration, in Toronto time, without token data", () => {
    const [header, first, second] = lines(
      toCsv([row(), row({ email: "b@example.com", confirmedAt: new Date("2026-10-02T01:30:00Z") })]),
    );
    expect(header).toBe(
      "Preferred name,Email,Industry,How they heard,Why they are interested,Status,Registered (Toronto time),Confirmed (Toronto time),Consent given (Toronto time)",
    );
    expect(first).toBe("Alex,alex@example.com,Law,,Conversation.,Unconfirmed,2026-10-01 08:00,,2026-10-01 08:00");
    expect(second).toContain("Confirmed,2026-10-01 08:00,2026-10-01 21:30,");
    expect(toCsv([row()])).not.toContain("hash");
  });

  it("quotes commas, quotes and line breaks", () => {
    const [, line] = lines(toCsv([row({ whyJoin: 'Good "food", better\ncompany' })]));
    expect(line).toContain('"Good ""food"", better\ncompany"');
  });

  it("neutralises spreadsheet formulas", () => {
    const [, line] = lines(toCsv([row({ preferredName: "=HYPERLINK(\"x\")", whyJoin: "+1 555" })]));
    expect(line).toContain(`"'=HYPERLINK(""x"")"`);
    expect(line).toContain("'+1 555");
  });

  it("starts with a byte-order mark so Excel reads accents", () => {
    expect(toCsv([row({ preferredName: "Zoë" })]).startsWith("﻿")).toBe(true);
  });
});
