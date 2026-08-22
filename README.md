# Îlots de fraîcheur — Paris

Application front-end pour trouver un lieu frais à Paris : espace vert ombragé, équipement intérieur, ou fontaine à boire.

## Cas d’usage

N’importe qui, un jour de chaleur : filtrer par **besoin** (parc / intérieur / eau), **arrondissement**, **gratuit**, et **ouvert / disponible**. Pas de mode touriste vs habitant — les filtres couvrent les deux.

## Lancer le projet

Les dépendances ne sont pas encore installées dans ce dossier.

```bash
npm install
npm run dev
```

Puis ouvrir l’URL affichée par Vite (en général `http://localhost:5173`).

```bash
npm run build    # vérification TypeScript + bundle
```

Aucune clé API n’est nécessaire. Les données viennent d’Open Data Paris (ODbL).

## Données

Trois jeux officiels « îlots de fraîcheur », API OpenDataSoft v2.1 :

| Source | Identifiant |
| --- | --- |
| Espaces verts | `ilots-de-fraicheur-espaces-verts-frais` |
| Équipements / activités | `ilots-de-fraicheur-equipements-activites` |
| Fontaines à boire | `fontaines-a-boire` |

Les enregistrements sont paginés (100 par appel). Les géométries `geo_shape` ne sont pas demandées, pour garder le chargement léger.

## Modèle de données

Les trois APIs n’ont pas les mêmes champs. Chaque source passe par un mapper vers un `CoolSpot` commun (`id`, `kind`, `name`, `type`, `address`, `arrondissement`, `isOpen`, `isPaid`, `shadePercent`, horaires).

Normalisations importantes :

- arrondissement des fontaines : `PARIS 14EME ARRONDISSEMENT` → `75014`
- adresse des fontaines reconstruite depuis numéro + voie
- parcs et fontaines traités comme gratuits
- filtres appliqués **côté client** une fois les trois jeux fusionnés, pour qu’un filtre (arrondissement, gratuit, ouvert) s’applique à 1 ou N datasets sans réécrire trois requêtes `where`

Pas de carte : un tableau triable, des filtres, et un panneau de détail (lien Google Maps optionnel).

## Stack

Vite + TypeScript (React 18). `fetch` natif, CSS sans kit UI.
