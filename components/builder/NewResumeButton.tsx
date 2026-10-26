"use client";

import { FilePlus2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { isPristine } from "@/lib/resume/persistence";
import { useResume } from "@/lib/resume/ResumeProvider";

export function NewResumeButton() {
  const { t } = useTranslation();
  const { resume, clearDraft } = useResume();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Button
        disabled={isPristine(resume)}
        onClick={() => setConfirming(true)}
        className="!px-4 !py-2.5"
      >
        <FilePlus2 aria-hidden="true" className="size-4" />
        {t.builder.draft.newCv}
      </Button>

      <ConfirmDialog
        open={confirming}
        title={t.builder.draft.confirmTitle}
        description={t.builder.draft.confirmText}
        confirmLabel={t.builder.draft.confirm}
        cancelLabel={t.builder.draft.cancel}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          clearDraft();
          setConfirming(false);
        }}
      />
    </>
  );
}
