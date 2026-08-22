import type { LoadStatus } from "../hooks/useCoolSpots";

type StatusBannerProps = {
  status: LoadStatus;
  error: string | null;
  onRetry: () => void;
};

export function StatusBanner({ status, error, onRetry }: StatusBannerProps) {
  if (status === "ready") return null;

  if (status === "loading") {
    return (
      <div className="banner banner-info" role="status">
        Chargement des îlots de fraîcheur depuis Open Data Paris…
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
