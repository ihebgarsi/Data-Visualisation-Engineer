import { useCallback, useEffect, useState } from "react";
import { DATASET_IDS, fetchAllRecords, type FetchProgress } from "../api/opendata";
import { mapFacility, FACILITY_SELECT, type FacilityRecord } from "../mappers/facilities";
import { mapFountain, FOUNTAIN_SELECT, type FountainRecord } from "../mappers/fountains";
import { mapPark, PARK_SELECT, type ParkRecord } from "../mappers/parks";
import type { CoolSpot } from "../models/coolSpot";

export type LoadStatus = "loading" | "ready" | "error";

export type DatasetKey = "parks" | "facilities" | "fountains";

export type LoadProgress = Record<DatasetKey, FetchProgress>;

const EMPTY_PROGRESS: LoadProgress = {
  parks: { loaded: 0, total: 0 },
  facilities: { loaded: 0, total: 0 },
  fountains: { loaded: 0, total: 0 },
};

export function useCoolSpots() {
  const [spots, setSpots] = useState<CoolSpot[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<LoadProgress>(EMPTY_PROGRESS);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setProgress(EMPTY_PROGRESS);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    function track(key: DatasetKey) {
      return (next: FetchProgress) => {
        setProgress((current) => ({ ...current, [key]: next }));
      };
    }

    async function load() {
      try {
        const [parks, facilities, fountains] = await Promise.all([
          fetchAllRecords<ParkRecord>(
            DATASET_IDS.parks,
            PARK_SELECT,
            controller.signal,
            track("parks"),
          ).then((rows) => rows.map(mapPark)),
          fetchAllRecords<FacilityRecord>(
            DATASET_IDS.facilities,
            FACILITY_SELECT,
            controller.signal,
            track("facilities"),
          ).then((rows) => rows.map(mapFacility)),
          fetchAllRecords<FountainRecord>(
            DATASET_IDS.fountains,
            FOUNTAIN_SELECT,
            controller.signal,
            track("fountains"),
          ).then((rows) => rows.map(mapFountain)),
        ]);

        if (controller.signal.aborted) return;
        setSpots([...parks, ...facilities, ...fountains]);
        setStatus("ready");
      } catch (cause) {
        if (controller.signal.aborted) return;
        if (cause instanceof Error && cause.name === "AbortError") return;
        const message =
          cause instanceof Error
            ? cause.message
            : "Le chargement des données a échoué.";
        setError(message);
        setStatus("error");
      }
    }

    void load();
    return () => controller.abort();
  }, [reloadKey]);

  return { spots, status, error, progress, retry };
}
