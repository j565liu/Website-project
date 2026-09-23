# [Platform Name]

A private, membership-by-application events club for high-income professionals in Toronto. This project is the public marketing website only: it is a website, not a mobile app. There are no member logins. Visitors learn about the club, see upcoming event teasers, and submit a membership application. Brand references: Soho House, The League. Private, understated, highly curated.

## Stack
- Next.js 14+ App Router, TypeScript (strict), Tailwind CSS, Framer Motion
- Forms: Server Actions + Zod validation (server-side is the source of truth; mirror on the client for UX)
- Database: PostgreSQL via Drizzle ORM with generated SQL migrations (local DB via `docker-compose.yml`)
- Testing: Vitest for validation/server logic, Playwright for a form-submission smoke test
- Deploy target: Vercel with any hosted Postgres. Config via environment variables only.

## Commands
<!-- Claude: create matching package.json scripts during scaffolding; keep this list in sync with them -->
- Start DB: `docker compose up -d`
- Migrations (generate / apply): `npm run db:generate` / `npm run db:migrate`
- Dev / build / lint / typecheck: `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- Unit tests / e2e tests: `npm test` / `npm run test:e2e`
- Export applications to CSV: `npm run export:applications`

## Site Map
- `/`: cinematic video hero, brief club intro, event teasers preview, closing CTA
- `/the-club`: philosophy, what membership means, who it's for
- `/events`: upcoming event teasers (title, date, time, neighborhood only; never venue or address)
- `/apply`: membership application form
- `/apply/received`: confirmation page (tone: "Your application is under review", no promises)
- `/faq`, `/privacy`

## Content Rules
- Events live in `content/events.ts` as typed data so they can be edited without touching components. Past events are hidden automatically.
- Event teasers never include venue names, addresses, or prices. Copy should imply exclusivity ("Location disclosed to approved members").
- All times displayed in America/Toronto.

## Application Form & Data
- Fields: full_name, email, phone (optional), linkedin_url, job_title, company, industry (select), how_did_you_hear (optional), why_join (short text, max 500 chars), consent checkbox (required)
- `applications` table: id (UUID), the fields above, status (pending, approved, rejected, waitlisted; default pending), consent_accepted_at, created_at, updated_at. Unique index on lowercased email; index on status and created_at.
- Duplicate email → friendly message ("We already have your application"), never an error page, and never reveal the application's status.
- Spam protection: honeypot field + basic rate limiting per IP. Don't store raw IP addresses.
- PIPEDA: collect only what's listed, record consent_accepted_at, and link the privacy policy next to the consent checkbox.
- No secrets in code; keep `.env.example` current. Schema changes only through migrations.

## Design System
- Colors: background #0A0A0A, surface #141414, charcoal #2A2A2A, text #F5F3EF, muted text #A39E94, accent muted gold #B89B5E (sparingly: CTA borders/hover, thin rules). No bright or saturated colors anywhere.
- Type: Cormorant Garamond (serif display) for headlines; Inter for body; wide letter-spacing on small uppercase labels. Load via `next/font`.
- Generous whitespace, 1px hairline borders, no heavy shadows, no rounded pill buttons.
- Motion: slow ease-out fades and rises (0.8–1.2s), subtle scroll reveals. No springs or bounces. Respect prefers-reduced-motion.
- Copy: the CTA is always "Apply for Membership", never "Sign Up" or "Join Now". Tone is understated and confident, never salesy. No exclamation marks.
- Accessibility: WCAG AA contrast, visible keyboard focus, labelled form fields, and error messages announced to screen readers.

## Conventions
- Components in `components/`, content in `content/`, DB code in `lib/db/`, validation schemas in `lib/validation/`.
- Comments only where logic is non-obvious.
- Out of scope unless explicitly requested: member logins, gated content, admin dashboard, payments, email sending, CMS integration.
