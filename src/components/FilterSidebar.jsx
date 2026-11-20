import { categoryNames } from '../data/categories'

export default function FilterSidebar({ filters, onChange, onClear, counts, hasActiveFilters }) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <button onClick={onClear} disabled={!hasActiveFilters} className="text-sm font-semibold text-brand-600 hover:underline disabled:cursor-not-allowed disabled:text-ink-300 disabled:no-underline">
          Clear all
        </button>
      </div>

      <fieldset>
        <legend className="label">Category</legend>
        <div className="space-y-1.5">
          {['All', ...categoryNames].map((name) => {
            const active = filters.category === name
            return (
              <label key={name} className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition ${active ? 'bg-brand-50 font-semibold text-brand-700' : 'hover:bg-ink-100'}`}>
                <span className="flex items-center gap-2">
                  <input type="radio" name="category" checked={active} onChange={() => onChange({ category: name })} className="accent-brand-600" />
                  {name}
                </span>
                <span className="text-xs text-ink-500">{counts[name] ?? 0}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Price range (USD)</legend>
        <div className="flex items-center gap-2">
          <input type="number" min="0" inputMode="numeric" placeholder="Min" aria-label="Minimum price" value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} className="input" />
          <span className="text-ink-500">-</span>
          <input type="number" min="0" inputMode="numeric" placeholder="Max" aria-label="Maximum price" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} className="input" />
        </div>
      </fieldset>
    </div>
  )
}
