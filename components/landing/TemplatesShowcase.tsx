"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";
import { THUMBNAIL_VARIANTS, TemplateThumbnail } from "./TemplateThumbnail";

export function TemplatesShowcase() {
  const { t } = useTranslation();

  return (
    <section id="templates" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title={t.templates.title}
          subtitle={t.templates.subtitle}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {THUMBNAIL_VARIANTS.map((id) => {
            const item = t.templates.items[id];
            return (
              <article
                key={id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="rounded-xl bg-slate-100 p-5">
                  <div className="mx-auto max-w-[220px]">
                    <TemplateThumbnail variant={id} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h3>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>

                <Link
                  href={`/builder?template=${id}`}
                  className="mt-5 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  {t.templates.useTemplate}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 rtl:rotate-180"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
