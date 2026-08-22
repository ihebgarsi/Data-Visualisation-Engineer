import type { CoolSpot } from "../models/coolSpot";
import { mapsUrlFrom, text, type GeoPoint } from "./shared";

export const FOUNTAIN_SELECT = [
  "gid",
  "type_objet",
  "modele",
  "no_voirie_pair",
  "no_voirie_impair",
  "voie",
  "commune",
  "dispo",
  "debut_ind",
  "fin_ind",
  "motif_ind",
  "geo_point_2d",
].join(",");

export type FountainRecord = {
  gid?: string | null;
  type_objet?: string | null;
  modele?: string | null;
  no_voirie_pair?: string | null;
  no_voirie_impair?: string | null;
  voie?: string | null;
  commune?: string | null;
  dispo?: string | null;
  debut_ind?: string | null;
  fin_ind?: string | null;
  motif_ind?: string | null;
  geo_point_2d?: GeoPoint;
};

const FOUNTAIN_TYPE_LABELS: Record<string, string> = {
  BORNE_FONTAINE: "Borne fontaine",
  FONTAINE_ARCEAU: "Fontaine arceau",
  FONTAINE_2BOUCHE: "Fontaine 2 bouches",
  FONTAINE_ALBIEN: "Fontaine Albien",
  FONTAINE_WALLACE: "Fontaine Wallace",
  FONTAINE_MILLENAIRE: "Fontaine du Millénaire",
  FONTAINE_PETILLANTE: "Fontaine pétillante",
  TOTTEM: "Totem",
  TOTEM: "Totem",
};

function fountainTypeLabel(value: string | null | undefined): string {
  const raw = text(value);
  if (!raw) return "Fontaine";
  return FOUNTAIN_TYPE_LABELS[raw] ?? raw.replaceAll("_", " ").toLowerCase();
}

export function communeToPostal(commune: string | null | undefined): string {
  const value = text(commune);
  if (!value) return "";
  const match = value.match(/PARIS\s+(\d+)\s*(?:E|ER|EME)?/i);
  if (!match) return value;
  const number = Number.parseInt(match[1], 10);
  return `75${String(number).padStart(3, "0")}`;
}

function fountainAddress(record: FountainRecord): string {
  const number = text(record.no_voirie_impair) || text(record.no_voirie_pair);
  const street = text(record.voie);
  return [number, street].filter(Boolean).join(" ");
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeZone: "Europe/Paris",
  }).format(date);
}

export function mapFountain(record: FountainRecord, index: number): CoolSpot {
  const available = text(record.dispo).toUpperCase() === "OUI";
  const unavailable = text(record.dispo).toUpperCase() === "NON";

  return {
    id: `fountain:${record.gid ?? index}`,
    kind: "fountain",
    name: fountainTypeLabel(record.type_objet),
    type: text(record.modele) || fountainTypeLabel(record.type_objet),
    address: fountainAddress(record),
    arrondissement: communeToPostal(record.commune),
    isOpen: available ? true : unavailable ? false : null,
    isPaid: false,
    shadePercent: null,
    hoursToday: null,
    hoursByDay: null,
    hoursPeriod: null,
    extras: [
      { label: "Modèle", value: text(record.modele) || "—" },
      { label: "Disponibilité", value: text(record.dispo) || "—" },
      { label: "Motif d'indisponibilité", value: text(record.motif_ind) || "—" },
      { label: "Début indisponibilité", value: formatDate(record.debut_ind) },
      { label: "Fin indisponibilité", value: formatDate(record.fin_ind) },
    ],
    mapsUrl: mapsUrlFrom(record.geo_point_2d),
  };
}
