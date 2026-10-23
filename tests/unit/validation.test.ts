import { describe, expect, it } from "vitest";
import { formDataToInput, validateRegistration } from "@/lib/validation/registration";
import { formData, validFields } from "./helpers";

const validate = (overrides: Record<string, string> = {}, omit: string[] = []) => {
  const fields: Record<string, string> = { ...validFields, ...overrides };
  for (const key of omit) delete fields[key];
  return validateRegistration(formDataToInput(formData(fields)));
};

describe("registration schema", () => {
  it("accepts a complete registration and normalises it", () => {
    const result = validate({ preferredName: "  Alex  ", email: "  Alex.Morgan@Example.COM " });
    expect(result).toEqual({
      success: true,
      data: {
        preferredName: "Alex",
        email: "alex.morgan@example.com",
        phone: undefined,
        consent: true,
        eventEmails: false,
      },
    });
  });

  it.each([
    ["preferredName", { preferredName: "   " }],
    ["preferredName", { preferredName: "x".repeat(81) }],
    ["email", { email: "" }],
    ["email", { email: "not-an-email" }],
    ["email", { email: `${"a".repeat(250)}@example.com` }],
  ])("rejects an invalid %s", (field, overrides) => {
    const result = validate(overrides);
    expect(result.success).toBe(false);
    expect(!result.success && result.errors).toHaveProperty(field);
  });

  it("accepts a preferred name at exactly 80 characters", () => {
    expect(validate({ preferredName: "x".repeat(80) }).success).toBe(true);
  });

  it("ignores fields that are no longer collected", () => {
    const result = validate({ industry: "Law", whyJoin: "Conversation." });
    expect(result.success && Object.keys(result.data).sort()).toEqual(["consent", "email", "eventEmails", "phone", "preferredName"]);
  });

  it.each(["416-555-0123", "(416) 555 0123", "+1 416 555 0123", "4165550123", "+44 20 7946 0958"])(
    "accepts the phone number %s",
    (phone) => {
      const result = validate({ phone });
      expect(result.success && result.data.phone).toBe(phone);
    },
  );

  it("treats a blank phone number as not given", () => {
    const result = validate({ phone: "   " });
    expect(result.success && result.data.phone).toBeUndefined();
  });

  it.each(["call me", "555-12", "416-555-0123 ext 4", "1".repeat(16), "+1 416 555 0123".repeat(3)])(
    "rejects the phone number %s",
    (phone) => {
      const result = validate({ phone });
      expect(!result.success && result.errors.phone).toBeTruthy();
    },
  );

  it("treats the event emails box as optional", () => {
    const ticked = validate({ eventEmails: "on" });
    expect(ticked.success && ticked.data.eventEmails).toBe(true);
    const unticked = validate();
    expect(unticked.success && unticked.data.eventEmails).toBe(false);
  });

  it("requires consent", () => {
    const result = validate({}, ["consent"]);
    expect(!result.success && result.errors.consent).toMatch(/agree/);
  });

  it("reports one message per field", () => {
    const result = validate({ email: "", preferredName: "" });
    expect(!result.success && Object.keys(result.errors).sort()).toEqual(["email", "preferredName"]);
  });
});
