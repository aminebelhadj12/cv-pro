"use client";

import {
  Download,
  Eye,
  Gift,
  Languages,
  Lock,
  Palette,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";

const FEATURE_ICONS = [Gift, Lock, Languages, Eye, Palette, Download];

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title={t.features.title}
          subtitle={t.features.subtitle}
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, index) => {
            const Icon = FEATURE_ICONS[index] ?? Gift;
            return (
              <li
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
