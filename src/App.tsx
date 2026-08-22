import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { ResultsTable } from "./components/ResultsTable";
import { SpotDetail } from "./components/SpotDetail";
import { StatusBanner } from "./components/StatusBanner";
import { useCoolSpots } from "./hooks/useCoolSpots";
import {
  applyFilters,
  PAGE_SIZE,
  paginate,
  sortSpots,
  uniqueArrondissements,
  type SortKey,
  type SortState,
} from "./lib/filters";
import type { SpotFilters } from "./models/coolSpot";

const DEFAULT_FILTERS: SpotFilters = {
  kinds: [],
  arrondissement: "",
  freeOnly: false,
  openOnly: false,
  search: "",
};

const STRIPES = [
  "#08306b",
  "#2171b5",
  "#6baed6",
  "#c6dbef",
  "#fee391",
  "#fe9929",
  "#d95f0e",
  "#b30000",
];

export default function App() {
  const { spots, status, error, progress, retry } = useCoolSpots();
  const [filters, setFilters] = useState<SpotFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>({
    key: "name",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const arrondissements = useMemo(() => uniqueArrondissements(spots), [spots]);
  const filtered = useMemo(() => applyFilters(spots, filters), [spots, filters]);
  const sorted = useMemo(() => sortSpots(filtered, sort), [filtered, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = useMemo(() => paginate(sorted, page), [sorted, page]);
  const selected = spots.find((spot) => spot.id === selectedId) ?? null;

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function onSort(key: SortKey) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  }

  return (
    <div className="app">
      <div className="stripes" aria-hidden="true">
        {STRIPES.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </div>

      <header className="hero">
        <p className="eyebrow">Paris · Open Data</p>
        <h1>Trouver un îlot de fraîcheur</h1>
        <p>
          Un lieu frais pour aujourd’hui : parc ombragé, équipement intérieur ou
          fontaine à boire. Filtrez par besoin, arrondissement, prix et
          disponibilité.
        </p>
      </header>

      <StatusBanner
        status={status}
        error={error}
        progress={progress}
        onRetry={retry}
      />

      <FilterBar
        filters={filters}
        arrondissements={arrondissements}
        onChange={setFilters}
      />

      <div className="layout">
        <ResultsTable
          isLoading={status === "loading"}
          isError={status === "error"}
          spots={pageItems}
          total={sorted.length}
          page={page}
          pageCount={pageCount}
          sort={sort}
          selectedId={selectedId}
          onSort={onSort}
          onSelect={setSelectedId}
          onPage={setPage}
        />
        <SpotDetail spot={selected} onClose={() => setSelectedId(null)} />
      </div>
    </div>
  );
}
