const BASE_URL =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets";
const PAGE_SIZE = 100;

export const DATASET_IDS = {
  parks: "ilots-de-fraicheur-espaces-verts-frais",
  facilities: "ilots-de-fraicheur-equipements-activites",
  fountains: "fontaines-a-boire",
} as const;

type RecordsResponse<T> = {
  total_count: number;
  results: T[];
};

export type FetchProgress = {
  loaded: number;
  total: number;
};

export async function fetchAllRecords<T>(
  datasetId: string,
  select: string,
  signal?: AbortSignal,
  onProgress?: (progress: FetchProgress) => void,
): Promise<T[]> {
  const all: T[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const url = new URL(`${BASE_URL}/${datasetId}/records`);
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("select", select);

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(
        `Impossible de charger ${datasetId} (${response.status})`,
      );
    }

    const data = (await response.json()) as RecordsResponse<T>;
    total = data.total_count;
    all.push(...data.results);
    onProgress?.({ loaded: all.length, total });

    if (data.results.length === 0) {
      break;
    }
    offset += PAGE_SIZE;
  }

  return all;
}
