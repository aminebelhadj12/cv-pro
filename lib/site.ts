/**
 * Public site URL, used for SEO (canonical links, sitemap, robots, Open Graph).
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL: set it yourself (e.g. your own domain).
 *   2. VERCEL_PROJECT_PRODUCTION_URL: provided automatically by Vercel.
 *   3. http://localhost:3000 for local development.
 */
function normalize(value: string): string {
  const url = value.trim().replace(/\/+$/, "");
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalize(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return normalize(vercel);

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
