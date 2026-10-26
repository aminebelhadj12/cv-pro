"use client";

import { RepeatableList } from "@/components/builder/RepeatableList";
import { SectionCard } from "@/components/builder/SectionCard";
import { TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";
import { url } from "@/lib/resume/validation";
import type { LinkItem } from "@/types/resume";

export function LinksSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const f = t.builder.fields;

  const update = (id: string, patch: Partial<Omit<LinkItem, "id">>) =>
    dispatch({ type: "UPDATE_ITEM", key: "links", id, patch });

  return (
    <SectionCard title={t.builder.sections.links} count={resume.links.length}>
      <RepeatableList
        listKey="links"
        items={resume.links}
        layout="row"
        getTitle={(item, index) =>
          item.label.trim() || `${t.builder.itemNames.links} ${index + 1}`
        }
        renderFields={(item) => (
          <>
            <TextField
              label={f.linkLabel}
              placeholder={f.linkLabelPh}
              value={item.label}
              onChange={(label) => update(item.id, { label })}
            />
            <TextField
              label={f.linkUrl}
              placeholder={f.linkUrlPh}
              type="url"
              value={item.url}
              onChange={(value) => update(item.id, { url: value })}
              validate={url}
            />
          </>
        )}
      />
    </SectionCard>
  );
}
