import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import SearchBar from '../components/SearchBar'
import CreatorCard from '../components/CreatorCard'
import EmptyState from '../components/EmptyState'

export default function Creators() {
  const { creators } = useApp()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return creators.filter((c) => {
      const haystack = [c.name, c.title, c.location, c.shortBio, ...c.skills].join(' ').toLowerCase()
      return terms.every((t) => haystack.includes(t))
    })
  }, [creators, query])

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Creators</h1>
        <p className="mt-2 text-ink-500">Meet the designers, developers and storytellers behind the services.</p>
        <div className="mt-6 max-w-2xl">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, profession, skill or location..." />
        </div>
      </div>
      {results.length === 0 ? (
        <EmptyState title="No creators found" message="Try searching for a different name, skill or location." actionLabel="Clear search" onAction={() => setQuery('')} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((c) => <CreatorCard key={c.id} creator={c} />)}
        </div>
      )}
    </div>
  )
}
