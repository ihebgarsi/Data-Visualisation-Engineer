import type { CoolSpot } from "../models/coolSpot";
import { clean, mapsLink, type GeoPoint } from "./shared";

export const FOUNTAIN_FIELDS = [
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

export type FountainRow = {
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

function prettyType(raw: string | null | undefined) {
  const v = clean(raw);
  if (!v) return "Fontaine";
  if (v === "BORNE_FONTAINE") return "Borne fontaine";
  if (v === "FONTAINE_WALLACE") return "Fontaine Wallace";
  if (v.includes("PETILLANTE")) return "Fontaine pétillante";
  return v.replaceAll("_", " ").toLowerCase();
}

// "PARIS 11EME ARRONDISSEMENT" -> "75011"
export function communeToPostal(commune: string | null | undefined) {
  const value = clean(commune);
  const m = value.match(/PARIS\s+(\d+)/i);
  if (!m) return value;
  return "75" + m[1].padStart(3, "0");
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR");
}

export function mapFountain(row: FountainRow, i: number): CoolSpot {
  const dispo = clean(row.dispo).toUpperCase();
  const number = clean(row.no_voirie_impair) || clean(row.no_voirie_pair);
  const street = clean(row.voie);

  return {
    id: `fountain:${row.gid ?? i}`,
    kind: "fountain",
    name: prettyType(row.type_objet),
    type: clean(row.modele) || prettyType(row.type_objet),
    address: [number, street].filter(Boolean).join(" "),
    arrondissement: communeToPostal(row.commune),
    isOpen: dispo === "OUI" ? true : dispo === "NON" ? false : null,
    isPaid: false,
    shadePercent: null,
    hoursToday: null,
    hoursByDay: null,
    hoursPeriod: null,
    extras: [
      { label: "Modèle", value: clean(row.modele) || "-" },
      { label: "Disponibilité", value: clean(row.dispo) || "-" },
      { label: "Motif d'indisponibilité", value: clean(row.motif_ind) || "-" },
      { label: "Début indisponibilité", value: fmtDate(row.debut_ind) },
      { label: "Fin indisponibilité", value: fmtDate(row.fin_ind) },
    ],
    mapsUrl: mapsLink(row.geo_point_2d),
  };
}
