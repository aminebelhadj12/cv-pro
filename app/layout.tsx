import type { Metadata, Viewport } from "next";
import { Cairo, Inter, Noto_Naskh_Arabic } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

// Used only for the text of Arabic CVs (see .cv-font-arabic in globals.css).
const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
});

const TITLE = "CV Pro — Créateur de CV gratuit en ligne";
const DESCRIPTION =
  "Créez gratuitement un CV professionnel en ligne, personnalisez le design et téléchargez-le en PDF. Sans compte, sans inscription. Disponible en français, arabe et anglais.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | CV Pro",
  },
  description: DESCRIPTION,
  applicationName: "CV Pro",
  keywords: [
    "CV gratuit",
    "créateur de CV",
    "modèle de CV",
    "السيرة الذاتية",
    "free resume builder",
    "Maroc",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "CV Pro",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "fr_FR",
    alternateLocale: ["ar_MA", "en_US"],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cairo.variable} ${naskh.variable} flex min-h-screen flex-col font-sans`}
      >
        <LanguageProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
