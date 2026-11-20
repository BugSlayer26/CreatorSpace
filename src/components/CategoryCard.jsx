import { Link } from 'react-router-dom'
import Icon from './Icons'

export default function CategoryCard({ category, count }) {
  return (
    <Link
      to={`/services?category=${encodeURIComponent(category.name)}`}
      className="card group flex flex-col gap-3 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon name={category.icon} className="h-6 w-6" />
      </span>
      <div>
        <h3 className="font-bold">{category.name}</h3>
        <p className="mt-1 text-sm text-ink-500">{category.description}</p>
      </div>
      <span className="mt-auto text-xs font-semibold text-brand-600">
        {count} {count === 1 ? 'service' : 'services'} <Icon name="arrowRight" className="inline h-3.5 w-3.5" />
      </span>
    </Link>
  )
}
