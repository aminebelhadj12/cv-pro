"use client";

import { SectionCard } from "@/components/builder/SectionCard";
import { PhotoField } from "@/components/builder/PhotoField";
import { TextField } from "@/components/ui/Field";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";
import { compose, email, phone, required, url } from "@/lib/resume/validation";
import type { PersonalInfo } from "@/types/resume";

export function PersonalSection() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const { personal } = resume;
  const f = t.builder.fields;

  const set = (field: keyof PersonalInfo) => (value: string) =>
    dispatch({ type: "SET_PERSONAL", field, value });

  return (
    <SectionCard title={t.builder.sections.personal} defaultOpen>
      <div className="space-y-5">
        <PhotoField />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={f.fullName}
            placeholder={f.fullNamePh}
            value={personal.fullName}
            onChange={set("fullName")}
            validate={required}
            required
            autoComplete="name"
            className="sm:col-span-2"
          />
          <TextField
            label={f.jobTitle}
            placeholder={f.jobTitlePh}
            value={personal.jobTitle}
            onChange={set("jobTitle")}
            className="sm:col-span-2"
          />
          <TextField
            label={f.email}
            placeholder={f.emailPh}
            type="email"
            autoComplete="email"
            value={personal.email}
            onChange={set("email")}
            validate={compose(required, email)}
            required
          />
          <TextField
            label={f.phone}
            placeholder={f.phonePh}
            type="tel"
            autoComplete="tel"
            value={personal.phone}
            onChange={set("phone")}
            validate={phone}
          />
          <TextField
            label={f.location}
            placeholder={f.locationPh}
            value={personal.location}
            onChange={set("location")}
            autoComplete="address-level2"
          />
          <TextField
            label={f.website}
            placeholder={f.websitePh}
            type="url"
            value={personal.website}
            onChange={set("website")}
            validate={url}
          />
        </div>
      </div>
    </SectionCard>
  );
}
