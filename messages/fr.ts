import { builderFr } from "./builder/fr";
export const fr = {
  common: {
    appName: "CV Pro",
  },
  header: {
    skipToContent: "Aller au contenu principal",
    homeLabel: "CV Pro, retour à l'accueil",
    languageGroupLabel: "Choisir la langue",
    navLabel: "Navigation principale",
    nav: {
      templates: "Modèles",
      howItWorks: "Comment ça marche",
      features: "Fonctionnalités",
    },
    cta: "Créer mon CV",
  },
  hero: {
    badge: "100 % gratuit · Sans compte · Sans inscription",
    title: "Créez votre CV professionnel, gratuitement",
    subtitle:
      "Remplissez vos informations, choisissez un modèle, voyez le résultat en direct et exportez votre CV en PDF. Disponible en français, en arabe et en anglais.",
    cta: "Créer mon CV",
    secondaryCta: "Voir les modèles",
    points: [
      "Aucun compte requis",
      "Données privées, gardées dans votre navigateur",
      "Export PDF au format A4",
    ],
  },
  templates: {
    title: "Des modèles pour chaque profil",
    subtitle:
      "Trois modèles distincts. Changez de modèle à tout moment sans perdre vos données.",
    useTemplate: "Utiliser ce modèle",
    items: {
      classic: {
        name: "Classique",
        tag: "Compatible ATS",
        description:
          "Mise en page sobre sur une colonne, idéale pour les candidatures en ligne et les logiciels de tri de CV.",
      },
      modern: {
        name: "Moderne",
        tag: "Équilibré",
        description:
          "Colonne latérale colorée et hiérarchie claire pour un rendu contemporain et professionnel.",
      },
      creative: {
        name: "Créatif",
        tag: "Original",
        description:
          "Un design plus marqué avec un en-tête coloré et des compétences en pastilles, tout en restant lisible.",
      },
    },
  },
  how: {
    title: "Comment ça marche",
    subtitle: "Trois étapes simples, quelques minutes suffisent.",
    steps: [
      {
        title: "Remplissez vos informations",
        description:
          "Expériences, formations, compétences, langues : le formulaire vous guide section par section.",
      },
      {
        title: "Choisissez un modèle",
        description:
          "Changez de modèle et de couleur d'accent, et voyez l'aperçu A4 se mettre à jour en direct.",
      },
      {
        title: "Exportez en PDF",
        description:
          "Exportez votre CV au format A4, prêt à être envoyé. Gratuit, sans filigrane.",
      },
    ],
  },
  features: {
    title: "Tout ce qu'il faut, rien de superflu",
    subtitle: "Un outil simple, rapide et respectueux de votre vie privée.",
    items: [
      {
        title: "Vraiment gratuit",
        description:
          "Pas d'abonnement, pas de version payante, pas de compte à créer.",
      },
      {
        title: "Vie privée respectée",
        description:
          "Votre CV reste dans votre navigateur. Aucune donnée personnelle n'est envoyée à un serveur.",
      },
      {
        title: "Français, arabe, anglais",
        description:
          "Interface et CV en trois langues, avec prise en charge de l'écriture de droite à gauche.",
      },
      {
        title: "Aperçu en direct",
        description:
          "Chaque modification apparaît immédiatement sur une page A4 fidèle au résultat final.",
      },
      {
        title: "Modèles personnalisables",
        description:
          "Trois modèles et plusieurs couleurs d'accent pour adapter le design à votre profil.",
      },
      {
        title: "Export PDF au format A4",
        description:
          "Un PDF net, avec du texte sélectionnable, prêt pour l'impression ou l'envoi par e-mail.",
      },
    ],
  },
  finalCta: {
    title: "Prêt à créer votre CV ?",
    subtitle: "Cela ne prend que quelques minutes, et c'est gratuit.",
    button: "Créer mon CV",
  },
  builder: builderFr,
  footer: {
    navLabel: "Navigation du pied de page",
    tagline:
      "Créez gratuitement un CV professionnel, sans compte ni inscription.",
    privacy:
      "Vos données restent dans votre navigateur. Rien n'est envoyé à un serveur.",
    rights: "Tous droits réservés.",
  },
};

export type Messages = typeof fr;
