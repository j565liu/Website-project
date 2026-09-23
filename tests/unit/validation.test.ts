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
        industry: "Law",
        howDidYouHear: "LinkedIn",
        whyJoin: "I would love more evenings of real conversation.",
        consent: true,
      },
    });
  });

  it("treats an empty 'how did you hear' as not provided", () => {
    const result = validate({ howDidYouHear: "" });
    expect(result.success && result.data.howDidYouHear).toBeUndefined();
  });

  it.each([
    ["preferredName", { preferredName: "   " }],
    ["preferredName", { preferredName: "x".repeat(81) }],
    ["email", { email: "" }],
    ["email", { email: "not-an-email" }],
    ["email", { email: `${"a".repeat(250)}@example.com` }],
    ["industry", { industry: "" }],
    ["industry", { industry: "Astronaut" }],
    ["howDidYouHear", { howDidYouHear: "A billboard" }],
    ["whyJoin", { whyJoin: "" }],
    ["whyJoin", { whyJoin: "x".repeat(501) }],
  ])("rejects an invalid %s", (field, overrides) => {
    const result = validate(overrides);
    expect(result.success).toBe(false);
    expect(!result.success && result.errors).toHaveProperty(field);
  });

  it("accepts why_join at exactly 500 characters", () => {
    expect(validate({ whyJoin: "x".repeat(500) }).success).toBe(true);
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
