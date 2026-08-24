import type { ReactNode } from "react";
import type { CoolSpot } from "../models/coolSpot";
import { KIND_LABELS } from "../models/coolSpot";
import { PAGE_SIZE, type SortKey, type SortState } from "../lib/filters";

type Props = {
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

const ghostBtn =
  "rounded-full border border-line bg-transparent px-3 py-1.5 text-sm hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50";

function yesNo(v: boolean | null) {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  return "-";
}

function price(v: boolean | null) {
  if (v === true) return "Payant";
  if (v === false) return "Gratuit";
  return "-";
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3.5">
      {children}
    </div>
  );
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
}: Props) {
  if (isLoading) {
    return (
      <Empty>
        <span
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-line border-t-accent"
          aria-hidden="true"
        />
        <span role="status">Chargement des lieux…</span>
      </Empty>
    );
  }

  if (isError) {
    return (
      <Empty>Impossible d'afficher le tableau tant que le chargement échoue.</Empty>
    );
  }

  if (total === 0) {
    return <Empty>Aucun lieu ne correspond aux filtres.</Empty>;
  }

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <p>
          <strong>{total}</strong> lieu{total > 1 ? "x" : ""} — {from} à {to}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={ghostBtn}
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
            className={ghostBtn}
            disabled={page >= pageCount}
            onClick={() => onPage(page + 1)}
          >
            Suivant
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                const active = sort.key === col.key;
                let arrow = "";
                if (active) arrow = sort.direction === "asc" ? " ↑" : " ↓";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className="whitespace-nowrap border-t border-line px-3 py-2.5 text-left"
                  >
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent p-0 font-bold text-heading"
                      onClick={() => onSort(col.key)}
                    >
                      {col.label}
                      {arrow}
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
                className={`cursor-pointer border-t border-line hover:bg-row ${
                  spot.id === selectedId ? "bg-row-on" : ""
                }`}
                onClick={() => onSelect(spot.id)}
              >
                <td className="min-w-40 whitespace-normal px-3 py-2.5">{spot.name}</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {KIND_LABELS[spot.kind]}
                </td>
                <td className="min-w-40 whitespace-normal px-3 py-2.5">{spot.type}</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {spot.arrondissement || "-"}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">{yesNo(spot.isOpen)}</td>
                <td className="whitespace-nowrap px-3 py-2.5">{price(spot.isPaid)}</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {spot.shadePercent == null
                    ? "-"
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
