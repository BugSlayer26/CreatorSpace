import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { averageRating } from '../utils/helpers'
import SafeImage from './SafeImage'
import Rating from './Rating'
import Icon from './Icons'

export default function CreatorCard({ creator }) {
  const { services } = useApp()
  const count = services.filter((s) => s.creatorId === creator.id).length
  const rating = averageRating(creator.reviews)

  return (
    <article className="card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="grid h-28 grid-cols-3 gap-0.5 bg-ink-100">
        {creator.portfolio.slice(0, 3).map((p) => (
          <SafeImage key={p.id} src={p.image} alt={p.title} className="h-28 w-full object-cover" />
        ))}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="-mt-12 mb-3 flex items-end justify-between">
          <SafeImage src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-card" />
          <Rating value={rating} count={creator.reviews.length} />
        </div>
        <h3 className="text-lg font-bold">{creator.name}</h3>
        <p className="text-sm font-medium text-brand-600">{creator.title}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-500"><Icon name="pin" className="h-3.5 w-3.5" />{creator.location}</p>
        <p className="mt-3 line-clamp-2 text-sm text-ink-500">{creator.shortBio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {creator.skills.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-ink-500">
          <span>{creator.experience} yrs experience</span>
          <span>{count} {count === 1 ? 'service' : 'services'}</span>
        </div>
        <Link to={`/creators/${creator.id}`} className="btn-secondary mt-4 w-full">View Profile</Link>
      </div>
    </article>
  )
}
