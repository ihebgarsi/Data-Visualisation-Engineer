import type { CoolSpot, Weekday } from "../models/coolSpot";
import {
  displayOrDash,
  hoursFromRecord,
  hoursTodayFrom,
  mapsUrlFrom,
  mapOpenStatus,
  text,
  type GeoPoint,
} from "./shared";

export const PARK_SELECT = [
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

export type ParkRecord = {
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

export function mapPark(record: ParkRecord, index: number): CoolSpot {
  const hoursByDay = hoursFromRecord(
    record as Partial<Record<`horaires_${Weekday}`, string | null>>,
  );
  const shade =
    typeof record.proportion_vegetation_haute === "number"
      ? record.proportion_vegetation_haute
      : null;

  return {
    id: `park:${record.identifiant ?? index}`,
    kind: "park",
    name: text(record.nom) || "Espace vert",
    type: text(record.type) || text(record.categorie) || "Espace vert",
    address: text(record.adresse),
    arrondissement: text(record.arrondissement),
    isOpen: mapOpenStatus(record.statut_ouverture),
    isPaid: false,
    shadePercent: shade,
    hoursToday: hoursTodayFrom(hoursByDay),
    hoursByDay,
    hoursPeriod: record.horaires_periode ?? null,
    extras: [
      { label: "Catégorie", value: displayOrDash(record.categorie) },
      {
        label: "Végétation haute",
        value: shade === null ? "—" : `${Math.round(shade)} %`,
      },
      { label: "Ouvert 24h/24", value: displayOrDash(record.ouvert_24h) },
      {
        label: "Ouverture canicule",
        value: displayOrDash(record.canicule_ouverture),
      },
      {
        label: "Ouverture estivale nocturne",
        value: displayOrDash(record.ouverture_estivale_nocturne),
      },
    ],
    mapsUrl: mapsUrlFrom(record.geo_point_2d),
  };
}
