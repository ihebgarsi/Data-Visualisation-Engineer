export type SpotKind = "park" | "facility" | "fountain";

export type Weekday =
  | "lundi"
  | "mardi"
  | "mercredi"
  | "jeudi"
  | "vendredi"
  | "samedi"
  | "dimanche";

export type CoolSpot = {
  id: string;
  kind: SpotKind;
  name: string;
  type: string;
  address: string;
  arrondissement: string;
  isOpen: boolean | null;
  isPaid: boolean | null;
  shadePercent: number | null;
  hoursToday: string | null;
  hoursByDay: Partial<Record<Weekday, string | null>> | null;
  hoursPeriod: string | null;
  extras: { label: string; value: string }[];
  mapsUrl: string | null;
};

export type SpotFilters = {
  kinds: SpotKind[];
  arrondissement: string;
  freeOnly: boolean;
  openOnly: boolean;
  search: string;
};

export const KIND_LABELS: Record<SpotKind, string> = {
  park: "Espace vert",
  facility: "Équipement",
  fountain: "Fontaine",
};
