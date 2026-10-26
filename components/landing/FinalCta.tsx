"use client";

import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";

export function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-6xl rounded-2xl bg-brand-600 px-6 py-12 text-center sm:py-14">
        <SectionHeading
          tone="light"
          title={t.finalCta.title}
          subtitle={t.finalCta.subtitle}
        />
        <div className="mt-8">
          <ButtonLink
            href="/builder"
            variant="inverted"
            className="!px-6 !py-3.5 text-base"
          >
            {t.finalCta.button}
            <ArrowRight aria-hidden="true" className="size-5 rtl:rotate-180" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
