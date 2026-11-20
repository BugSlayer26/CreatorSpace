import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { categoryNames } from '../data/categories'
import SearchBar from '../components/SearchBar'
import FilterSidebar from '../components/FilterSidebar'
import ServiceCard from '../components/ServiceCard'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icons'

const sortOptions = [
  { value: 'relevance', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function ExploreServices() {
  const { services, getCreator } = useApp()
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  // Filters live in the URL so searches and category links are shareable and survive refresh.
  const q = params.get('q') || ''
  const rawCategory = params.get('category') || 'All'
  const category = categoryNames.includes(rawCategory) ? rawCategory : 'All'
  const minPrice = params.get('min') || ''
  const maxPrice = params.get('max') || ''
  const sort = sortOptions.some((o) => o.value === params.get('sort')) ? params.get('sort') : 'relevance'

  const update = (changes) => {
    const next = new URLSearchParams(params)
    const map = { q: 'q', category: 'category', minPrice: 'min', maxPrice: 'max', sort: 'sort' }
    Object.entries(changes).forEach(([key, value]) => {
      const param = map[key]
      if (!value || value === 'All' || value === 'relevance') next.delete(param)
      else next.set(param, value)
    })
    setParams(next, { replace: true })
  }
  const clearAll = () => setParams({}, { replace: true })
  const hasActiveFilters = Boolean(q || category !== 'All' || minPrice || maxPrice || sort !== 'relevance')

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)

    const list = services.filter((s) => {
      const creator = getCreator(s.creatorId)
      const haystack = [s.title, s.shortDescription, s.description, s.category, creator?.name, creator?.title, ...(s.skills || [])]
        .filter(Boolean).join(' ').toLowerCase()
      if (!terms.every((t) => haystack.includes(t))) return false
      if (category !== 'All' && s.category !== category) return false
      if (min !== null && !Number.isNaN(min) && s.price < min) return false
      if (max !== null && !Number.isNaN(max) && s.price > max) return false
      return true
    })

    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
    return sorted
  }, [services, getCreator, q, category, minPrice, maxPrice, sort])

  // Category counts reflect the current search + price filters.
  const counts = useMemo(() => {
    const min = minPrice === '' ? null : Number(minPrice)
    const max = maxPrice === '' ? null : Number(maxPrice)
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    const base = services.filter((s) => {
      const creator = getCreator(s.creatorId)
      const haystack = [s.title, s.shortDescription, s.description, s.category, creator?.name, creator?.title, ...(s.skills || [])].filter(Boolean).join(' ').toLowerCase()
      return terms.every((t) => haystack.includes(t)) && (min === null || s.price >= min) && (max === null || s.price <= max)
    })
    const out = { All: base.length }
    categoryNames.forEach((n) => { out[n] = base.filter((s) => s.category === n).length })
    return out
  }, [services, getCreator, q, minPrice, maxPrice])

  const filters = { category, minPrice, maxPrice }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Explore Services</h1>
        <p className="mt-2 text-ink-500">Search and filter creative services from talented professionals.</p>
        <div className="mt-6 max-w-2xl">
          <SearchBar value={q} onChange={(v) => update({ q: v })} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-6">
            <FilterSidebar filters={filters} onChange={update} onClear={clearAll} counts={counts} hasActiveFilters={hasActiveFilters} />
          </div>
        </aside>

        <section aria-live="polite">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-500">
              <span className="font-bold text-ink-900">{results.length}</span> {results.length === 1 ? 'service' : 'services'} found
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(true)} className="btn-secondary lg:hidden">
                <Icon name="filter" className="h-4 w-4" /> Filters
              </button>
              <label className="flex items-center gap-2 text-sm">
                <span className="sr-only sm:not-sr-only text-ink-500">Sort by</span>
                <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="input !w-auto py-2">
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No services match your search"
              message="Try a different keyword, widen your price range or clear the filters to see all services."
              actionLabel="Clear all filters"
              onAction={clearAll}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <span className="font-bold">Filter services</span>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters" className="rounded-lg p-1.5 hover:bg-ink-100"><Icon name="x" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar filters={filters} onChange={update} onClear={clearAll} counts={counts} hasActiveFilters={hasActiveFilters} />
            </div>
            <div className="border-t border-ink-100 p-4">
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full">Show {results.length} results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
