"use client";

import { useEffect, useState } from "react";
import { PrintSheet } from "@/components/resume/PrintSheet";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { TEMPLATE_IDS } from "@/lib/resume/constants";
import { useResume } from "@/lib/resume/ResumeProvider";
import type { TemplateId } from "@/types/resume";
import { DesignControls } from "./DesignControls";
import { DraftStatus } from "./DraftStatus";
import { EditorPanel } from "./EditorPanel";
import { ExportButton } from "./ExportButton";
import { ExportTips } from "./ExportTips";
import { NewResumeButton } from "./NewResumeButton";

type Tab = "edit" | "preview";

function isTemplateId(value: string | null): value is TemplateId {
  return value !== null && (TEMPLATE_IDS as readonly string[]).includes(value);
}

export function BuilderShell() {
  const { t } = useTranslation();
  const { dispatch, hydrated } = useResume();
  const [tab, setTab] = useState<Tab>("edit");

  // /builder?template=modern (from the landing page) wins over the restored draft,
  // so it is applied only after the draft has been loaded.
  useEffect(() => {
    if (!hydrated) return;
    const requested = new URLSearchParams(window.location.search).get("template");
    if (isTemplateId(requested)) {
      dispatch({ type: "SET_TEMPLATE", value: requested });
    }
  }, [dispatch, hydrated]);

  if (!hydrated) {
    return (
      <div
        role="status"
        aria-busy="true"
        className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-500 sm:px-6"
      >
        {t.builder.draft.loading}
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "edit", label: t.builder.preview.tabEdit },
    { id: "preview", label: t.builder.preview.tabPreview },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t.builder.title}
          </h1>
          <p className="mt-1 text-slate-600">{t.builder.subtitle}</p>
          <DraftStatus />
        </div>
        <div className="flex items-start gap-2">
          <NewResumeButton />
          <ExportButton />
        </div>
      </div>

      {/* Mobile and tablet: switch between editing and previewing. */}
      <div
        role="group"
        aria-label={t.builder.preview.tabsLabel}
        className="sticky top-16 z-30 -mx-4 mb-4 flex gap-1 border-b border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={tab === item.id}
            onClick={() => setTab(item.id)}
            className={
              "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors " +
              (tab === item.id
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100")
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={tab === "edit" ? "block" : "hidden lg:block"}>
          <EditorPanel />
        </div>

        <aside
          className={
            (tab === "preview" ? "block" : "hidden lg:block") +
            " space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto"
          }
          aria-label={t.builder.preview.title}
        >
          <DesignControls />
          <ResumePreview />
          <ExportTips />
        </aside>
      </div>

      <PrintSheet />
    </div>
  );
}
