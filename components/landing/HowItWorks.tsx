"use client";

import { Download, LayoutTemplate, PenLine } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";

const STEP_ICONS = [PenLine, LayoutTemplate, Download];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-slate-200 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={t.how.title} subtitle={t.how.subtitle} />

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {t.how.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? PenLine;
            return (
              <li key={step.title} className="flex gap-4 md:flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-sm font-semibold text-slate-500 md:inline"
                  >
                    {index + 1} / {t.how.steps.length}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    <span className="me-2 text-brand-600 md:hidden">
                      {index + 1}.
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
