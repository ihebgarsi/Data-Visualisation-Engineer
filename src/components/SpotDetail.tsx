import type { CoolSpot } from "../models/coolSpot";
import { KIND_LABELS, WEEKDAYS } from "../models/coolSpot";

type Props = {
  spot: CoolSpot | null;
  onClose: () => void;
};

export function SpotDetail({ spot, onClose }: Props) {
  if (!spot) {
    return (
      <aside className="rounded-xl border border-line bg-white px-4 py-3.5 lg:sticky lg:top-3">
        <p className="text-muted">Cliquez une ligne pour voir le détail.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl border border-line bg-white px-4 py-3.5 lg:sticky lg:top-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">
            {KIND_LABELS[spot.kind]}
          </p>
          <h2 className="text-xl">{spot.name}</h2>
        </div>
        <button
          type="button"
          className="rounded-full border border-line bg-transparent px-3 py-1.5 text-sm hover:bg-paper"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>

      <dl className="m-0 grid gap-2.5">
        <div className="grid gap-0.5">
          <dt className="text-xs text-muted">Type</dt>
          <dd className="m-0">{spot.type}</dd>
        </div>
        <div className="grid gap-0.5">
          <dt className="text-xs text-muted">Adresse</dt>
          <dd className="m-0">{spot.address || "-"}</dd>
        </div>
        <div className="grid gap-0.5">
          <dt className="text-xs text-muted">Arrondissement</dt>
          <dd className="m-0">{spot.arrondissement || "-"}</dd>
        </div>
        <div className="grid gap-0.5">
          <dt className="text-xs text-muted">Ouvert / disponible</dt>
          <dd className="m-0">
            {spot.isOpen === true
              ? "Oui"
              : spot.isOpen === false
                ? "Non"
                : "Non renseigné"}
          </dd>
        </div>
        <div className="grid gap-0.5">
          <dt className="text-xs text-muted">Prix</dt>
          <dd className="m-0">
            {spot.isPaid === true
              ? "Payant"
              : spot.isPaid === false
                ? "Gratuit"
                : "Non renseigné"}
          </dd>
        </div>
        {spot.hoursToday && (
          <div className="grid gap-0.5">
            <dt className="text-xs text-muted">Aujourd'hui</dt>
            <dd className="m-0">{spot.hoursToday}</dd>
          </div>
        )}
        {spot.hoursPeriod && (
          <div className="grid gap-0.5">
            <dt className="text-xs text-muted">Période des horaires</dt>
            <dd className="m-0">{spot.hoursPeriod}</dd>
          </div>
        )}
        {spot.extras.map((x) => (
          <div key={x.label} className="grid gap-0.5">
            <dt className="text-xs text-muted">{x.label}</dt>
            <dd className="m-0">{x.value}</dd>
          </div>
        ))}
      </dl>

      {spot.hoursByDay && (
        <section>
          <h3 className="mb-1 mt-4 text-sm">Semaine</h3>
          <ul className="m-0 grid list-none gap-1 p-0">
            {WEEKDAYS.map((day) => (
              <li
                key={day}
                className="flex justify-between gap-3 border-b border-line py-1 capitalize"
              >
                <span>{day}</span>
                <span>{spot.hoursByDay?.[day] || "-"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {spot.mapsUrl && (
        <p className="mt-3">
          <a href={spot.mapsUrl} target="_blank" rel="noreferrer">
            Voir sur Google Maps
          </a>
        </p>
      )}
    </aside>
  );
}
