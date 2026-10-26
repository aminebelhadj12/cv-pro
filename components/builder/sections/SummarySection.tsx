"use client";

import { SectionCard } from "@/components/builder/SectionCard";
import { TextAreaField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";

export function SummarySection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();

  return (
    <SectionCard title={t.builder.sections.summary} defaultOpen>
      <TextAreaField
        label={t.builder.fields.summary}
        placeholder={t.builder.fields.summaryPh}
        value={resume.summary}
        maxLength={1200}
        rows={5}
        onChange={(value) => dispatch({ type: "SET_SUMMARY", value })}
      />
    </SectionCard>
  );
}
