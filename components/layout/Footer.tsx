"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const { t } = useTranslation();

  const links = [
    { href: "/#templates", label: t.header.nav.templates },
    { href: "/#how-it-works", label: t.header.nav.howItWorks },
    { href: "/#features", label: t.header.nav.features },
    { href: "/builder", label: t.header.cta },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-slate-900">{t.common.appName}</p>
          <p className="mt-2 max-w-xs text-sm text-slate-600">
            {t.footer.tagline}
          </p>
        </div>

        <nav aria-label={t.footer.navLabel}>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded text-slate-600 transition-colors hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="flex items-start gap-2 text-sm text-slate-600">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-brand-600"
          />
          <span>{t.footer.privacy}</span>
        </p>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {t.common.appName}. {t.footer.rights}
      </div>
    </footer>
  );
}
