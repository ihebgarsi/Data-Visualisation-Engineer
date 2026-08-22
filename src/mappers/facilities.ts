import type { CoolSpot, Weekday } from "../models/coolSpot";
import {
  hoursFromRecord,
  hoursTodayFrom,
  mapsUrlFrom,
  mapOpenStatus,
  mapYesNo,
  text,
  type GeoPoint,
} from "./shared";

export const FACILITY_SELECT = [
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

export type FacilityRecord = {
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

export function mapFacility(record: FacilityRecord, index: number): CoolSpot {
  const hoursByDay = hoursFromRecord(
    record as Partial<Record<`horaires_${Weekday}`, string | null>>,
  );

  return {
    id: `facility:${record.identifiant ?? index}`,
    kind: "facility",
    name: text(record.nom) || "Équipement",
    type: text(record.type) || "Équipement",
    address: text(record.adresse),
    arrondissement: text(record.arrondissement),
    isOpen: mapOpenStatus(record.statut_ouverture),
    isPaid: mapYesNo(record.payant),
    shadePercent: null,
    hoursToday: hoursTodayFrom(hoursByDay),
    hoursByDay,
    hoursPeriod: record.horaires_periode ?? null,
    extras: [
      {
        label: "Bon plan usager",
        value: record.proposition_usager?.trim() || "—",
      },
    ],
    mapsUrl: mapsUrlFrom(record.geo_point_2d),
  };
}
