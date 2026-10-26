"use client";

import { SelectField } from "@/components/ui/Field";
import { SectionCard } from "@/components/builder/SectionCard";
import { LOCALES, LOCALE_NAMES, isLocale } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";

export function SettingsSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();

  return (
    <SectionCard title={t.builder.sections.settings} defaultOpen>
      <SelectField
        label={t.builder.cvLanguage.label}
        hint={t.builder.cvLanguage.hint}
        value={resume.cvLocale}
        options={LOCALES.map((code) => ({
          value: code,
          label: LOCALE_NAMES[code],
        }))}
        onChange={(value) => {
          if (isLocale(value)) dispatch({ type: "SET_CV_LOCALE", value });
        }}
      />
    </SectionCard>
  );
}
