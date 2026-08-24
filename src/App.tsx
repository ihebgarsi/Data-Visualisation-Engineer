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

const emptyFilters: SpotFilters = {
  kinds: [],
  arrondissement: "",
  freeOnly: false,
  openOnly: false,
  shadeOnly: false,
  search: "",
};

// petit clin d'oeil aux warming stripes du sujet
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
  const [filters, setFilters] = useState<SpotFilters>(emptyFilters);
  const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const arrondissements = useMemo(() => uniqueArrondissements(spots), [spots]);
  const filtered = useMemo(() => applyFilters(spots, filters), [spots, filters]);
  const sorted = useMemo(() => sortSpots(filtered, sort), [filtered, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = useMemo(() => paginate(sorted, page), [sorted, page]);
  const selected = spots.find((s) => s.id === selectedId) ?? null;

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function onSort(key: SortKey) {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8">
      <div className="-mx-4 mb-5 flex h-2.5" aria-hidden="true">
        {STRIPES.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      <header className="mb-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">
          Paris · Open Data
        </p>
        <h1 className="text-3xl leading-tight md:text-4xl">
          Trouver un îlot de fraîcheur
        </h1>
        <p className="mt-1.5 max-w-xl text-muted">
          Un lieu frais pour aujourd'hui : parc ombragé, équipement intérieur ou
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

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
