import type { LoadProgress, LoadStatus } from "../hooks/useCoolSpots";

type Props = {
  status: LoadStatus;
  error: string | null;
  progress: LoadProgress;
  onRetry: () => void;
};

function line(label: string, loaded: number, total: number) {
  if (!total) return `${label} : en attente…`;
  const pct = Math.round((loaded / total) * 100);
  return `${label} : ${loaded} / ${total} (${pct}%)`;
}

export function StatusBanner({ status, error, progress, onRetry }: Props) {
  if (status === "ready") return null;

  if (status === "loading") {
    return (
      <div
        className="mb-4 flex items-start gap-3 rounded-lg bg-info px-4 py-3"
        role="status"
      >
        <span
          className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-line border-t-accent"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p>
            <strong>Chargement des données Open Data Paris…</strong>
          </p>
          <ul className="mt-2 grid gap-0.5 text-sm">
            <li>{line("Espaces verts", progress.parks.loaded, progress.parks.total)}</li>
            <li>
              {line(
                "Équipements",
                progress.facilities.loaded,
                progress.facilities.total,
              )}
            </li>
            <li>
              {line("Fontaines", progress.fountains.loaded, progress.fountains.total)}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-danger-bg px-4 py-3 text-danger"
      role="alert"
    >
      <span>{error || "Une erreur est survenue."}</span>
      <button
        type="button"
        className="rounded-full border border-accent bg-accent px-3 py-1.5 text-sm text-white"
        onClick={onRetry}
      >
        Réessayer
      </button>
    </div>
  );
}
