"use client";

import { RepeatableList } from "@/components/builder/RepeatableList";
import { SectionCard } from "@/components/builder/SectionCard";
import { TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";
import { month } from "@/lib/resume/validation";
import type { CertificationItem } from "@/types/resume";

export function CertificationsSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const f = t.builder.fields;

  const update = (id: string, patch: Partial<Omit<CertificationItem, "id">>) =>
    dispatch({ type: "UPDATE_ITEM", key: "certifications", id, patch });

  return (
    <SectionCard
      title={t.builder.sections.certifications}
      count={resume.certifications.length}
    >
      <RepeatableList
        listKey="certifications"
        items={resume.certifications}
        getTitle={(item, index) =>
          item.name.trim() ||
          `${t.builder.itemNames.certifications} ${index + 1}`
        }
        renderFields={(item) => (
          <>
            <TextField
              label={f.certName}
              placeholder={f.certNamePh}
              value={item.name}
              onChange={(name) => update(item.id, { name })}
            />
            <TextField
              label={f.issuer}
              placeholder={f.issuerPh}
              value={item.issuer}
              onChange={(issuer) => update(item.id, { issuer })}
            />
            <TextField
              label={f.certDate}
              type="month"
              hint={f.dateHint}
              value={item.date}
              onChange={(date) => update(item.id, { date })}
              validate={month}
            />
          </>
        )}
      />
    </SectionCard>
  );
}
