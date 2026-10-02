# Ready to Mingle

An informational showcase site about small, hosted gatherings (supper clubs, tastings, private viewings, evenings of music): what they are, what a typical evening involves, why people enjoy them, and how to find or start one. Toronto is used as the example city. It is not a club: it runs no events, has no venue, schedule, membership or pricing, and must never read as if it does. It is a website, not a mobile app, with no login. Visitors can request a short starter guide by email, which they confirm through a link we email them. Visual references: Soho House, The League. Understated and highly curated.

## Stack
- Next.js 14+ App Router, TypeScript (strict), Tailwind CSS, Framer Motion
- Forms: Server Actions + Zod validation (server-side is the source of truth; mirror on the client for UX)
- Email: plain SMTP via Nodemailer, so the provider can be switched with environment variables alone (e.g. an existing Google Workspace / Microsoft 365 mailbox, or Resend's SMTP service). Never add provider-specific SDKs or APIs. Without `SMTP_HOST`, emails are written to `.outbox/` and logged instead of sent (local dev and tests). Provider setup steps live in `docs/email-setup.md`.
- Database: PostgreSQL via Drizzle ORM with generated SQL migrations (local DB via `docker-compose.yml`)
- Testing: Vitest for validation/server logic, Playwright for a form-submission smoke test
- Deploy target: Vercel with any hosted Postgres. Config via environment variables only.

## Commands
<!-- Keep this list in sync with package.json scripts -->
- Start DB: `docker compose up -d`
- Migrations (generate / apply / undo last): `npm run db:generate` / `npm run db:migrate` / `npm run db:rollback`. Every migration needs a hand-written `drizzle/rollback/<tag>.down.sql`.
- Dev / build / lint / typecheck: `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- Unit tests / e2e tests: `npm test` / `npm run test:e2e` (both need the DB running; they use a separate `<db>_test` database, created and migrated automatically)
- Export guide requests to CSV: `npm run export:registrations -- --status=all|confirmed|unconfirmed` (writes to `exports/`, which is git-ignored)

## Site Map
- `/`: cinematic video hero, brief intro, why people enjoy them, a preview of example formats, closing CTA
- `/what-it-is`: the idea, a typical evening, why people enjoy them, who it's for, what you need to get started, finding one near you
- `/examples`: common gathering formats and their variations (never dates, venues, addresses or prices)
- `/guide`: starter guide request form
- `/guide/check-email`: "Check your inbox" page shown after submitting
- `/guide/confirm?token=…`: landing page from the email link; the visitor presses a button to confirm (a button, not the bare link, so email link scanners can't confirm on their behalf), then lands on `/guide/read`
- `/guide/read`: the starter guide itself (noindex, not in the sitemap; also linked from the guide email)
- `/faq`, `/privacy`
- Old URLs (`/the-club`, `/events`, `/register/*`) redirect to their replacements in `next.config.ts`.

## Content Rules
- Example formats live in `content/examples.ts` as typed data so they can be edited without touching components.
- Voice is neutral and descriptive ("people often…", "a typical evening…"), never "we/our club" or "our members". "We" is only for the website itself (the form, emails, privacy policy).
- Never imply a single club or venue: no addresses, maps, opening hours, schedules, membership, pricing or booking/enquiry contact.
- Don't invent specific facts (locations, organizations, statistics). Use `[EXAMPLE: …]` placeholders where real details would go.

## Starter Guide Form & Data
- Fields: preferred_name (what we call them in emails, max 80 chars), email, consent checkbox (required). Collect nothing else.
- `registrations` table (name kept from the earlier club site; one row per guide request): id (UUID), the fields above, consent_accepted_at, confirmed_at (null until the email link is used), confirmation_token_hash (never store the raw token), confirmation_expires_at (48 hours), created_at, updated_at. Unique index on lowercased email; index on confirmed_at and created_at.
- The only emails the site sends are the confirmation link, a "your starter guide" email with the guide link once confirmed, and the guide link again for an already-confirmed email. No announcements, newsletters or reminders, and copy must not promise them.
- After every valid submission, show `/guide/check-email` whether or not the email is new, so the form never reveals who has asked. New or unconfirmed email → send a fresh confirmation link. Already confirmed → send the guide link again instead.
- Unconfirmed requests older than 7 days are deleted.
- Spam protection: honeypot field + basic rate limiting per IP (hashed with `RATE_LIMIT_SECRET`; never store raw IP addresses).
- PIPEDA: collect only what's listed, record consent_accepted_at, and link the privacy policy next to the consent checkbox.
- No secrets in code; keep `.env.example` current. Schema changes only through migrations.

## Design System
- Colors: background #0A0A0A, surface #141414, charcoal #2A2A2A, text #F5F3EF, muted text #C2BCB1, accent muted gold #B89B5E (sparingly: CTA borders/hover, thin rules). No bright or saturated colors anywhere.
- Type: Cormorant Garamond (serif display) for headlines; Inter for body; wide letter-spacing on small uppercase labels. Load via `next/font`.
- Generous whitespace, 1px hairline borders, no heavy shadows, no rounded pill buttons.
- Every page shows a fixed background photo (`components/PageBackground.tsx`; on home it sits below the video hero, which keeps its own solid backdrop), mapped per route in `content/backgrounds.ts`, under an 85% `#0A0A0A` overlay. Keep the overlay at 85% or more: it is what keeps all text, including gold, above WCAG AA over the brightest part of any photo. Cards and form fields stay on solid `surface`.
- Motion: slow ease-out fades and rises (0.8–1.2s), subtle scroll reveals. No springs or bounces. Respect prefers-reduced-motion.
- Copy: the primary CTA is "Start Your Own" (to `/guide`); secondary links are neutral ("Learn more", "See examples", "Find something similar near you"). Never "Sign Up", "Join Now", "Register" or "Apply for Membership". Tone is understated and confident, never salesy. No exclamation marks.
- Audience is mostly 45+: keep text comfortably readable. Nothing below 16px (body 18px, small uppercase labels 13px), Cormorant Light only for very large display type (use regular/medium below ~48px), no small italic text, tap targets at least 44px, and form labels in plain sentence case rather than small caps. The type scale lives in `app/globals.css`.
- Accessibility: WCAG AA contrast, visible keyboard focus, labelled form fields, and error messages announced to screen readers.

## Conventions
- Components in `components/`, content in `content/`, DB code in `lib/db/`, validation schemas in `lib/validation/`.
- Comments only where logic is non-obvious.
- Page metadata goes through `pageMetadata()` in `lib/metadata.ts` (Next replaces `openGraph` per page rather than merging it). New public pages also go in `content/routes.ts` for the sitemap.
- Wrap below-the-fold sections in `components/Reveal.tsx` for scroll reveals; keep above-the-fold content (hero, page headers) on CSS animations or static so it doesn't wait for JavaScript.
- The project runs Next.js 16, whose APIs differ from older versions: read @AGENTS.md before writing Next-specific code.
- Out of scope unless explicitly requested: logins or accounts, event listings or booking, approval workflows, gated content, admin dashboard, payments, marketing or newsletter emails (only the emails above), CMS integration.
