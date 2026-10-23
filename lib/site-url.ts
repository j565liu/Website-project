// NEXT_PUBLIC_SITE_URL is the site's public address. If it's missing on Vercel, fall back to the
// production domain Vercel provides, so emails never link to localhost.
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
