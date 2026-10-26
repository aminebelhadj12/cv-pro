import type { AccentId, LanguageLevel, TemplateId } from "@/types/resume";

export const TEMPLATE_IDS: readonly TemplateId[] = [
  "classic",
  "modern",
  "creative",
];

export const ACCENT_IDS: readonly AccentId[] = [
  "blue",
  "emerald",
  "violet",
  "rose",
  "amber",
  "slate",
];

export const LANGUAGE_LEVELS: readonly LanguageLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "fluent",
  "native",
];
