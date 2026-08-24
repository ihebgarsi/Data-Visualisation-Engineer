import type { CoolSpot, Weekday } from "../models/coolSpot";
import {
  clean,
  hoursToday,
  mapsLink,
  ouiNon,
  parseOuvert,
  pickHours,
  type GeoPoint,
} from "./shared";

export const FACILITY_FIELDS = [
  "identifiant",
  "nom",
  "type",
  "payant",
  "adresse",
  "arrondissement",
  "statut_ouverture",
  "horaires_periode",
  "horaires_lundi",
  "horaires_mardi",
  "horaires_mercredi",
  "horaires_jeudi",
  "horaires_vendredi",
  "horaires_samedi",
  "horaires_dimanche",
  "proposition_usager",
  "geo_point_2d",
].join(",");

export type FacilityRow = {
  identifiant?: string | null;
  nom?: string | null;
  type?: string | null;
  payant?: string | null;
  adresse?: string | null;
  arrondissement?: string | null;
  statut_ouverture?: string | null;
  horaires_periode?: string | null;
  horaires_lundi?: string | null;
  horaires_mardi?: string | null;
  horaires_mercredi?: string | null;
  horaires_jeudi?: string | null;
  horaires_vendredi?: string | null;
  horaires_samedi?: string | null;
  horaires_dimanche?: string | null;
  proposition_usager?: string | null;
  geo_point_2d?: GeoPoint;
};

export function mapFacility(row: FacilityRow, i: number): CoolSpot {
  const hours = pickHours(row as Partial<Record<`horaires_${Weekday}`, string | null>>);

  return {
    id: `facility:${row.identifiant ?? i}`,
    kind: "facility",
    name: clean(row.nom) || "Équipement",
    type: clean(row.type) || "Équipement",
    address: clean(row.adresse),
    arrondissement: clean(row.arrondissement),
    isOpen: parseOuvert(row.statut_ouverture),
    isPaid: ouiNon(row.payant),
    shadePercent: null,
    hoursToday: hoursToday(hours),
    hoursByDay: hours,
    hoursPeriod: row.horaires_periode ?? null,
    extras: [
      { label: "Bon plan usager", value: row.proposition_usager?.trim() || "-" },
    ],
    mapsUrl: mapsLink(row.geo_point_2d),
  };
}
