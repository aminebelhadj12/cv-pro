import type { Metadata } from "next";
import { BuilderShell } from "@/components/builder/BuilderShell";
import { ResumeProvider } from "@/lib/resume/ResumeProvider";

export const metadata: Metadata = {
  title: "Créer mon CV",
  description:
    "Éditeur de CV gratuit : remplissez vos informations, choisissez un modèle et exportez en PDF.",
  alternates: { canonical: "/builder" },
};

export default function BuilderPage() {
  return (
    <ResumeProvider>
      <BuilderShell />
    </ResumeProvider>
  );
}
