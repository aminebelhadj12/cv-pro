"use client";

import { RepeatableList } from "@/components/builder/RepeatableList";
import { SectionCard } from "@/components/builder/SectionCard";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";
import { compose, endAfter, month } from "@/lib/resume/validation";
import type { ExperienceItem } from "@/types/resume";

export function ExperienceSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const f = t.builder.fields;

  const update = (id: string, patch: Partial<Omit<ExperienceItem, "id">>) =>
    dispatch({ type: "UPDATE_ITEM", key: "experience", id, patch });

  return (
    <SectionCard
      title={t.builder.sections.experience}
      count={resume.experience.length}
      defaultOpen
    >
      <RepeatableList
        listKey="experience"
        items={resume.experience}
        getTitle={(item, index) =>
          item.position.trim() ||
          `${t.builder.itemNames.experience} ${index + 1}`
        }
        renderFields={(item) => (
          <>
            <TextField
              label={f.position}
              placeholder={f.positionPh}
              value={item.position}
              onChange={(position) => update(item.id, { position })}
            />
            <TextField
              label={f.company}
              placeholder={f.companyPh}
              value={item.company}
              onChange={(company) => update(item.id, { company })}
            />
            <TextField
              label={f.itemLocation}
              placeholder={f.itemLocationPh}
              value={item.location}
              onChange={(location) => update(item.id, { location })}
              className="sm:col-span-2"
            />
            <TextField
              label={f.startDate}
              type="month"
              hint={f.dateHint}
              value={item.startDate}
              onChange={(startDate) => update(item.id, { startDate })}
              validate={month}
            />
            <div>
              <TextField
                label={f.endDate}
                type="month"
                hint={f.dateHint}
                value={item.endDate}
                disabled={item.current}
                onChange={(endDate) => update(item.id, { endDate })}
                validate={compose(month, endAfter(item.startDate))}
              />
              <CheckboxField
                className="mt-2"
                label={f.currentJob}
                checked={item.current}
                onChange={(current) =>
                  update(item.id, current ? { current, endDate: "" } : { current })
                }
              />
            </div>
            <TextAreaField
              label={f.experienceDescription}
              placeholder={f.experienceDescriptionPh}
              value={item.description}
              rows={4}
              maxLength={1500}
              onChange={(description) => update(item.id, { description })}
              className="sm:col-span-2"
            />
          </>
        )}
      />
    </SectionCard>
  );
}
