import { builderEn } from "./builder/en";
import type { Messages } from "./fr";

export const en: Messages = {
  common: {
    appName: "CV Pro",
  },
  header: {
    skipToContent: "Skip to main content",
    homeLabel: "CV Pro, back to home",
    languageGroupLabel: "Choose language",
    navLabel: "Main navigation",
    nav: {
      templates: "Templates",
      howItWorks: "How it works",
      features: "Features",
    },
    cta: "Create my CV",
  },
  hero: {
    badge: "100% free · No account · No sign-up",
    title: "Create your professional CV, for free",
    subtitle:
      "Fill in your details, pick a template, see the result live and export your CV as a PDF. Available in French, Arabic and English.",
    cta: "Create my CV",
    secondaryCta: "Browse templates",
    points: [
      "No account required",
      "Private data, kept in your browser",
      "A4 PDF export",
    ],
  },
  templates: {
    title: "Templates for every profile",
    subtitle:
      "Three distinct templates. Switch templates at any time without losing your data.",
    useTemplate: "Use this template",
    items: {
      classic: {
        name: "Classic",
        tag: "ATS-friendly",
        description:
          "A clean single-column layout, ideal for online applications and résumé-screening software.",
      },
      modern: {
        name: "Modern",
        tag: "Balanced",
        description:
          "A coloured side column and clear hierarchy for a contemporary, professional look.",
      },
      creative: {
        name: "Creative",
        tag: "Distinctive",
        description:
          "A bolder design with a coloured header and skill chips, while staying easy to read.",
      },
    },
  },
  how: {
    title: "How it works",
    subtitle: "Three simple steps, just a few minutes.",
    steps: [
      {
        title: "Fill in your details",
        description:
          "Experience, education, skills, languages: the form guides you section by section.",
      },
      {
        title: "Choose a template",
        description:
          "Switch templates and accent colours, and watch the A4 preview update live.",
      },
      {
        title: "Export as PDF",
        description:
          "Export your CV in A4 format, ready to send. Free, no watermark.",
      },
    ],
  },
  features: {
    title: "Everything you need, nothing you don't",
    subtitle: "A simple, fast tool that respects your privacy.",
    items: [
      {
        title: "Truly free",
        description: "No subscription, no paid tier, no account to create.",
      },
      {
        title: "Your privacy respected",
        description:
          "Your CV stays in your browser. No personal data is sent to a server.",
      },
      {
        title: "French, Arabic, English",
        description:
          "Interface and CV in three languages, with right-to-left writing support.",
      },
      {
        title: "Live preview",
        description:
          "Every change shows instantly on an A4 page that matches the final result.",
      },
      {
        title: "Customisable templates",
        description:
          "Three templates and several accent colours to fit the design to your profile.",
      },
      {
        title: "A4 PDF export",
        description:
          "A crisp PDF with selectable text, ready to print or send by email.",
      },
    ],
  },
  finalCta: {
    title: "Ready to create your CV?",
    subtitle: "It only takes a few minutes, and it's free.",
    button: "Create my CV",
  },
  builder: builderEn,
  footer: {
    navLabel: "Footer navigation",
    tagline: "Create a professional CV for free, with no account or sign-up.",
    privacy: "Your data stays in your browser. Nothing is sent to a server.",
    rights: "All rights reserved.",
  },
};
