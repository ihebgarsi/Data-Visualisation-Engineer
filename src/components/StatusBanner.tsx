import type { LoadProgress, LoadStatus } from "../hooks/useCoolSpots";

type StatusBannerProps = {
  status: LoadStatus;
  error: string | null;
  progress: LoadProgress;
  onRetry: () => void;
};

const DATASET_LABELS = {
  parks: "Espaces verts",
  facilities: "Équipements",
  fountains: "Fontaines",
} as const;

function percent(loaded: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((loaded / total) * 100));
}

export function StatusBanner({
  status,
  error,
  progress,
  onRetry,
}: StatusBannerProps) {
  if (status === "ready") return null;

  if (status === "loading") {
    return (
      <div className="banner banner-info" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <div className="banner-copy">
          <p>
            <strong>Chargement des données Open Data Paris…</strong>
          </p>
          <ul className="load-progress">
            {(Object.keys(DATASET_LABELS) as Array<keyof typeof DATASET_LABELS>).map(
              (key) => {
                const { loaded, total } = progress[key];
                const label = DATASET_LABELS[key];
                return (
                  <li key={key}>
                    <span>{label}</span>
                    <span>
                      {total > 0
                        ? `${loaded} / ${total} (${percent(loaded, total)} %)`
                        : "en attente…"}
                    </span>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="banner banner-error" role="alert">
      <span>{error ?? "Une erreur est survenue."}</span>
      <button type="button" className="button" onClick={onRetry}>
        Réessayer
      </button>
    </div>
  );
}
