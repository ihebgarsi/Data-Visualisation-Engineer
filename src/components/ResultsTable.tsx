import type { CoolSpot } from "../models/coolSpot";
import { KIND_LABELS } from "../models/coolSpot";
import { PAGE_SIZE, type SortKey, type SortState } from "../lib/filters";

type ResultsTableProps = {
  isLoading: boolean;
  isError: boolean;
  spots: CoolSpot[];
  total: number;
  page: number;
  pageCount: number;
  sort: SortState;
  selectedId: string | null;
  onSort: (key: SortKey) => void;
  onSelect: (id: string) => void;
  onPage: (page: number) => void;
};

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Nom" },
  { key: "kind", label: "Catégorie" },
  { key: "type", label: "Type" },
  { key: "arrondissement", label: "Arr." },
  { key: "isOpen", label: "Ouvert" },
  { key: "isPaid", label: "Prix" },
  { key: "shadePercent", label: "Ombre" },
];

function openLabel(value: boolean | null): string {
  if (value === true) return "Oui";
  if (value === false) return "Non";
  return "—";
}

function priceLabel(value: boolean | null): string {
  if (value === true) return "Payant";
  if (value === false) return "Gratuit";
  return "—";
}

export function ResultsTable({
  isLoading,
  isError,
  spots,
  total,
  page,
  pageCount,
  sort,
  selectedId,
  onSort,
  onSelect,
  onPage,
}: ResultsTableProps) {
  if (isLoading) {
    return (
      <div className="table-wrap" aria-busy="true" aria-live="polite">
        <div className="table-meta">
          <p className="loading-line">
            <span className="spinner" aria-hidden="true" />
            Chargement des lieux…
          </p>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }, (_, index) => (
                <tr key={index} className="skeleton-row">
                  {COLUMNS.map((column) => (
                    <td key={column.key}>
                      <span className="skeleton" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="empty" role="status">
        Les résultats ne peuvent pas être affichés tant que le chargement échoue.
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="empty" role="status">
        Aucun lieu ne correspond à ces filtres.
      </div>
    );
  }

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="table-wrap">
      <div className="table-meta">
        <p>
          <strong>{total}</strong> lieu{total > 1 ? "x" : ""} — affichage {from}–
          {to}
        </p>
        <div className="pager">
          <button
            type="button"
            className="button button-ghost"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            Précédent
          </button>
          <span>
            Page {page} / {pageCount}
          </span>
          <button
            type="button"
            className="button button-ghost"
            disabled={page >= pageCount}
            onClick={() => onPage(page + 1)}
          >
            Suivant
          </button>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((column) => {
                const active = sort.key === column.key;
                const suffix = active
                  ? sort.direction === "asc"
                    ? " ↑"
                    : " ↓"
                  : "";
                return (
                  <th key={column.key} scope="col">
                    <button
                      type="button"
                      className="th-button"
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      {suffix}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {spots.map((spot) => (
              <tr
                key={spot.id}
                className={spot.id === selectedId ? "row-selected" : undefined}
                onClick={() => onSelect(spot.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(spot.id);
                  }
                }}
                tabIndex={0}
              >
                <td>{spot.name}</td>
                <td>{KIND_LABELS[spot.kind]}</td>
                <td>{spot.type}</td>
                <td>{spot.arrondissement || "—"}</td>
                <td>{openLabel(spot.isOpen)}</td>
                <td>{priceLabel(spot.isPaid)}</td>
                <td>
                  {spot.shadePercent === null
                    ? "—"
                    : `${Math.round(spot.shadePercent)} %`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
