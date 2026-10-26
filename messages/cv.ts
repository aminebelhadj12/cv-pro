import type { Locale } from "@/types/i18n";

/** Labels printed ON the CV. They follow the CV language, not the interface language. */
export interface CvLabels {
  present: string;
  contact: string;
  sections: {
    summary: string;
    experience: string;
    education: string;
    skills: string;
    languages: string;
    certifications: string;
    projects: string;
    links: string;
  };
}

export const CV_LABELS: Record<Locale, CvLabels> = {
  fr: {
    present: "Présent",
    contact: "Contact",
    sections: {
      summary: "Profil",
      experience: "Expérience professionnelle",
      education: "Formation",
      skills: "Compétences",
      languages: "Langues",
      certifications: "Certifications",
      projects: "Projets",
      links: "Liens",
    },
  },
  en: {
    present: "Present",
    contact: "Contact",
    sections: {
      summary: "Profile",
      experience: "Work experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      certifications: "Certifications",
      projects: "Projects",
      links: "Links",
    },
  },
  ar: {
    present: "حتى الآن",
    contact: "التواصل",
    sections: {
      summary: "نبذة مهنية",
      experience: "الخبرة المهنية",
      education: "التعليم",
      skills: "المهارات",
      languages: "اللغات",
      certifications: "الشهادات",
      projects: "المشاريع",
      links: "الروابط",
    },
  },
};
