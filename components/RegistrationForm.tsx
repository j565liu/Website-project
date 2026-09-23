"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { registerAction, type RegisterState } from "@/app/register/actions";
import { industries, referralSources } from "@/content/registration";
import { site } from "@/content/site";
import {
  HONEYPOT_FIELD,
  LIMITS,
  validateRegistration,
  type FieldErrors,
  type RegistrationField,
} from "@/lib/validation/registration";

type Values = {
  preferredName: string;
  email: string;
  industry: string;
  howDidYouHear: string;
  whyJoin: string;
  consent: boolean;
};

const initialValues: Values = {
  preferredName: "",
  email: "",
  industry: "",
  howDidYouHear: "",
  whyJoin: "",
  consent: false,
};

const fieldOrder: RegistrationField[] = [
  "preferredName",
  "email",
  "industry",
  "howDidYouHear",
  "whyJoin",
  "consent",
];

const fieldLabels: Record<RegistrationField, string> = {
  preferredName: "Preferred name",
  email: "Email",
  industry: "Industry",
  howDidYouHear: "How did you hear about us",
  whyJoin: "Why you are interested",
  consent: "Consent",
};

const inputClass =
  "mt-3 block w-full border border-charcoal bg-surface px-4 py-3.5 text-base text-ivory transition-colors duration-500 placeholder:text-muted/60 hover:border-muted/50 focus:border-gold focus:outline-none aria-[invalid=true]:border-gold";

function validateValues(values: Values): FieldErrors {
  const result = validateRegistration({
    ...values,
    industry: values.industry as (typeof industries)[number],
    howDidYouHear: values.howDidYouHear as (typeof referralSources)[number] | "",
    consent: values.consent as true,
  });
  return result.success ? {} : result.errors;
}

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(registerAction, {});
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Show errors that came back from the server (the source of truth).
  useEffect(() => {
    if (!state.formError) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing server response into local state
    setErrors(state.errors ?? {});
    setSummary(state.formError);
    summaryRef.current?.focus();
  }, [state]);

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Clear an error as soon as the field becomes valid, but don't add new errors while typing.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateValues(next)[field] }));
    }
  }

  function validateField(field: RegistrationField) {
    const message = validateValues(values)[field];
    setErrors((current) => ({ ...current, [field]: message }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const clientErrors = validateValues(values);
    const firstInvalid = fieldOrder.find((field) => clientErrors[field]);

    if (firstInvalid) {
      setErrors(clientErrors);
      setSummary("Please review the fields below.");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setSummary(null);
    // Dispatching manually (instead of letting the form submit) keeps the visitor's answers
    // on screen if the server sends back an error.
    startTransition(() => formAction(new FormData(form)));
  }

  const invalidFields = fieldOrder.filter((field) => errors[field]);
  const describedBy = (field: RegistrationField, extra?: string) =>
    [extra, errors[field] ? `${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate aria-busy={pending} className="space-y-10">
      <div ref={summaryRef} tabIndex={-1} role="alert" className="focus:outline-none">
        {summary && (
          <div className="border border-gold/60 bg-surface p-6">
            <p className="text-ivory">{summary}</p>
            {invalidFields.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm">
                {invalidFields.map((field) => (
                  <li key={field}>
                    <a href={`#${field}`} className="text-muted underline decoration-gold underline-offset-4 hover:text-ivory">
                      {fieldLabels[field]}: {errors[field]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="preferredName" className="label text-ivory">
          Preferred name
        </label>
        <p id="preferredName-hint" className="mt-2 text-sm text-muted">
          What you would like us to call you.
        </p>
        <input
          id="preferredName"
          name="preferredName"
          type="text"
          autoComplete="given-name"
          maxLength={LIMITS.preferredName}
          required
          value={values.preferredName}
          onChange={(e) => update("preferredName", e.target.value)}
          onBlur={() => validateField("preferredName")}
          aria-invalid={Boolean(errors.preferredName)}
          aria-describedby={describedBy("preferredName", "preferredName-hint")}
          className={inputClass}
        />
        <FieldError field="preferredName" message={errors.preferredName} />
      </div>

      <div>
        <label htmlFor="email" className="label text-ivory">
          Email
        </label>
        <p id="email-hint" className="mt-2 text-sm text-muted">
          We will send a link to this address to confirm it.
        </p>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          required
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => validateField("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email", "email-hint")}
          className={inputClass}
        />
        <FieldError field="email" message={errors.email} />
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label htmlFor="industry" className="label text-ivory">
            Industry
          </label>
          <SelectShell>
            <select
              id="industry"
              name="industry"
              required
              value={values.industry}
              onChange={(e) => update("industry", e.target.value)}
              onBlur={() => validateField("industry")}
              aria-invalid={Boolean(errors.industry)}
              aria-describedby={describedBy("industry")}
              className={`${inputClass} appearance-none pr-12`}
            >
              <option value="" disabled>
                Select your industry
              </option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </SelectShell>
          <FieldError field="industry" message={errors.industry} />
        </div>

        <div>
          <label htmlFor="howDidYouHear" className="label text-ivory">
            How did you hear about us <span className="text-muted normal-case tracking-normal">(optional)</span>
          </label>
          <SelectShell>
            <select
              id="howDidYouHear"
              name="howDidYouHear"
              value={values.howDidYouHear}
              onChange={(e) => update("howDidYouHear", e.target.value)}
              aria-invalid={Boolean(errors.howDidYouHear)}
              aria-describedby={describedBy("howDidYouHear")}
              className={`${inputClass} appearance-none pr-12`}
            >
              <option value="">Prefer not to say</option>
              {referralSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </SelectShell>
          <FieldError field="howDidYouHear" message={errors.howDidYouHear} />
        </div>
      </div>

      <div>
        <label htmlFor="whyJoin" className="label text-ivory">
          Why you are interested
        </label>
        <p id="whyJoin-hint" className="mt-2 text-sm text-muted">
          A sentence or two is plenty.
        </p>
        <textarea
          id="whyJoin"
          name="whyJoin"
          rows={5}
          maxLength={LIMITS.whyJoin}
          required
          value={values.whyJoin}
          onChange={(e) => update("whyJoin", e.target.value)}
          onBlur={() => validateField("whyJoin")}
          aria-invalid={Boolean(errors.whyJoin)}
          aria-describedby={describedBy("whyJoin", "whyJoin-hint whyJoin-count")}
          className={`${inputClass} resize-y`}
        />
        <div className="mt-2 flex items-start justify-between gap-4">
          <FieldError field="whyJoin" message={errors.whyJoin} />
          <p id="whyJoin-count" className="ml-auto shrink-0 text-sm tabular-nums text-muted">
            {values.whyJoin.length} / {LIMITS.whyJoin} characters
          </p>
        </div>
      </div>

      {/* Hidden from people; bots that fill it in are quietly discarded. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="border-t border-charcoal pt-10">
        <div className="flex items-start gap-4">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent", "consent-privacy")}
            className="mt-1 size-5 shrink-0 cursor-pointer accent-gold"
          />
          <div>
            <label htmlFor="consent" className="cursor-pointer leading-relaxed text-ivory">
              I agree to {site.name} storing the information above to process my registration.
            </label>
            <p id="consent-privacy" className="mt-2 text-sm text-muted">
              Read our{" "}
              <Link href="/privacy" target="_blank" className="text-ivory underline decoration-gold underline-offset-4">
                privacy policy
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>{" "}
              for how we handle your information.
            </p>
          </div>
        </div>
        <FieldError field="consent" message={errors.consent} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="label w-full border border-gold px-8 py-4 text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Submitting…" : site.ctaLabel}
      </button>
    </form>
  );
}

function FieldError({ field, message }: { field: RegistrationField; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${field}-error`} className="mt-3 text-sm text-ivory">
      <span aria-hidden="true" className="mr-2 text-gold">
        —
      </span>
      {message}
    </p>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute bottom-4 right-4 text-xs text-gold">
        ▾
      </span>
    </div>
  );
}
