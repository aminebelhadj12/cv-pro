"use client";

import { RepeatableList } from "@/components/builder/RepeatableList";
import { SectionCard } from "@/components/builder/SectionCard";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";
import { url } from "@/lib/resume/validation";
import type { ProjectItem } from "@/types/resume";

export function ProjectsSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const f = t.builder.fields;

  const update = (id: string, patch: Partial<Omit<ProjectItem, "id">>) =>
    dispatch({ type: "UPDATE_ITEM", key: "projects", id, patch });

  return (
    <SectionCard
      title={t.builder.sections.projects}
      count={resume.projects.length}
    >
      <RepeatableList
        listKey="projects"
        items={resume.projects}
        getTitle={(item, index) =>
          item.name.trim() || `${t.builder.itemNames.projects} ${index + 1}`
        }
        renderFields={(item) => (
          <>
            <TextField
              label={f.projectName}
              placeholder={f.projectNamePh}
              value={item.name}
              onChange={(name) => update(item.id, { name })}
            />
            <TextField
              label={f.projectUrl}
              placeholder={f.projectUrlPh}
              type="url"
              value={item.url}
              onChange={(value) => update(item.id, { url: value })}
              validate={url}
            />
            <TextAreaField
              label={f.projectDescription}
              placeholder={f.projectDescriptionPh}
              value={item.description}
              rows={3}
              maxLength={800}
              onChange={(description) => update(item.id, { description })}
              className="sm:col-span-2"
            />
          </>
        )}
      />
    </SectionCard>
  );
}
