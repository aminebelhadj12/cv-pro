"use client";

import { TemplateThumbnail } from "@/components/landing/TemplateThumbnail";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { ACCENTS } from "@/lib/resume/accents";
import { ACCENT_IDS, TEMPLATE_IDS } from "@/lib/resume/constants";
import { useResume } from "@/lib/resume/ResumeProvider";

/** Template and accent pickers, built on native radio inputs (free arrow-key navigation). */
export function DesignControls() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-900">
          {t.builder.design.template}
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATE_IDS.map((id) => (
            <label key={id} className="block cursor-pointer">
              <input
                type="radio"
                name="template"
                value={id}
                checked={resume.template === id}
                onChange={() => dispatch({ type: "SET_TEMPLATE", value: id })}
                className="peer sr-only"
              />
              <span className="block rounded-lg border-2 border-transparent p-1.5 transition-colors peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600">
                <TemplateThumbnail variant={id} />
                <span className="mt-1.5 block text-center text-xs font-medium text-slate-800">
                  {t.builder.design.templates[id]}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-900">
          {t.builder.design.accent}
        </legend>
        <div className="flex flex-wrap gap-3">
          {ACCENT_IDS.map((id) => (
            <label key={id} className="cursor-pointer" title={t.builder.design.accents[id]}>
              <input
                type="radio"
                name="accent"
                value={id}
                checked={resume.accent === id}
                onChange={() => dispatch({ type: "SET_ACCENT", value: id })}
                className="peer sr-only"
              />
              <span
                className="block size-8 rounded-full border-2 border-white shadow ring-2 ring-slate-200 transition peer-checked:ring-slate-900 peer-focus-visible:ring-brand-600"
                style={{ background: ACCENTS[id].main }}
              />
              <span className="sr-only">{t.builder.design.accents[id]}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
