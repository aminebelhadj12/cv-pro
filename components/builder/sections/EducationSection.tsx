"use client";

import { RepeatableList } from "@/components/builder/RepeatableList";
import { SectionCard } from "@/components/builder/SectionCard";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";
import { compose, endAfter, month } from "@/lib/resume/validation";
import type { EducationItem } from "@/types/resume";

export function EducationSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const f = t.builder.fields;

  const update = (id: string, patch: Partial<Omit<EducationItem, "id">>) =>
    dispatch({ type: "UPDATE_ITEM", key: "education", id, patch });

  return (
    <SectionCard
      title={t.builder.sections.education}
      count={resume.education.length}
      defaultOpen
    >
      <RepeatableList
        listKey="education"
        items={resume.education}
        getTitle={(item, index) =>
          item.degree.trim() || `${t.builder.itemNames.education} ${index + 1}`
        }
        renderFields={(item) => (
          <>
            <TextField
              label={f.degree}
              placeholder={f.degreePh}
              value={item.degree}
              onChange={(degree) => update(item.id, { degree })}
            />
            <TextField
              label={f.institution}
              placeholder={f.institutionPh}
              value={item.institution}
              onChange={(institution) => update(item.id, { institution })}
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
                label={f.currentStudy}
                checked={item.current}
                onChange={(current) =>
                  update(item.id, current ? { current, endDate: "" } : { current })
                }
              />
            </div>
            <TextAreaField
              label={f.educationDescription}
              placeholder={f.educationDescriptionPh}
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
