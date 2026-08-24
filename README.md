# Îlots de fraîcheur (test technique)

Front pour trouver un endroit frais à Paris : parc, équipement (piscine, biblio…) ou fontaine à boire.

J’ai pris les 3 datasets Open Data de la Ville, je les ramène au même format, et je filtre / affiche tout ça dans un tableau. Pas de carte, je préférais un truc stable dans le temps imparti.

## Lancer

```
npm install
npm run dev
```

Aucune clé API. Les appels partent vers `opendata.paris.fr`.

## Comment c’est organisé

- `src/api` : pagination de l’API (max 100 records par requête)
- `src/mappers` : un fichier par dataset, parce que les champs ne se ressemblent pas
  - fontaines : `commune` → code postal, adresse en plusieurs champs, `dispo` au lieu des horaires
  - équipements : champ `payant`
  - parcs : % de végétation haute + horaires
- `src/hooks/useCoolSpots.ts` : charge les 3 sources en parallèle
- ensuite c’est du React classique (filtres, tableau, panneau détail)

Filtres côté client une fois les données fusionnées, plus simple que 3 `where` différents.

## Stack

React 18, Vite, TypeScript, Tailwind CSS.
