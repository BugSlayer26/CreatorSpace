import { useApp } from '../context/AppContext'
import { categories } from '../data/categories'
import CategoryCard from '../components/CategoryCard'

export default function Categories() {
  const { services } = useApp()
  return (
    <div className="container-page py-10">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Browse by category</h1>
        <p className="mt-2 text-ink-500">Pick a category to see all matching services.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} count={services.filter((s) => s.category === c.name).length} />
        ))}
      </div>
    </div>
  )
}
