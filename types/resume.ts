import type { Locale } from "./i18n";

export type TemplateId = "classic" | "modern" | "creative";
export type AccentId =
  | "blue"
  | "emerald"
  | "violet"
  | "rose"
  | "amber"
  | "slate";
export type LanguageLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "fluent"
  | "native";

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  /** City / country, free text. */
  location: string;
  /** Portfolio or personal website. */
  website: string;
  /** Square JPEG data URL, or "" when there is no photo. */
  photo: string;
}

export interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  location: string;
  /** "YYYY-MM" or "". */
  startDate: string;
  /** "YYYY-MM" or "" (empty when `current` is true). */
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  /** "YYYY-MM" or "". */
  date: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

/** Maps every repeatable section to its item type. */
export interface ListItemMap {
  experience: ExperienceItem;
  education: EducationItem;
  skills: SkillItem;
  languages: LanguageItem;
  certifications: CertificationItem;
  projects: ProjectItem;
  links: LinkItem;
}

export type ListKey = keyof ListItemMap;

export interface ResumeData {
  /** Schema version, used later to migrate saved drafts. */
  version: 1;
  /** Language (and text direction) of the CV content, independent of the UI language. */
  cvLocale: Locale;
  template: TemplateId;
  accent: AccentId;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  links: LinkItem[];
}
