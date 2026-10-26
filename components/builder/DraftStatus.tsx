"use client";

import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { formatTime } from "@/lib/resume/format";
import { useResume } from "@/lib/resume/ResumeProvider";

function Line({
  tone,
  icon,
  children,
}: {
  tone: "info" | "warn";
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <p
      className={`flex items-start gap-2 text-sm ${
        tone === "warn" ? "text-amber-800" : "text-slate-600"
      }`}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

/** Tells the user what is happening to their draft: saving, saved, restored, or a problem. */
export function DraftStatus() {
  const { t, locale } = useTranslation();
  const { draft } = useResume();
  const [dismissed, setDismissed] = useState(false);
  const d = t.builder.draft;

  const warnIcon = <AlertTriangle aria-hidden="true" className="size-4" />;

  let main: ReactNode;
  if (draft.saveStatus === "unavailable") {
    main = <Line tone="warn" icon={warnIcon}>{d.unavailable}</Line>;
  } else if (draft.saveStatus === "quota" || draft.saveStatus === "error") {
    main = <Line tone="warn" icon={warnIcon}>{d.error}</Line>;
  } else if (draft.saveStatus === "saving") {
    main = (
      <Line tone="info" icon={<Loader2 aria-hidden="true" className="size-4 animate-spin" />}>
        {d.saving}
      </Line>
    );
  } else if (draft.saveStatus === "saved" && draft.savedAt) {
    main = (
      <Line tone="info" icon={<Check aria-hidden="true" className="size-4 text-emerald-600" />}>
        {d.savedAt} {formatTime(draft.savedAt, locale)} · {d.privacy}
      </Line>
    );
  } else if (draft.restored) {
    main = (
      <Line tone="info" icon={<Check aria-hidden="true" className="size-4 text-emerald-600" />}>
        {d.restored}
        {draft.savedAt ? ` (${formatTime(draft.savedAt, locale)})` : ""} · {d.privacy}
      </Line>
    );
  } else {
    main = (
      <Line tone="info" icon={<Check aria-hidden="true" className="size-4 text-slate-500" />}>
        {d.autosave}
      </Line>
    );
  }

  return (
    <div className="mt-2 space-y-2" role="status" aria-live="polite">
      {main}
      {draft.corrupted && !dismissed ? (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <Line tone="warn" icon={warnIcon}>{d.corrupted}</Line>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={d.dismiss}
            title={d.dismiss}
            className="shrink-0 rounded p-1 text-amber-800 hover:bg-amber-100"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
