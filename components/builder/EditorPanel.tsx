"use client";

import { CertificationsSection } from "./sections/CertificationsSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { LanguagesSection } from "./sections/LanguagesSection";
import { LinksSection } from "./sections/LinksSection";
import { PersonalSection } from "./sections/PersonalSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SettingsSection } from "./sections/SettingsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { SummarySection } from "./sections/SummarySection";

export function EditorPanel() {
  return (
    <div className="space-y-4">
      <SettingsSection />
      <PersonalSection />
      <SummarySection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <LanguagesSection />
      <CertificationsSection />
      <ProjectsSection />
      <LinksSection />
    </div>
  );
}
