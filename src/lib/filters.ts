import type { CoolSpot, SpotFilters, SpotKind } from "../models/coolSpot";

export const PAGE_SIZE = 50;

export function uniqueArrondissements(spots: CoolSpot[]): string[] {
  const values = new Set<string>();
  for (const spot of spots) {
    if (spot.arrondissement) values.add(spot.arrondissement);
  }
  return [...values].sort((a, b) => a.localeCompare(b, "fr"));
}

export function applyFilters(spots: CoolSpot[], filters: SpotFilters): CoolSpot[] {
  const search = filters.search.trim().toLowerCase();
  const kinds = new Set<SpotKind>(filters.kinds);

  return spots.filter((spot) => {
    if (kinds.size > 0 && !kinds.has(spot.kind)) return false;
    if (filters.arrondissement && spot.arrondissement !== filters.arrondissement) {
      return false;
    }
    if (filters.freeOnly && spot.isPaid === true) return false;
    if (filters.openOnly && spot.isOpen !== true) return false;
    // APUR: plus de 50% de végétation haute = vraiment ombragé
    if (filters.shadeOnly && (spot.shadePercent == null || spot.shadePercent < 50)) {
      return false;
    }
    if (search) {
      const haystack = `${spot.name} ${spot.type} ${spot.address}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export type SortKey =
  | "name"
  | "kind"
  | "type"
  | "arrondissement"
  | "isOpen"
  | "isPaid"
  | "shadePercent";

export type SortState = { key: SortKey; direction: "asc" | "desc" };

function compareUnknown(
  a: string | number | boolean | null,
  b: string | number | boolean | null,
): number {
  if (a === null || a === "") return 1;
  if (b === null || b === "") return -1;
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b, "fr", { sensitivity: "base" });
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function sortSpots(spots: CoolSpot[], sort: SortState): CoolSpot[] {
  const copy = [...spots];
  copy.sort((left, right) => {
    const result = compareUnknown(left[sort.key], right[sort.key]);
    return sort.direction === "asc" ? result : -result;
  });
  return copy;
}

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}
