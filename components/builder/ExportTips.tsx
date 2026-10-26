"use client";

import { ChevronDown, Info } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function ExportTips() {
  const { t } = useTranslation();

  return (
    <details className="group rounded-xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-3 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <Info aria-hidden="true" className="size-4 text-brand-600" />
          {t.builder.export.tipsTitle}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-slate-500 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-700">
        <ol className="list-decimal space-y-1.5 ps-5">
          {t.builder.export.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-slate-500">{t.builder.export.privacy}</p>
      </div>
    </details>
  );
}
