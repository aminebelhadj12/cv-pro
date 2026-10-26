"use client";

import { RepeatableList } from "@/components/builder/RepeatableList";
import { SectionCard } from "@/components/builder/SectionCard";
import { SelectField, TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { LANGUAGE_LEVELS } from "@/lib/resume/constants";
import { useResume } from "@/lib/resume/ResumeProvider";
import type { LanguageItem, LanguageLevel } from "@/types/resume";

function isLevel(value: string): value is LanguageLevel {
  return (LANGUAGE_LEVELS as readonly string[]).includes(value);
}

export function LanguagesSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const f = t.builder.fields;

  const update = (id: string, patch: Partial<Omit<LanguageItem, "id">>) =>
    dispatch({ type: "UPDATE_ITEM", key: "languages", id, patch });

  return (
    <SectionCard
      title={t.builder.sections.languages}
      count={resume.languages.length}
    >
      <RepeatableList
        listKey="languages"
        items={resume.languages}
        layout="row"
        getTitle={(item, index) =>
          item.name.trim() || `${t.builder.itemNames.languages} ${index + 1}`
        }
        renderFields={(item) => (
          <>
            <TextField
              label={f.languageName}
              placeholder={f.languageNamePh}
              value={item.name}
              onChange={(name) => update(item.id, { name })}
            />
            <SelectField
              label={f.level}
              value={item.level}
              options={LANGUAGE_LEVELS.map((level) => ({
                value: level,
                label: t.builder.levels[level],
              }))}
              onChange={(value) => {
                if (isLevel(value)) update(item.id, { level: value });
              }}
            />
          </>
        )}
      />
    </SectionCard>
  );
}
