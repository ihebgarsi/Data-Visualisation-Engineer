import type { Weekday } from "../models/coolSpot";
import { WEEKDAYS } from "../models/coolSpot";

export type GeoPoint = { lat: number; lon: number } | null | undefined;

export function text(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function mapYesNo(value: string | null | undefined): boolean | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (["oui", "o", "yes"].includes(normalized)) return true;
  if (["non", "n", "no"].includes(normalized)) return false;
  return null;
}

export function mapOpenStatus(value: string | null | undefined): boolean | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (["ouvert", "ouverte", "oui", "o", "disponible"].includes(normalized)) {
    return true;
  }
  if (["fermé", "ferme", "fermée", "non", "n", "indisponible"].includes(normalized)) {
    return false;
  }
  return null;
}

export function weekdayInParis(): Weekday {
  const day = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    timeZone: "Europe/Paris",
  })
    .format(new Date())
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return WEEKDAYS.includes(day as Weekday) ? (day as Weekday) : "lundi";
}

export function hoursFromRecord(
  record: Partial<Record<`horaires_${Weekday}`, string | null>>,
): Partial<Record<Weekday, string | null>> {
  const hours: Partial<Record<Weekday, string | null>> = {};
  for (const day of WEEKDAYS) {
    hours[day] = record[`horaires_${day}`] ?? null;
  }
  return hours;
}

export function hoursTodayFrom(
  hours: Partial<Record<Weekday, string | null>> | null,
): string | null {
  if (!hours) return null;
  return hours[weekdayInParis()] ?? null;
}

export function mapsUrlFrom(point: GeoPoint): string | null {
  if (!point || typeof point.lat !== "number" || typeof point.lon !== "number") {
    return null;
  }
  return `https://www.google.com/maps?q=${point.lat},${point.lon}`;
}

export function displayOrDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}
