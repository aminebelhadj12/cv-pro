"use client";

import { Globe } from "lucide-react";
import {
  LOCALES,
  LOCALE_NAMES,
  LOCALE_SHORT,
} from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t.header.languageGroupLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm"
    >
      <Globe aria-hidden="true" className="mx-1.5 size-4 text-slate-500" />
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={
              "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors " +
              (active
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
            }
          >
            <span className="sm:hidden">{LOCALE_SHORT[code]}</span>
            <span className="hidden sm:inline">{LOCALE_NAMES[code]}</span>
          </button>
        );
      })}
    </div>
  );
}
