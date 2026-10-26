import { LOCALE_DIR } from "@/lib/i18n/config";
import { ACCENTS, type AccentColors } from "@/lib/resume/accents";
import { LANGUAGE_LEVELS } from "@/lib/resume/constants";
import {
  displayUrl,
  formatMonth,
  formatPeriod,
  toHref,
} from "@/lib/resume/format";
import { dictionaries } from "@/messages";
import { CV_LABELS, type CvLabels } from "@/messages/cv";
import type { Direction, Locale } from "@/types/i18n";
import type { LanguageLevel, ResumeData } from "@/types/resume";

export type ContactKind = "email" | "phone" | "location" | "website";

export interface ContactEntry {
  kind: ContactKind;
  text: string;
  href?: string;
}

export interface EntryView {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  period: string;
  description: string;
}

export interface PreparedResume {
  dir: Direction;
  lang: Locale;
  fontClass: string;
  /** Arabic joins letters, so uppercase/letter-spacing must be disabled there. */
  headingClass: string;
  labels: CvLabels;
  accent: AccentColors;
  name: string;
  jobTitle: string;
  photo: string;
  contacts: ContactEntry[];
  links: { id: string; label: string; text: string; href: string }[];
  summary: string;
  experience: EntryView[];
  education: EntryView[];
  skills: string[];
  languages: {
    id: string;
    name: string;
    levelLabel: string;
    /** 1 to 5, for the level dots. */
    levelIndex: number;
  }[];
  certifications: { id: string; name: string; issuer: string; date: string }[];
  projects: {
    id: string;
    name: string;
    url: string;
    href: string;
    description: string;
  }[];
}

const clean = (value: string) => value.trim();

function levelIndex(level: LanguageLevel): number {
  return LANGUAGE_LEVELS.indexOf(level) + 1;
}

/** Turns raw editor data into display-ready data: empty entries removed, dates formatted, labels in the CV language. */
export function prepareResume(resume: ResumeData): PreparedResume {
  const lang = resume.cvLocale;
  const dir = LOCALE_DIR[lang];
  const labels = CV_LABELS[lang];
  const levels = dictionaries[lang].builder.levels;
  const p = resume.personal;

  const contacts: ContactEntry[] = [];
  if (clean(p.email))
    contacts.push({ kind: "email", text: clean(p.email), href: `mailto:${clean(p.email)}` });
  if (clean(p.phone))
    contacts.push({
      kind: "phone",
      text: clean(p.phone),
      href: `tel:${clean(p.phone).replace(/[^\d+]/g, "")}`,
    });
  if (clean(p.location))
    contacts.push({ kind: "location", text: clean(p.location) });
  if (clean(p.website))
    contacts.push({
      kind: "website",
      text: displayUrl(p.website),
      href: toHref(p.website),
    });

  const entry = (
    item: {
      id: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    },
    main: string,
    secondary: string,
  ): EntryView => ({
    id: item.id,
    title: clean(main) || clean(secondary),
    subtitle: clean(main) ? clean(secondary) : "",
    location: clean(item.location),
    period: formatPeriod(
      item.startDate,
      item.endDate,
      item.current,
      lang,
      labels.present,
    ),
    description: clean(item.description),
  });

  const hasEntry = (e: EntryView) => Boolean(e.title || e.description);

  return {
    dir,
    lang,
    fontClass: dir === "rtl" ? "cv-font-arabic" : "cv-font-latin",
    headingClass: dir === "rtl" ? "" : "uppercase tracking-wider",
    labels,
    accent: ACCENTS[resume.accent],
    name: clean(p.fullName),
    jobTitle: clean(p.jobTitle),
    photo: p.photo,
    contacts,
    links: resume.links
      .filter((l) => clean(l.url))
      .map((l) => ({
        id: l.id,
        label: clean(l.label),
        text: displayUrl(l.url),
        href: toHref(l.url),
      })),
    summary: clean(resume.summary),
    experience: resume.experience
      .map((i) => entry(i, i.position, i.company))
      .filter(hasEntry),
    education: resume.education
      .map((i) => entry(i, i.degree, i.institution))
      .filter(hasEntry),
    skills: resume.skills.map((s) => clean(s.name)).filter(Boolean),
    languages: resume.languages
      .filter((l) => clean(l.name))
      .map((l) => ({
        id: l.id,
        name: clean(l.name),
        levelLabel: levels[l.level],
        levelIndex: levelIndex(l.level),
      })),
    certifications: resume.certifications
      .filter((c) => clean(c.name))
      .map((c) => ({
        id: c.id,
        name: clean(c.name),
        issuer: clean(c.issuer),
        date: formatMonth(c.date, lang),
      })),
    projects: resume.projects
      .filter((pr) => clean(pr.name) || clean(pr.description))
      .map((pr) => ({
        id: pr.id,
        name: clean(pr.name),
        url: displayUrl(pr.url),
        href: toHref(pr.url),
        description: clean(pr.description),
      })),
  };
}

export function isPreparedEmpty(p: PreparedResume): boolean {
  return (
    !p.name &&
    !p.jobTitle &&
    !p.photo &&
    !p.summary &&
    p.contacts.length === 0 &&
    p.links.length === 0 &&
    p.experience.length === 0 &&
    p.education.length === 0 &&
    p.skills.length === 0 &&
    p.languages.length === 0 &&
    p.certifications.length === 0 &&
    p.projects.length === 0
  );
}
