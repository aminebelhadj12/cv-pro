"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();

  const navItems = [
    { href: "/#templates", label: t.header.nav.templates },
    { href: "/#how-it-works", label: t.header.nav.howItWorks },
    { href: "/#features", label: t.header.nav.features },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-50"
      >
        {t.header.skipToContent}
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={t.header.homeLabel}
          className="flex items-center gap-2 rounded-md"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <FileText aria-hidden="true" className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {t.common.appName}
          </span>
        </Link>

        <nav
          aria-label={t.header.navLabel}
          className="hidden items-center gap-6 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {/* max-sm:hidden (not "hidden"): ButtonLink already sets display:inline-flex. */}
          <ButtonLink href="/builder" className="!py-2 max-sm:hidden">
            {t.header.cta}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
