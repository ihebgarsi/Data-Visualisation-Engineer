import type { CoolSpot, Weekday } from "../models/coolSpot";
import {
  clean,
  hoursToday,
  mapsLink,
  parseOuvert,
  pickHours,
  type GeoPoint,
} from "./shared";

export const PARK_FIELDS = [
  "identifiant",
  "nom",
  "type",
  "categorie",
  "proportion_vegetation_haute",
  "adresse",
  "arrondissement",
  "statut_ouverture",
  "ouvert_24h",
  "canicule_ouverture",
  "ouverture_estivale_nocturne",
  "horaires_periode",
  "horaires_lundi",
  "horaires_mardi",
  "horaires_mercredi",
  "horaires_jeudi",
  "horaires_vendredi",
  "horaires_samedi",
  "horaires_dimanche",
  "geo_point_2d",
].join(",");

export type ParkRow = {
  identifiant?: string | null;
  nom?: string | null;
  type?: string | null;
  categorie?: string | null;
  proportion_vegetation_haute?: number | null;
  adresse?: string | null;
  arrondissement?: string | null;
  statut_ouverture?: string | null;
  ouvert_24h?: string | null;
  canicule_ouverture?: string | null;
  ouverture_estivale_nocturne?: string | null;
  horaires_periode?: string | null;
  horaires_lundi?: string | null;
  horaires_mardi?: string | null;
  horaires_mercredi?: string | null;
  horaires_jeudi?: string | null;
  horaires_vendredi?: string | null;
  horaires_samedi?: string | null;
  horaires_dimanche?: string | null;
  geo_point_2d?: GeoPoint;
};

export function mapPark(row: ParkRow, i: number): CoolSpot {
  const hours = pickHours(row as Partial<Record<`horaires_${Weekday}`, string | null>>);
  const shade =
    typeof row.proportion_vegetation_haute === "number"
      ? row.proportion_vegetation_haute
      : null;

  return {
    id: `park:${row.identifiant ?? i}`,
    kind: "park",
    name: clean(row.nom) || "Espace vert",
    type: clean(row.type) || clean(row.categorie) || "Espace vert",
    address: clean(row.adresse),
    arrondissement: clean(row.arrondissement),
    isOpen: parseOuvert(row.statut_ouverture),
    isPaid: false, // les parcs sont gratuits
    shadePercent: shade,
    hoursToday: hoursToday(hours),
    hoursByDay: hours,
    hoursPeriod: row.horaires_periode ?? null,
    extras: [
      { label: "Catégorie", value: row.categorie?.trim() || "-" },
      {
        label: "Végétation haute",
        value: shade == null ? "-" : `${Math.round(shade)} %`,
      },
      { label: "Ouvert 24h/24", value: row.ouvert_24h || "-" },
      { label: "Ouverture canicule", value: row.canicule_ouverture || "-" },
      {
        label: "Ouverture estivale nocturne",
        value: row.ouverture_estivale_nocturne || "-",
      },
    ],
    mapsUrl: mapsLink(row.geo_point_2d),
  };
}
