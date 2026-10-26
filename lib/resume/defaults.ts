import type { Locale } from "@/types/i18n";
import type { ListItemMap, ListKey, ResumeData } from "@/types/resume";

export function createInitialResume(cvLocale: Locale = "fr"): ResumeData {
  return {
    version: 1,
    cvLocale,
    template: "classic",
    accent: "blue",
    personal: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      photo: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    links: [],
  };
}

const FACTORIES: { [K in ListKey]: (id: string) => ListItemMap[K] } = {
  experience: (id) => ({
    id,
    position: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  }),
  education: (id) => ({
    id,
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  }),
  skills: (id) => ({ id, name: "" }),
  languages: (id) => ({ id, name: "", level: "intermediate" }),
  certifications: (id) => ({ id, name: "", issuer: "", date: "" }),
  projects: (id) => ({ id, name: "", url: "", description: "" }),
  links: (id) => ({ id, label: "", url: "" }),
};

export function createEmptyItem<K extends ListKey>(
  key: K,
  id: string,
): ListItemMap[K] {
  return FACTORIES[key](id);
}
