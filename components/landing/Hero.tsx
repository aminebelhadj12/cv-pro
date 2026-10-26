"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { TemplateThumbnail } from "./TemplateThumbnail";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 sm:text-sm">
            <Sparkles aria-hidden="true" className="size-4" />
            {t.hero.badge}
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/builder" className="!px-6 !py-3.5 text-base">
              {t.hero.cta}
              <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />
            </ButtonLink>
            <ButtonLink
              href="/#templates"
              variant="secondary"
              className="!px-6 !py-3.5 text-base"
            >
              {t.hero.secondaryCta}
            </ButtonLink>
          </div>

          <ul className="mt-8 space-y-2.5">
            {t.hero.points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2.5 text-sm text-slate-700"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-100 p-6 sm:p-8">
          <TemplateThumbnail variant="modern" />
        </div>
      </div>
    </section>
  );
}
