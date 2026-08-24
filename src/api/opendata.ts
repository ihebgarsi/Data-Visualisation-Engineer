// OpenDataSoft v2.1 — limit max = 100, donc on pagine avec offset
const BASE = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets";
const PAGE = 100;

export const DATASETS = {
  parks: "ilots-de-fraicheur-espaces-verts-frais",
  facilities: "ilots-de-fraicheur-equipements-activites",
  fountains: "fontaines-a-boire",
} as const;

type ApiPage<T> = {
  total_count: number;
  results: T[];
};

export type Progress = {
  loaded: number;
  total: number;
};

export async function fetchDataset<T>(
  datasetId: string,
  select: string,
  signal?: AbortSignal,
  onProgress?: (p: Progress) => void,
): Promise<T[]> {
  const rows: T[] = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const url = new URL(`${BASE}/${datasetId}/records`);
    url.searchParams.set("limit", String(PAGE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("select", select);

    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Erreur API ${datasetId} (${res.status})`);
    }

    const json = (await res.json()) as ApiPage<T>;
    total = json.total_count;
    rows.push(...json.results);
    onProgress?.({ loaded: rows.length, total });

    if (json.results.length === 0) break;
    offset += PAGE;
  }

  return rows;
}
