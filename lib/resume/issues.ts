import type { ResumeData } from "@/types/resume";
import {
  compose,
  email,
  endAfter,
  month,
  phone,
  required,
  url,
} from "./validation";

export type ResumeIssue =
  | "fullName"
  | "email"
  | "phone"
  | "website"
  | "links"
  | "projects"
  | "dates";

/** Non-blocking check run before export: which important fields look wrong? */
export function collectIssues(resume: ResumeData): ResumeIssue[] {
  const issues: ResumeIssue[] = [];
  const p = resume.personal;

  if (required(p.fullName)) issues.push("fullName");
  if (compose(required, email)(p.email)) issues.push("email");
  if (phone(p.phone)) issues.push("phone");
  if (url(p.website)) issues.push("website");
  if (resume.links.some((l) => url(l.url))) issues.push("links");
  if (resume.projects.some((pr) => url(pr.url))) issues.push("projects");

  const badDates = [...resume.experience, ...resume.education].some(
    (item) =>
      month(item.startDate) ||
      month(item.endDate) ||
      endAfter(item.startDate)(item.endDate),
  );
  if (badDates || resume.certifications.some((c) => month(c.date))) {
    issues.push("dates");
  }
  return issues;
}
