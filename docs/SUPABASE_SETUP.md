# Configurer Supabase pour CV Pro

CV Pro fonctionne **sans compte** : tant que les variables Supabase sont absentes, rien ne change.
Les comptes (inscription, connexion, CV enregistrés en ligne) s'activent quand le projet est configuré.

> Les noms des menus du tableau de bord Supabase peuvent légèrement changer. En cas de doute, cherchez le mot-clé.

## 1. Créer le projet

1. Créez un compte sur **supabase.com** et cliquez sur **New project**.
2. **Name** : `cv-pro` (ou `cv-pro-dev`). **Database password** : générez-en un fort et gardez-le dans un gestionnaire de mots de passe (l'application n'en a pas besoin).
3. **Region** : choisissez une région en **Europe** (la plus proche du Maroc). **Elle ne peut pas être changée après la création.**
4. Attendez la fin de la création (1 à 2 minutes).

Conseil : utilisez **un projet pour le développement** et **un autre pour la production**, pour ne pas mélanger les comptes de test et les vrais utilisateurs. Vérifiez la limite de projets de votre plan.

## 2. Récupérer l'URL et la clé publique

1. Dans le projet : bouton **Connect** (en haut), ou **Project Settings > API Keys**.
2. Copiez :
   - **Project URL** : `https://xxxxxxxx.supabase.co`
   - **Publishable key** : `sb_publishable_...`. S'il n'y en a pas, cliquez sur **Create new API keys**.
3. **Ne copiez jamais** la clé **secret** (`sb_secret_...`) ni la clé `service_role` dans l'application. CV Pro n'en a pas besoin.

## 3. Créer `.env.local`

Dans le dossier du projet :

```bash
copy .env.example .env.local
notepad .env.local
```

Remplacez les deux valeurs, puis enregistrez :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

`.env.local` est ignoré par Git. Après toute modification, **redémarrez** `npm run dev`.

## 4. Adresses de redirection

**Authentication > URL Configuration** :

- **Site URL** : `http://localhost:3000` pour le projet de développement. En production : `https://votre-domaine`.
- **Redirect URLs** (ajoutez) :
  - `http://localhost:3000/**`
  - En production : `https://votre-domaine/**`
  - Facultatif, pour les déploiements de prévisualisation Vercel : `https://*-votre-equipe.vercel.app/**`

## 5. Réglages de connexion

**Authentication > Sign In / Providers > Email** :

- **Enable email provider** : activé.
- **Confirm email** : **activé** (obligatoire : sans cela, personne n'a besoin de vérifier son adresse).
- **Allow unverified email sign-ins** : **désactivé**.
- Longueur minimale du mot de passe : 8 ou plus.

## 6. E-mails : à savoir avant de tester

Le service d'e-mail intégré de Supabase sert uniquement aux essais :

- il envoie **seulement aux adresses de votre équipe** Supabase (vous, au début) ;
- il est limité à **quelques e-mails par heure** (2 au moment de la rédaction, cette valeur peut changer) ;
- il peut empêcher de modifier les modèles d'e-mail.

Pour de vrais utilisateurs, configurez un **SMTP personnalisé** (Authentication > SMTP / Emails) avec un fournisseur (Brevo, Resend, etc.). Cela sera détaillé dans la phase « Vérification e-mail » et dans le déploiement.

## 7. Vérifier la configuration

```bash
npm run check:supabase
```

Le script contrôle les variables, la forme de la clé (il **refuse** une clé secrète), l'accès au projet, l'activation de l'e-mail et de la confirmation. Il n'envoie qu'une requête publique, avec la clé publique.

## Règles de sécurité

- Une clé **publishable** peut apparaître dans le navigateur : ce qu'elle permet est limité par les règles **RLS** de la base.
- Une clé **secret** / `service_role` contourne la sécurité : jamais dans `NEXT_PUBLIC_*`, jamais dans Git, jamais dans le navigateur.
- Si une clé secrète a fuité (commit, capture d'écran, message), **régénérez-la** immédiatement dans le tableau de bord.
