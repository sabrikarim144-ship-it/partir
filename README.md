# Partir — prototype V1

Assistant personnel de voyage en français : Next.js 15, React 19, TypeScript et Tailwind CSS 4. Interface responsive, sans authentification réelle, base de données ou appel API. Photo stockée dans le projet, aucune police distante.

## Lancer le projet

Pré-requis : Node.js 22.18+ (ou 24+) et npm.

```sh
npm ci
npm run dev
```

Ouvrir http://localhost:3000. Pour tester sur un téléphone, utiliser l’adresse IP locale de l’ordinateur sur le même réseau Wi-Fi avec le port 3000.

## Vérifier et construire

```sh
npm test
npm run typecheck
npm run build
```

La version statique prête à publier est produite dans `out/`. Comme le projet utilise `output: 'export'`, `next start` n’est pas adapté ; utiliser un serveur de fichiers statiques :

```sh
python3 -m http.server 3000 --directory out
```

## Parcours

1. Accueil → Préparer mon voyage → prénom et e-mail (simulés, aucun mot de passe).
2. Tableau de bord avec un voyage d’exemple à Lisbonne.
3. Questionnaire : destination, dates, loisir/pro/les deux, hébergement, activités.
4. Préparation locale avec transition de génération, puis espace voyage.
5. Cases interactives, progression, filtre « À préparer » et ajout d’indispensables.
6. Profil : voyager léger, notes personnelles, mémoire des objets oubliés.
7. Terminer le voyage : note, souvenir, objets oubliés séparés par des virgules.
8. Historique : séjours terminés et checklist conservée en lecture seule.
9. Les oublis sont ajoutés aux prochaines checklists.

## Données et limites du prototype

- Sauvegarde dans `localStorage`, clé `partir-v1`, sur le navigateur utilisé. La déconnexion garde les données. Il n’y a ni comptes distincts ni synchronisation entre appareils.
- Effacer les données du site dans les réglages du navigateur remet la démonstration à zéro.
- Authentification simulée : toute adresse e-mail de forme valide est acceptée.
- Checklist déterministe à partir des réponses, pas d’IA distante. Les notes libres du profil restent consultables ; seuls le réglage « voyager léger » et la mémoire des oublis modifient la génération.
- Météo entièrement fictive et explicitement signalée, indépendante de la destination.
- Les formalités sont à vérifier auprès des sources officielles ; le prototype ne fournit pas de conseils de visas.
- Les dates passées sont autorisées pour tester le retour après voyage ; un retour avant le départ est refusé. Un séjour dans la journée est compté comme une nuit dans cette V1.
- Les écrans sont des vues d’une application sur une seule route. Un rechargement renvoie au tableau de bord si la session simulée est active.
- Les checklists existantes restent telles qu’elles ont été créées après une modification de profil.

## Publier sur Vercel

Déposer les fichiers du projet dans un dépôt GitHub puis importer ce dépôt dans Vercel. Preset Next.js, commande `npm run build` ; aucune variable d’environnement requise. Si le projet est dans un sous-dossier, sélectionner celui-ci comme Root Directory.

## Publier sur GitHub Pages

Pour un site à la racine (`utilisateur.github.io`) : publier le contenu de `out/` et ajouter un fichier vide `.nojekyll`.

Pour une URL de dépôt (`utilisateur.github.io/nom-du-depot`) :

```sh
NEXT_PUBLIC_BASE_PATH=/nom-du-depot npm run build
```

Les chemins de la photo, du favicon et des fichiers générés utilisent automatiquement ce préfixe. Ajouter `out/.nojekyll`, puis publier le contenu de `out/`. GitHub Pages sert uniquement le dossier exporté, pas les sources Next.js.

## Structure

- `app/page.tsx` : écrans et interactions.
- `app/globals.css` : tokens et mise en page responsive, réduction des animations.
- `lib/model.ts` : types, génération de checklist et validation de stockage.
- `tests/model.test.ts` : adaptation des listes, dates et sauvegarde.
- `public/` : photo locale et favicon original.

## Crédit photo

Lisbonne : elisadventure, [Unsplash](https://unsplash.com/photos/a-city-with-many-buildings-h5kfWB9c8lA). Photo téléchargée et incluse localement. Utilisation selon la [licence Unsplash](https://unsplash.com/license). Le nom Partir et son motif de favicon sont créés pour ce prototype ; aucun élément graphique Apple n’est utilisé.

## Emplacements publicitaires

Deux cartes de démonstration apparaissent dans l’espace d’un voyage actif : bouchons d’oreilles et batterie externe pour smartphone. Elles sont identifiées « Publicité » et « Exemple fictif ». Le bouton ajoute le produit à la checklist (ou indique qu’il y figure déjà), sans achat, lien marchand, affiliation réelle ou suivi publicitaire. Elles sont placées dans la colonne latérale sur ordinateur et sous la checklist sur mobile.

### Publication avec le workflow fourni

Placer le contenu du dossier `partir` à la racine du dépôt (y compris `.github/`). Dans GitHub, choisir **Settings → Pages → Source → GitHub Actions**, puis **Actions → Publier Partir sur GitHub Pages → Run workflow**. Le workflow installe, teste, construit et publie le site en détectant automatiquement son préfixe d’URL. La publication reste manuelle, sans déploiement déclenché par un simple envoi du code. Le site publié peut être accessible publiquement.
