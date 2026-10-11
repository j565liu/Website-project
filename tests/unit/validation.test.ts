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
        consent: true,
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
    expect(result.success && Object.keys(result.data).sort()).toEqual(["consent", "email", "preferredName"]);
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
