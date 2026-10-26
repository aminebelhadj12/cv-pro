# CV Pro

Créateur de CV gratuit en ligne, pour le Maroc et le reste du monde.
Remplissez vos informations, choisissez un modèle, voyez le résultat en direct et exportez en PDF.
**Sans compte, sans base de données, sans serveur de stockage** : tout reste dans votre navigateur.

- 3 langues : français (par défaut), arabe (RTL complet) et anglais
- 3 modèles : Classique (compatible ATS), Moderne, Créatif, avec 6 couleurs d'accent
- Aperçu A4 en direct, onglets Édition / Aperçu sur mobile
- Export PDF A4 via l'impression native du navigateur (texte sélectionnable)
- Brouillon enregistré automatiquement dans `localStorage`

## Technologies

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, lucide-react, ESLint.
Aucune autre dépendance : pas de base de données, pas d'authentification, pas de bibliothèque PDF.

## Démarrer en local

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (télécharge les polices Google au build) |
| `npm run start` | sert le build de production |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | vérification des types |

Avant chaque mise en ligne, suivez `TESTING.md`.

## Variables d'environnement

**Aucune n'est obligatoire.**

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | (facultative) URL publique du site, par ex. `https://cvpro.ma`. Sert aux liens canoniques, au sitemap, à `robots.txt` et à Open Graph. |

Ordre de priorité de l'URL du site : `NEXT_PUBLIC_SITE_URL`, puis `VERCEL_PROJECT_PRODUCTION_URL` (fournie automatiquement par Vercel), puis `http://localhost:3000`.
Une variable est lue **au build** : après l'avoir modifiée sur Vercel, relancez un déploiement.

## Déployer sur Vercel

1. Poussez le projet sur GitHub.
2. Sur vercel.com : **Add New → Project**, importez le dépôt. Next.js est détecté automatiquement : gardez les réglages par défaut et cliquez **Deploy**.
3. (Facultatif) Avec un nom de domaine : **Settings → Domains**, ajoutez-le, puis **Settings → Environment Variables** : `NEXT_PUBLIC_SITE_URL=https://votre-domaine` et **Redeploy**.

Note : le plan gratuit **Hobby** de Vercel est réservé à un usage personnel et non commercial.
Si vous ajoutez de la publicité, des paiements ou un usage commercial, passez au plan Pro ou choisissez un autre hébergeur.

## Structure du projet

```
app/                  pages (accueil, /builder), sitemap, robots, styles globaux
components/
  builder/            éditeur, sections, aperçu, export, brouillon
  landing/            sections de la page d'accueil
  layout/             en-tête, pied de page, sélecteur de langue
  resume/             feuille A4, 3 modèles, mise en forme des données
  ui/                 boutons, champs, boîte de dialogue
lib/
  i18n/               langue de l'interface (contexte React)
  resume/             modèle de données, reducer, validation, persistance
  print.ts            export PDF (impression) et nom de fichier
  storage.ts          accès sûr à localStorage
messages/             traductions fr / ar / en
types/                types TypeScript
```

## Confidentialité

Les données du CV ne quittent jamais le navigateur : elles sont enregistrées dans `localStorage`
(clé `cvpro:draft:v1`) et le PDF est généré localement. « Nouveau CV » supprime le brouillon.

## Limites connues

- L'export utilise la fenêtre d'impression du navigateur (choisir « Enregistrer au format PDF »).
  C'est fiable sur ordinateur (Chrome, Edge, Firefox) et moins sur téléphone.
- Les sauts de page ne coupent pas une expérience en deux : une entrée très longue peut laisser un espace en bas de page.
- Si le CV est ouvert dans deux onglets, la dernière modification enregistrée l'emporte.
- Une seule URL pour les trois langues : la langue de l'interface est choisie dans l'en-tête (pas d'URL `/ar` ou `/en`).
