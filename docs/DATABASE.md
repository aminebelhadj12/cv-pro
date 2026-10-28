# Base de données CV Pro (Supabase)

## Ce que crée la migration

Fichier : `supabase/migrations/20261027120000_profiles_and_resumes.sql`

| Élément | Rôle |
|---|---|
| `public.profiles` | Une ligne par compte : nom affiché. Créée automatiquement à l'inscription. |
| `public.resumes` | Les CV enregistrés : `id`, `user_id`, `title`, `template`, `content` (JSON), dates. |
| RLS activée sur les deux tables | Chaque utilisateur ne voit et ne modifie que **ses** lignes. |
| `is_email_verified()` | Deuxième verrou : les CV ne sont accessibles qu'avec une adresse e-mail confirmée (lue dans `auth.users`, jamais dans `user_metadata`, que l'utilisateur peut modifier). |
| Limites | 20 CV par compte, 1,5 Mo par CV, titre 120 caractères, modèle parmi `classic`, `modern`, `creative`. |
| Droits minimaux | Le navigateur ne peut modifier que `title`, `template`, `content` (et `full_name` du profil). Il ne peut pas changer `user_id`, `id`, `created_at`, `updated_at`. |
| Visiteurs non connectés | Aucun accès aux tables. |

La clé `service_role` n'est **jamais** utilisée par l'application.

## 1. Exécuter la migration

1. Supabase > **SQL Editor** > **New query**.
2. Ouvrez le fichier de migration, copiez **tout** son contenu, collez-le, cliquez **Run**.
3. Résultat attendu : `Success. No rows returned`.
4. **Table Editor** : `profiles` et `resumes` apparaissent avec le cadenas « RLS enabled ».

Si vous voyez `relation "profiles" already exists`, la migration est déjà appliquée : ne la relancez pas.

### Repartir de zéro (projet de DÉVELOPPEMENT uniquement)

Cela **supprime tous les CV et profils**. Ne jamais l'exécuter en production.

```sql
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.resumes cascade;
drop table if exists public.profiles cascade;
drop function if exists public.handle_new_user(), public.set_updated_at(),
  public.enforce_resume_limit(), public.is_email_verified();
```

Puis relancez la migration.

## 2. Auto-test de sécurité (en SQL, 1 minute)

Fichier : `supabase/tests/rls_policies.test.sql`

1. **SQL Editor > New query**, collez **tout** le fichier, **Run**.
2. Supabase peut demander une confirmation car le script contient des `DELETE` : confirmez. Tout est annulé à la fin.
3. Résultat attendu : une **erreur volontaire** dont le message commence par :

   ```
   RLS_TESTS_OK: 50 checks passed.
   ```

   C'est normal : le script se termine par une erreur pour **annuler** les 4 utilisateurs de test qu'il a créés. Rien ne reste dans votre base.
4. Un message qui commence par `FAILED` signifie qu'une règle est incorrecte : envoyez-moi le message complet.
5. Si le script échoue dès le début en créant les utilisateurs de test (`insert into auth.users`), utilisez la section 3 à la place.

Ce que le script vérifie, en jouant successivement 3 utilisateurs et un visiteur : lecture, création, modification et suppression de ses propres CV ; interdiction de toucher aux CV d'un autre (y compris `DELETE` et `UPDATE` sans `WHERE`) ; impossibilité de changer le propriétaire ou les dates ; utilisateur dont l'e-mail n'est pas confirmé bloqué ; visiteur anonyme bloqué ; limite de 20 CV ; suppression en cascade avec le compte.

## 3. Test avec de vrais comptes (via l'API publique)

Ce test passe par le même chemin que le futur site (clé publique + connexion), avec deux vrais comptes.

### a. Créer les comptes de test

Supabase > **Authentication > Users > Add user > Create new user** :

| Compte | E-mail (exemples) | Mot de passe | « Auto Confirm User » |
|---|---|---|---|
| A | `cvpro-test-a@example.com` | un mot de passe fort | **coché** |
| B | `cvpro-test-b@example.com` | un autre | **coché** |
| C (facultatif) | `cvpro-test-c@example.com` | un autre | **décoché** |

Le compte C, non confirmé, sert à vérifier qu'il ne peut pas se connecter.

### b. Créer `.env.test.local`

À la racine du projet :

```bash
notepad .env.test.local
```

```
TEST_USER_A_EMAIL=cvpro-test-a@example.com
TEST_USER_A_PASSWORD=...
TEST_USER_B_EMAIL=cvpro-test-b@example.com
TEST_USER_B_PASSWORD=...
TEST_USER_C_EMAIL=cvpro-test-c@example.com
TEST_USER_C_PASSWORD=...
```

Ce fichier est ignoré par Git (`.env*`). Ne le partagez pas.

### c. Lancer

```bash
npm run test:rls-live
```

Chaque ligne doit afficher `[OK]`, avec `0 failed` à la fin. Le test crée un seul CV, puis le supprime.

### d. Nettoyer

Supabase > **Authentication > Users** : supprimez les comptes de test quand vous avez fini.

## 4. Vérification supplémentaire dans le tableau de bord

**Advisors > Security** (ou « Security Advisor ») : il ne doit signaler aucune table sans RLS.
