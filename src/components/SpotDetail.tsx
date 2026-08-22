import type { CoolSpot } from "../models/coolSpot";
import { KIND_LABELS, WEEKDAYS } from "../models/coolSpot";

type SpotDetailProps = {
  spot: CoolSpot | null;
  onClose: () => void;
};

function openLabel(value: boolean | null): string {
  if (value === true) return "Oui";
  if (value === false) return "Non";
  return "Non renseigné";
}

function priceLabel(value: boolean | null): string {
  if (value === true) return "Payant";
  if (value === false) return "Gratuit";
  return "Non renseigné";
}

export function SpotDetail({ spot, onClose }: SpotDetailProps) {
  if (!spot) {
    return (
      <aside className="detail" aria-label="Détail du lieu">
        <p className="muted">Sélectionnez une ligne pour voir le détail.</p>
      </aside>
    );
  }

  return (
    <aside className="detail" aria-label={`Détail de ${spot.name}`}>
      <div className="detail-head">
        <div>
          <p className="eyebrow">{KIND_LABELS[spot.kind]}</p>
          <h2>{spot.name}</h2>
        </div>
        <button type="button" className="button button-ghost" onClick={onClose}>
          Fermer
        </button>
      </div>

      <dl className="facts">
        <div>
          <dt>Type</dt>
          <dd>{spot.type}</dd>
        </div>
        <div>
          <dt>Adresse</dt>
          <dd>{spot.address || "—"}</dd>
        </div>
        <div>
          <dt>Arrondissement</dt>
          <dd>{spot.arrondissement || "—"}</dd>
        </div>
        <div>
          <dt>Ouvert / disponible</dt>
          <dd>{openLabel(spot.isOpen)}</dd>
        </div>
        <div>
          <dt>Prix</dt>
          <dd>{priceLabel(spot.isPaid)}</dd>
        </div>
        {spot.hoursToday ? (
          <div>
            <dt>Horaires aujourd'hui</dt>
            <dd>{spot.hoursToday}</dd>
          </div>
        ) : null}
        {spot.hoursPeriod ? (
          <div>
            <dt>Période des horaires</dt>
            <dd>{spot.hoursPeriod}</dd>
          </div>
        ) : null}
        {spot.extras.map((extra) => (
          <div key={extra.label}>
            <dt>{extra.label}</dt>
            <dd>{extra.value}</dd>
          </div>
        ))}
      </dl>

      {spot.hoursByDay ? (
        <section>
          <h3>Horaires de la semaine</h3>
          <ul className="hours">
            {WEEKDAYS.map((day) => (
              <li key={day}>
                <span>{day}</span>
                <span>{spot.hoursByDay?.[day] || "—"}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {spot.mapsUrl ? (
        <p>
          <a href={spot.mapsUrl} target="_blank" rel="noreferrer">
            Ouvrir dans Google Maps
          </a>
        </p>
      ) : null}
    </aside>
  );
}
