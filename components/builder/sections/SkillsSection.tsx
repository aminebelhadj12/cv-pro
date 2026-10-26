"use client";

import { RepeatableList } from "@/components/builder/RepeatableList";
import { SectionCard } from "@/components/builder/SectionCard";
import { TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";

export function SkillsSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const f = t.builder.fields;

  return (
    <SectionCard title={t.builder.sections.skills} count={resume.skills.length}>
      <RepeatableList
        listKey="skills"
        items={resume.skills}
        layout="row"
        getTitle={(item, index) =>
          item.name.trim() || `${t.builder.itemNames.skills} ${index + 1}`
        }
        renderFields={(item) => (
          <TextField
            label={f.skill}
            placeholder={f.skillPh}
            value={item.name}
            className="sm:col-span-2"
            onChange={(name) =>
              dispatch({
                type: "UPDATE_ITEM",
                key: "skills",
                id: item.id,
                patch: { name },
              })
            }
          />
        )}
      />
    </SectionCard>
  );
}
