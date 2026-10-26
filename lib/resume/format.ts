import type { Locale } from "@/types/i18n";

const INTL_LOCALE: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  // Latin digits are the usual choice in Moroccan CVs.
  ar: "ar-u-nu-latn",
};

const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

/** "2024-05" -> "mai 2024" (localised). Returns "" for empty or invalid input. */
export function formatMonth(value: string, locale: Locale): string {
  const match = MONTH_RE.exec(value);
  if (!match) return "";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatPeriod(
  start: string,
  end: string,
  current: boolean,
  locale: Locale,
  presentLabel: string,
): string {
  const from = formatMonth(start, locale);
  const to = current ? presentLabel : formatMonth(end, locale);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

/** Adds https:// when the user typed a bare domain, so the link is clickable. */
export function toHref(url: string): string {
  const v = url.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/** "https://www.example.com/path/" -> "example.com/path" (shorter to print). */
export function displayUrl(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/** Time of day, e.g. "14:32" (localised). */
export function formatTime(timestamp: number, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
