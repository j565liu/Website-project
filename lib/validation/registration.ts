import { z } from "zod";

export const LIMITS = {
  preferredName: 80,
  email: 254,
  phone: 32,
} as const;

// Accepts common Canadian and international formats: 416-555-0123, (416) 555 0123, +1 416 555 0123.
const PHONE_CHARACTERS = /^\+?[0-9 ().-]+$/;

export const HONEYPOT_FIELD = "company_website";

export const registrationSchema = z.object({
  preferredName: z
    .string()
    .trim()
    .min(1, "Please tell us what you would like to be called.")
    .max(LIMITS.preferredName, `Please keep this under ${LIMITS.preferredName} characters.`),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(LIMITS.email, "That email address is too long.")
    .pipe(z.email("Please enter a valid email address, like name@example.com."))
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .max(LIMITS.phone, "That phone number is too long.")
    .refine(
      (value) => value === "" || (PHONE_CHARACTERS.test(value) && /^\d{7,15}$/.test(value.replace(/\D/g, ""))),
      "Please enter a phone number like 416-555-0123, or leave it blank.",
    )
    .optional()
    .transform((value) => value || undefined),
  consent: z.literal(true, "Please confirm you agree so we can store your registration."),
  eventEmails: z.boolean().default(false),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type Registration = z.output<typeof registrationSchema>;
export type RegistrationField = keyof RegistrationInput;
export type FieldErrors = Partial<Record<RegistrationField, string>>;

export function formDataToInput(formData: FormData): RegistrationInput {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };
  return {
    preferredName: text("preferredName"),
    email: text("email"),
    phone: text("phone"),
    consent: (formData.get("consent") === "on") as true,
    eventEmails: formData.get("eventEmails") === "on",
  };
}

export function validateRegistration(
  input: RegistrationInput,
): { success: true; data: Registration } | { success: false; errors: FieldErrors } {
  const result = registrationSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as RegistrationField;
    errors[field] ??= issue.message;
  }
  return { success: false, errors };
}
