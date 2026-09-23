# Ready to Mingle

A private events club for high-income professionals in Toronto. This project is the public marketing website only: it is a website, not a mobile app. There is no membership tier, approval process, or login. Visitors learn about the club, see upcoming event teasers, and register their interest with their email address, which they confirm through a link we email them. Brand references: Soho House, The League. Private, understated, highly curated.

## Stack
- Next.js 14+ App Router, TypeScript (strict), Tailwind CSS, Framer Motion
- Forms: Server Actions + Zod validation (server-side is the source of truth; mirror on the client for UX)
- Email: Resend via its HTTP API (no SDK). Without `RESEND_API_KEY`, emails are written to `.outbox/` and logged instead of sent (local dev and tests).
- Database: PostgreSQL via Drizzle ORM with generated SQL migrations (local DB via `docker-compose.yml`)
- Testing: Vitest for validation/server logic, Playwright for a form-submission smoke test
- Deploy target: Vercel with any hosted Postgres. Config via environment variables only.

## Commands
<!-- Claude: create matching package.json scripts during scaffolding; keep this list in sync with them -->
- Start DB: `docker compose up -d`
- Migrations (generate / apply): `npm run db:generate` / `npm run db:migrate`
- Dev / build / lint / typecheck: `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- Unit tests / e2e tests: `npm test` / `npm run test:e2e`
- Export registrations to CSV: `npm run export:registrations`

## Site Map
- `/`: cinematic video hero, brief club intro, event teasers preview, closing CTA
- `/the-club`: philosophy, what the club is like, who it's for
- `/events`: upcoming event teasers (title, date, time, neighborhood only; never venue or address)
- `/register`: registration form
- `/register/check-email`: "Check your inbox" page shown after submitting
- `/register/confirm?token=…`: landing page from the email link; the visitor presses a button to confirm (a button, not the bare link, so email link scanners can't confirm on their behalf), then sees "You're registered"
- `/faq`, `/privacy`

## Content Rules
- Events live in `content/events.ts` as typed data so they can be edited without touching components. Past events are hidden automatically.
- Event teasers never include venue names, addresses, or prices. Copy should imply exclusivity ("Location shared with registered guests").
- All times displayed in America/Toronto.

## Registration Form & Data
- Fields: email, industry (select), how_did_you_hear (optional select), why_join (short text, max 500 chars), consent checkbox (required). Collect nothing else.
- `registrations` table: id (UUID), the fields above, consent_accepted_at, confirmed_at (null until the email link is used), confirmation_token_hash (never store the raw token), confirmation_expires_at (48 hours), created_at, updated_at. Unique index on lowercased email; index on confirmed_at and created_at.
- Everyone who confirms is registered: there is no approval status.
- After every valid submission, show `/register/check-email` whether or not the email is new, so the form never reveals who has registered. New or unconfirmed email → send a fresh confirmation link. Already confirmed → send a short "you're already registered" email instead.
- Unconfirmed registrations older than 7 days are deleted.
- Spam protection: honeypot field + basic rate limiting per IP (hashed with `RATE_LIMIT_SECRET`; never store raw IP addresses).
- PIPEDA: collect only what's listed, record consent_accepted_at, and link the privacy policy next to the consent checkbox.
- No secrets in code; keep `.env.example` current. Schema changes only through migrations.

## Design System
- Colors: background #0A0A0A, surface #141414, charcoal #2A2A2A, text #F5F3EF, muted text #A39E94, accent muted gold #B89B5E (sparingly: CTA borders/hover, thin rules). No bright or saturated colors anywhere.
- Type: Cormorant Garamond (serif display) for headlines; Inter for body; wide letter-spacing on small uppercase labels. Load via `next/font`.
- Generous whitespace, 1px hairline borders, no heavy shadows, no rounded pill buttons.
- Motion: slow ease-out fades and rises (0.8–1.2s), subtle scroll reveals. No springs or bounces. Respect prefers-reduced-motion.
- Copy: the CTA is always "Register Your Interest", never "Sign Up", "Join Now", or "Apply for Membership". Don't describe the club as membership-based. Tone is understated and confident, never salesy. No exclamation marks.
- Accessibility: WCAG AA contrast, visible keyboard focus, labelled form fields, and error messages announced to screen readers.

## Conventions
- Components in `components/`, content in `content/`, DB code in `lib/db/`, validation schemas in `lib/validation/`.
- Comments only where logic is non-obvious.
- The project runs Next.js 16, whose APIs differ from older versions: read @AGENTS.md before writing Next-specific code.
- Out of scope unless explicitly requested: logins or accounts, approval workflows, gated content, admin dashboard, payments, marketing or newsletter emails (only the confirmation emails above), CMS integration.
