import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../utils/helpers'
import SafeImage from './SafeImage'
import Rating from './Rating'
import WishlistButton from './WishlistButton'

export default function ServiceCard({ service }) {
  const { getCreator } = useApp()
  const creator = getCreator(service.creatorId)

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <Link to={`/services/${service.id}`} aria-label={service.title}>
          <SafeImage src={service.image} alt={service.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-700 shadow-card">
          {service.category}
        </span>
        <div className="absolute right-3 top-3"><WishlistButton serviceId={service.id} /></div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to={creator ? `/creators/${creator.id}` : '#'} className="mb-3 flex items-center gap-2 text-sm text-ink-700 hover:text-brand-600">
          <SafeImage src={creator?.avatar} alt={creator?.name || 'Creator'} className="h-7 w-7 rounded-full object-cover" />
          <span className="font-medium">{creator?.name || 'Unknown creator'}</span>
        </Link>
        <h3 className="line-clamp-2 text-base font-bold leading-snug">
          <Link to={`/services/${service.id}`} className="hover:text-brand-600">{service.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-500">{service.shortDescription}</p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <Rating value={service.rating} count={service.reviewsCount} />
          <p className="text-sm text-ink-500">From <span className="text-lg font-extrabold text-ink-900">{formatPrice(service.price)}</span></p>
        </div>
        <Link to={`/services/${service.id}`} className="btn-secondary mt-4 w-full">View Details</Link>
      </div>
    </article>
  )
}
