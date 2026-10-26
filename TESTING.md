# CV Pro : checklist de tests manuels

À faire avant chaque mise en ligne. Cochez chaque ligne dans **FR**, **AR** et **EN**
(changez la langue avec le sélecteur de l'en-tête).

## 0. Vérifications automatiques

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run start      # puis ouvrir http://localhost:3000
```

- [ ] Les 3 commandes se terminent sans erreur ni avertissement.
- [ ] La console du navigateur (F12) ne montre aucune erreur rouge.

## 1. Page d'accueil (`/`)

- [ ] Le titre, le bouton « Créer mon CV » et les 3 modèles s'affichent.
- [ ] Les liens de l'en-tête et du pied de page défilent vers la bonne section.
- [ ] « Créer mon CV » ouvre `/builder`.
- [ ] « Utiliser ce modèle » ouvre `/builder` avec ce modèle déjà sélectionné.
- [ ] En arabe : la mise en page est inversée (RTL) et les flèches pointent vers la gauche.
- [ ] Largeur mobile (375 px) : pas de défilement horizontal, les cartes sont empilées.

## 2. Éditeur (`/builder`)

- [ ] Nom : l'aperçu se met à jour immédiatement.
- [ ] E-mail invalide (`abc`) : message d'erreur après avoir quitté le champ ; valide : l'erreur disparaît.
- [ ] Téléphone et site web invalides : message d'erreur.
- [ ] Photo : une image JPG/PNG apparaît ronde ; un PDF ou un fichier texte affiche une erreur.
- [ ] Expérience : « Ajouter » place le curseur dans le premier champ ; monter, descendre et supprimer fonctionnent.
- [ ] « Poste actuel » désactive la date de fin ; date de fin avant la date de début : erreur.
- [ ] Compétences, langues (avec niveau), certifications, projets et liens : ajouter, modifier, supprimer.
- [ ] Un texte sur plusieurs lignes dans « Missions » devient une liste à puces dans le CV.

## 3. Aperçu et modèles

- [ ] Les 3 modèles sont visiblement différents (Classique, Moderne, Créatif).
- [ ] Changer de modèle ou de couleur ne supprime aucune donnée.
- [ ] « Langue du CV » = arabe : le CV passe en RTL, titres de sections en arabe, police naskh.
- [ ] La langue de l'interface peut rester différente de la langue du CV.
- [ ] Un CV très long affiche des traits pointillés (sauts de page approximatifs).
- [ ] Mobile : les onglets « Édition / Aperçu » fonctionnent.

## 4. Export PDF

- [ ] Le bouton est désactivé tant que le CV est vide.
- [ ] Clic : la fenêtre d'impression s'ouvre ; destination « Enregistrer au format PDF ».
- [ ] Nom de fichier proposé : `Prénom_Nom_CV` (en arabe : `الاسم_CV`).
- [ ] Format A4, marges « Par défaut » ou « Aucune », en-têtes et pieds de page décochés.
- [ ] Les couleurs (colonne latérale, bandeau) sont présentes ; sinon cocher « Graphiques d'arrière-plan ».
- [ ] CV de 2 pages ou plus : chaque page a une marge en haut et en bas, rien n'est coupé.
- [ ] Le texte du PDF est sélectionnable ; les liens sont cliquables.
- [ ] Arabe : lettres liées, sens droite-gauche, numéro de téléphone lisible.
- [ ] À tester sur Chrome, Edge, Firefox et, si possible, Safari.

## 5. Brouillon local

- [ ] Saisir des données puis actualiser (F5) : tout est restauré, « Brouillon restauré » s'affiche.
- [ ] Fermer l'onglet puis le rouvrir : les données sont toujours là.
- [ ] « Nouveau CV » → « Annuler » (ou Échap) : rien n'est supprimé.
- [ ] « Nouveau CV » → « Effacer et recommencer » : formulaire vide, et il reste vide après F5.
- [ ] F12 → Application → Local Storage → `cvpro:draft:v1` : remplacer la valeur par du texte invalide, actualiser : message « illisible », formulaire vide, aucune erreur.
- [ ] Navigation privée ou stockage bloqué : l'éditeur fonctionne et un avertissement s'affiche.
- [ ] F12 → Réseau : aucune requête n'envoie les données du CV.

## 6. Accessibilité

- [ ] Clavier seul (Tab, Maj+Tab, Espace, Entrée, Échap) : tout est atteignable, le focus est toujours visible.
- [ ] Le premier Tab affiche « Aller au contenu principal » et il fonctionne.
- [ ] La boîte « Nouveau CV » garde le focus à l'intérieur et se ferme avec Échap.
- [ ] Zoom du navigateur à 200 % : rien n'est coupé.
- [ ] Lecteur d'écran (NVDA, VoiceOver ou TalkBack) : les champs, erreurs et boutons sont annoncés.
- [ ] Réglage système « réduire les animations » : plus d'animation ni de défilement fluide.
