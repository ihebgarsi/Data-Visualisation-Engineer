import { useCallback, useEffect, useState } from "react";
import { DATASETS, fetchDataset, type Progress } from "../api/opendata";
import { FACILITY_FIELDS, mapFacility, type FacilityRow } from "../mappers/facilities";
import { FOUNTAIN_FIELDS, mapFountain, type FountainRow } from "../mappers/fountains";
import { PARK_FIELDS, mapPark, type ParkRow } from "../mappers/parks";
import type { CoolSpot } from "../models/coolSpot";

export type LoadStatus = "loading" | "ready" | "error";
export type DatasetKey = "parks" | "facilities" | "fountains";
export type LoadProgress = Record<DatasetKey, Progress>;

const emptyProgress: LoadProgress = {
  parks: { loaded: 0, total: 0 },
  facilities: { loaded: 0, total: 0 },
  fountains: { loaded: 0, total: 0 },
};

export function useCoolSpots() {
  const [spots, setSpots] = useState<CoolSpot[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<LoadProgress>(emptyProgress);
  const [tick, setTick] = useState(0);

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setProgress(emptyProgress);
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    const ac = new AbortController();

    function track(key: DatasetKey) {
      return (p: Progress) => {
        setProgress((prev) => ({ ...prev, [key]: p }));
      };
    }

    async function load() {
      try {
        // 3 appels en parallèle, chacun pagine jusqu'au bout
        const [parks, facilities, fountains] = await Promise.all([
          fetchDataset<ParkRow>(DATASETS.parks, PARK_FIELDS, ac.signal, track("parks")).then(
            (rows) => rows.map(mapPark),
          ),
          fetchDataset<FacilityRow>(
            DATASETS.facilities,
            FACILITY_FIELDS,
            ac.signal,
            track("facilities"),
          ).then((rows) => rows.map(mapFacility)),
          fetchDataset<FountainRow>(
            DATASETS.fountains,
            FOUNTAIN_FIELDS,
            ac.signal,
            track("fountains"),
          ).then((rows) => rows.map(mapFountain)),
        ]);

        if (ac.signal.aborted) return;
        setSpots([...parks, ...facilities, ...fountains]);
        setStatus("ready");
      } catch (err) {
        if (ac.signal.aborted) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Chargement impossible");
        setStatus("error");
      }
    }

    load();
    return () => ac.abort();
  }, [tick]);

  return { spots, status, error, progress, retry };
}
