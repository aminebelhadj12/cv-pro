import { isLocale } from "@/lib/i18n/config";
import { storageGet, storageRemove, storageSet } from "@/lib/storage";
import type { ResumeData } from "@/types/resume";
import { ACCENT_IDS, LANGUAGE_LEVELS, TEMPLATE_IDS } from "./constants";
import { createInitialResume } from "./defaults";
import { createId } from "./id";

export const DRAFT_KEY = "cvpro:draft:v1";

export type LoadResult =
  | { status: "none" }
  | { status: "restored"; data: ResumeData; savedAt: number | null }
  | { status: "corrupted" }
  | { status: "unavailable" };

export type SaveResult = "saved" | "quota" | "unavailable" | "error";

/* ------------------------------------------------------------------ sanitising */

const MAX_ITEMS = 50;
const MAX_PHOTO_CHARS = 2_000_000;
const SAFE_ID = /^[\w-]{1,100}$/;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,/;

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const str = (value: unknown, max = 500): string =>
  typeof value === "string" ? value.slice(0, max) : "";

const month = (value: unknown): string => {
  const s = str(value, 7);
  return MONTH_RE.test(s) ? s : "";
};

function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function list<T extends { id: string }>(
  raw: unknown,
  build: (item: Obj, id: string) => T,
): T[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of raw.slice(0, MAX_ITEMS)) {
    if (!isObj(item)) continue;
    let id = typeof item.id === "string" && SAFE_ID.test(item.id) ? item.id : createId();
    if (seen.has(id)) id = createId();
    seen.add(id);
    out.push(build(item, id));
  }
  return out;
}

/**
 * Turns untrusted data (from localStorage) into a valid ResumeData.
 * Never throws: unknown or wrong-typed fields are dropped or replaced by defaults.
 */
export function sanitizeResume(input: unknown): ResumeData | null {
  if (!isObj(input) || input.version !== 1) return null;

  const base = createInitialResume();
  const p = isObj(input.personal) ? input.personal : {};
  const photo =
    typeof p.photo === "string" &&
    p.photo.length <= MAX_PHOTO_CHARS &&
    PHOTO_RE.test(p.photo)
      ? p.photo
      : "";

  return {
    version: 1,
    cvLocale: isLocale(input.cvLocale) ? input.cvLocale : base.cvLocale,
    template: oneOf(input.template, TEMPLATE_IDS, base.template),
    accent: oneOf(input.accent, ACCENT_IDS, base.accent),
    personal: {
      fullName: str(p.fullName, 120),
      jobTitle: str(p.jobTitle, 160),
      email: str(p.email, 200),
      phone: str(p.phone, 50),
      location: str(p.location, 200),
      website: str(p.website, 300),
      photo,
    },
    summary: str(input.summary, 5000),
    experience: list(input.experience, (o, id) => ({
      id,
      position: str(o.position, 200),
      company: str(o.company, 200),
      location: str(o.location, 200),
      startDate: month(o.startDate),
      endDate: o.current === true ? "" : month(o.endDate),
      current: o.current === true,
      description: str(o.description, 3000),
    })),
    education: list(input.education, (o, id) => ({
      id,
      degree: str(o.degree, 200),
      institution: str(o.institution, 200),
      location: str(o.location, 200),
      startDate: month(o.startDate),
      endDate: o.current === true ? "" : month(o.endDate),
      current: o.current === true,
      description: str(o.description, 2000),
    })),
    skills: list(input.skills, (o, id) => ({ id, name: str(o.name, 100) })),
    languages: list(input.languages, (o, id) => ({
      id,
      name: str(o.name, 100),
      level: oneOf(o.level, LANGUAGE_LEVELS, "intermediate"),
    })),
    certifications: list(input.certifications, (o, id) => ({
      id,
      name: str(o.name, 200),
      issuer: str(o.issuer, 200),
      date: month(o.date),
    })),
    projects: list(input.projects, (o, id) => ({
      id,
      name: str(o.name, 200),
      url: str(o.url, 300),
      description: str(o.description, 2000),
    })),
    links: list(input.links, (o, id) => ({
      id,
      label: str(o.label, 100),
      url: str(o.url, 300),
    })),
  };
}

/* ------------------------------------------------------------------ draft I/O */

export function serializeDraft(resume: ResumeData, savedAt = Date.now()): string {
  return JSON.stringify({ version: 1, savedAt, data: resume });
}

export function parseDraft(
  raw: string,
): { data: ResumeData; savedAt: number | null } | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isObj(parsed) || parsed.version !== 1) return null;
    const data = sanitizeResume(parsed.data);
    if (!data) return null;
    const savedAt =
      typeof parsed.savedAt === "number" && Number.isFinite(parsed.savedAt)
        ? parsed.savedAt
        : null;
    return { data, savedAt };
  } catch {
    return null;
  }
}

export function loadDraft(): LoadResult {
  const read = storageGet(DRAFT_KEY);
  if (!read.ok) {
    return read.reason === "unavailable"
      ? { status: "unavailable" }
      : { status: "corrupted" };
  }
  if (read.value === null) return { status: "none" };

  const parsed = parseDraft(read.value);
  if (!parsed) {
    storageRemove(DRAFT_KEY); // never keep an unreadable draft around
    return { status: "corrupted" };
  }
  return { status: "restored", ...parsed };
}

export function saveDraft(resume: ResumeData): SaveResult {
  const result = storageSet(DRAFT_KEY, serializeDraft(resume));
  return result.ok ? "saved" : result.reason;
}

export function clearStoredDraft(): void {
  storageRemove(DRAFT_KEY);
}

/** True when the resume is identical to a brand-new one (nothing worth saving). */
export function isPristine(resume: ResumeData): boolean {
  return JSON.stringify(resume) === JSON.stringify(createInitialResume(resume.cvLocale));
}
