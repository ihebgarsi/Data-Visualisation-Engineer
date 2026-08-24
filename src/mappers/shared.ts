import type { Weekday } from "../models/coolSpot";
import { WEEKDAYS } from "../models/coolSpot";

export type GeoPoint = { lat: number; lon: number } | null | undefined;

export function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export function ouiNon(value: string | null | undefined): boolean | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "oui" || v === "o") return true;
  if (v === "non" || v === "n") return false;
  return null;
}

export function parseOuvert(value: string | null | undefined): boolean | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "ouvert" || v === "ouverte" || v === "oui") return true;
  if (v.startsWith("ferm") || v === "non") return false;
  return null;
}

export function todayInParis(): Weekday {
  const label = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    timeZone: "Europe/Paris",
  })
    .format(new Date())
    .toLowerCase();

  // au cas où l'accent pose problème (dimanche n'en a pas, mais on reste prudent)
  const normalized = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return WEEKDAYS.includes(normalized as Weekday) ? (normalized as Weekday) : "lundi";
}

export function pickHours(
  row: Partial<Record<`horaires_${Weekday}`, string | null>>,
) {
  const hours: Partial<Record<Weekday, string | null>> = {};
  for (const day of WEEKDAYS) {
    hours[day] = row[`horaires_${day}`] ?? null;
  }
  return hours;
}

export function hoursToday(
  hours: Partial<Record<Weekday, string | null>> | null,
) {
  if (!hours) return null;
  return hours[todayInParis()] ?? null;
}

export function mapsLink(point: GeoPoint) {
  if (!point || typeof point.lat !== "number" || typeof point.lon !== "number") {
    return null;
  }
  return `https://www.google.com/maps?q=${point.lat},${point.lon}`;
}
