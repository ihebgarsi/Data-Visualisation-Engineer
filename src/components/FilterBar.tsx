import type { SpotFilters, SpotKind } from "../models/coolSpot";
import { KIND_LABELS } from "../models/coolSpot";

type Props = {
  filters: SpotFilters;
  arrondissements: string[];
  onChange: (next: SpotFilters) => void;
};

const KINDS: SpotKind[] = ["park", "facility", "fountain"];

const inputClass =
  "rounded-lg border border-line bg-white px-2.5 py-2 outline-none focus:border-accent";

const chipIdle =
  "rounded-full border border-line bg-white px-3 py-1.5 text-sm hover:bg-paper";
const chipOn =
  "rounded-full border border-accent bg-accent px-3 py-1.5 text-sm text-white";

export function FilterBar({ filters, arrondissements, onChange }: Props) {
  function toggleKind(kind: SpotKind) {
    const already = filters.kinds.includes(kind);
    onChange({
      ...filters,
      kinds: already
        ? filters.kinds.filter((k) => k !== kind)
        : [...filters.kinds, kind],
    });
  }

  return (
    <section
      className="mb-4 flex flex-wrap items-end gap-x-4 gap-y-3 rounded-xl border border-line bg-white p-4"
      aria-label="Filtres"
    >
      <label className="grid min-w-40 flex-1 basis-64 gap-1">
        <span className="text-sm font-semibold text-heading">Recherche</span>
        <input
          type="search"
          className={inputClass}
          value={filters.search}
          placeholder="Nom, type ou adresse"
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <fieldset className="grid min-w-40 gap-1 border-0 p-0">
        <legend className="mb-1 text-sm font-semibold text-heading">
          Type de lieu
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((kind) => {
            const on = filters.kinds.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                className={on ? chipOn : chipIdle}
                aria-pressed={on}
                onClick={() => toggleKind(kind)}
              >
                {KIND_LABELS[kind]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="grid min-w-40 gap-1">
        <span className="text-sm font-semibold text-heading">Arrondissement</span>
        <select
          className={inputClass}
          value={filters.arrondissement}
          onChange={(e) =>
            onChange({ ...filters, arrondissement: e.target.value })
          }
        >
          <option value="">Tous</option>
          {arrondissements.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 pb-1 text-sm">
        <input
          type="checkbox"
          checked={filters.freeOnly}
          onChange={(e) => onChange({ ...filters, freeOnly: e.target.checked })}
        />
        Gratuit uniquement
      </label>

      <label className="flex items-center gap-2 pb-1 text-sm">
        <input
          type="checkbox"
          checked={filters.openOnly}
          onChange={(e) => onChange({ ...filters, openOnly: e.target.checked })}
        />
        Ouvert / disponible
      </label>

      <label
        className="flex items-center gap-2 pb-1 text-sm"
        title="Espaces verts avec au moins 50 % de végétation haute"
      >
        <input
          type="checkbox"
          checked={filters.shadeOnly}
          onChange={(e) => onChange({ ...filters, shadeOnly: e.target.checked })}
        />
        Bien ombragé
      </label>

      <button
        type="button"
        className="rounded-full border border-line bg-transparent px-3 py-1.5 text-sm hover:bg-paper"
        onClick={() =>
          onChange({
            kinds: [],
            arrondissement: "",
            freeOnly: false,
            openOnly: false,
            shadeOnly: false,
            search: "",
          })
        }
      >
        Réinitialiser
      </button>
    </section>
  );
}
