"use client";

import { AlertTriangle, Download, Loader2 } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { isPreparedEmpty } from "@/components/resume/prepare";
import { usePreparedResume } from "@/components/resume/usePreparedResume";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { PrintError, buildPdfFilename, printResume } from "@/lib/print";
import { collectIssues } from "@/lib/resume/issues";
import { useResume } from "@/lib/resume/ResumeProvider";

export function ExportButton() {
  const { t } = useTranslation();
  const { resume } = useResume();
  const data = usePreparedResume();
  const statusId = useId();
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empty = isPreparedEmpty(data);
  const issues = useMemo(() => collectIssues(resume), [resume]);

  async function handleClick() {
    setError(null);
    setPreparing(true);
    try {
      await printResume(buildPdfFilename(data.name));
    } catch (err) {
      setError(
        err instanceof PrintError && err.code === "empty"
          ? t.builder.export.emptyHint
          : t.builder.export.error,
      );
    } finally {
      setPreparing(false);
    }
  }

  return (
    <div className="min-w-0 flex-1 lg:flex-none lg:text-end">
      <Button
        variant="primary"
        disabled={empty || preparing}
        onClick={handleClick}
        aria-describedby={statusId}
        className="w-full !px-5 !py-2.5 lg:w-auto"
      >
        {preparing ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Download aria-hidden="true" className="size-4" />
        )}
        {preparing ? t.builder.export.preparing : t.builder.export.button}
      </Button>

      <div id={statusId} aria-live="polite" className="mt-2 text-xs">
        {error ? (
          <p role="alert" className="max-w-sm text-red-600 lg:ms-auto">
            {error}
          </p>
        ) : empty ? (
          <p className="text-slate-500">{t.builder.export.emptyHint}</p>
        ) : issues.length > 0 ? (
          <p className="flex max-w-sm items-start gap-1.5 text-amber-800 lg:ms-auto">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {t.builder.issues.title}{" "}
              {issues.map((issue) => t.builder.issues.labels[issue]).join(", ")}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
