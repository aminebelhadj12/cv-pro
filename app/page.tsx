import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TemplatesShowcase } from "@/components/landing/TemplatesShowcase";
import { SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CV Pro",
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  inLanguage: ["fr", "ar", "en"],
  description:
    "Créateur de CV gratuit en ligne : modèles professionnels, aperçu en direct et export PDF, sans compte.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TemplatesShowcase />
      <HowItWorks />
      <Features />
      <FinalCta />
    </>
  );
}
