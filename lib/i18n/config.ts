import type { Direction, Locale } from "@/types/i18n";

export const LOCALES: readonly Locale[] = ["fr", "ar", "en"];
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_STORAGE_KEY = "cvpro:locale";

export const LOCALE_DIR: Record<Locale, Direction> = {
  fr: "ltr",
  ar: "rtl",
  en: "ltr",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  fr: "FR",
  ar: "AR",
  en: "EN",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
