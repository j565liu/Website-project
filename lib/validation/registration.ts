import { z } from "zod";

export const LIMITS = {
  preferredName: 80,
  email: 254,
  phone: 32,
  genderDescription: 60,
} as const;

export const AGE_GROUPS = [
  { value: "millennials", label: "Millennials (Gen Y): Ages 30–45" },
  { value: "gen_x", label: "Generation X (Gen X): Ages 46–61" },
  { value: "baby_boomers", label: "Baby Boomers: Ages 62–80" },
] as const;

export const GENDERS = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "self_described", label: "Prefer to self-describe" },
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number]["value"];
export type Gender = (typeof GENDERS)[number]["value"];

const values = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [T[number]["value"], ...T[number]["value"][]];

export function ageGroupLabel(value: string | null): string {
  return AGE_GROUPS.find((option) => option.value === value)?.label ?? "Not given";
}

export function genderLabel(value: string | null, description: string | null): string {
  if (value === "self_described" && description) return description;
  return GENDERS.find((option) => option.value === value)?.label ?? "Not given";
}

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
  ageGroup: z.enum(values(AGE_GROUPS), "Please choose your age group."),
  gender: z.enum(values(GENDERS), "Please choose how you describe your gender."),
  genderDescription: z
    .string()
    .trim()
    .max(LIMITS.genderDescription, `Please keep this under ${LIMITS.genderDescription} characters.`)
    .optional(),
  consent: z.literal(true, "Please confirm you agree so we can store your registration."),
  eventEmails: z.boolean().default(false),
})
  .refine((data) => data.gender !== "self_described" || Boolean(data.genderDescription), {
    path: ["genderDescription"],
    message: "Please describe your gender in a word or two.",
    // Check this even when other fields are invalid, so every error shows at once.
    when: (payload) =>
      !payload.issues.some((issue) => issue.path?.[0] === "gender" || issue.path?.[0] === "genderDescription"),
  })
  .transform(({ genderDescription, ...data }) => ({
    ...data,
    // Only kept for "Prefer to self-describe", so a stale entry never outlives a changed choice.
    genderDescription: data.gender === "self_described" ? genderDescription : undefined,
  }));

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
    ageGroup: text("ageGroup") as RegistrationInput["ageGroup"],
    gender: text("gender") as RegistrationInput["gender"],
    genderDescription: text("genderDescription"),
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
