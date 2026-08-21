import { useCallback, useEffect, useState } from "react";
import type { CoolSpot } from "../types/CoolSpot";
import { DATASET_IDS } from "../api/opendata";
export type LoadStatus = "loading" | "ready" | "error";

export function useCoolSpot() {
  const [spots, setSpots] = useState<CoolSpot[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);


  useEffect(()=>{
    const controller = new AbortController();
    async function loadData(){
        try{
            const [parks,facilities,fountains] = await Promise.all([
                fetchAllRecords<ParkRecord>(
                    DATASET_IDS.parks,
                    PARK_SELECT,
                    controller.signal).then((rows.map(mapPark)))
                ])
                
        }
    }
  })
}
