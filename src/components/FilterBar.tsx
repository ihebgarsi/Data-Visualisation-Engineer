import { SpotFilters, SpotKind, KIND_LABELS } from "../types/CoopSpot";
type FilterBarProps = {
  filters: SpotFilters;
  arrondissements: string[];
  onChange: (next: SpotFilters) => void;
};
const KIND_OPTIONS: SpotKind[] = ["park", "facility", "fountain"];
const FilterBar = ({ filters, arrondissements, onChange }: FilterBarProps) => {
  const toggleKind = (kind: SpotKind) => {
    const has = filters.kinds.includes(kind);
    onChange({
      ...filters,
      kinds: has
        ? filters.kinds.filter((item) => item !== kind)
        : [...filters.kinds, kind],
    });
  };
  const reset = () => {
    onChange({
      kinds: [],
      arrondissement: "",
      freeOnly: false,
      openOnly: false,
      search: "",
    });
  };
  return (
    <section className="filters" aria-label="Filtres">
      <label className="field field-grow">
        <span>Recherche</span>
        <input
          type="search"
          value={filters.search}
          placeholder="Nom, type ou adresse"
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
      </label>

      <fieldset className="field">
        <legend>Type de lieu</legend>
        <div className="chips">
          {KIND_OPTIONS.map((kind) => {
            const active = filters.kinds.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                className={active ? "chip chip-active" : "chip"}
                aria-pressed={active}
                onClick={() => toggleKind(kind)}
              >
                {KIND_LABELS[kind]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="field">
        <span>Arrondissement</span>
        <select
          value={filters.arrondissement}
          onChange={(event) =>
            onChange({ ...filters, arrondissement: event.target.value })
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

      <label className="check">
        <input
          type="checkbox"
          checked={filters.freeOnly}
          onChange={(event) =>
            onChange({ ...filters, freeOnly: event.target.checked })
          }
        />
        Gratuit uniquement
      </label>

      <label className="check">
        <input
          type="checkbox"
          checked={filters.openOnly}
          onChange={(event) =>
            onChange({ ...filters, openOnly: event.target.checked })
          }
        />
        Ouvert / disponible
      </label>

      <button type="button" className="button button-ghost" onClick={reset}>
        Réinitialiser
      </button>
    </section>
  );
};
