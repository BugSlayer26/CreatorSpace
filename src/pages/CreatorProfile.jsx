import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { averageRating } from '../utils/helpers'
import SafeImage from '../components/SafeImage'
import Rating from '../components/Rating'
import ServiceCard from '../components/ServiceCard'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icons'

export default function CreatorProfile() {
  const { id } = useParams()
  const { getCreator, services, settings } = useApp()
  const creator = getCreator(id)

  if (!creator) {
    return (
      <div className="container-page py-20">
        <EmptyState icon="user" title="Creator not found" message="This profile does not exist or may have been removed." actionLabel="Browse creators" actionTo="/creators" />
      </div>
    )
  }

  const creatorServices = services.filter((s) => s.creatorId === creator.id)
  const rating = averageRating(creator.reviews)
  const firstServiceId = creatorServices[0]?.id
  const showEmail = creator.id !== settings.currentCreatorId || settings.showEmailPublicly

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-12">
          <Link to="/creators" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-600">
            <Icon name="arrowLeft" className="h-4 w-4" /> All creators
          </Link>
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <SafeImage src={creator.avatar} alt={creator.name} className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lift sm:h-40 sm:w-40" loading="eager" />
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold sm:text-4xl">{creator.name}</h1>
              <p className="mt-1 text-lg font-medium text-brand-600">{creator.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
                <Rating value={rating} count={creator.reviews.length} />
                <span className="flex items-center gap-1.5"><Icon name="pin" className="h-4 w-4" />{creator.location}</span>
                <span className="flex items-center gap-1.5"><Icon name="briefcase" className="h-4 w-4" />{creator.experience} years experience</span>
                {showEmail && creator.email && <span className="flex items-center gap-1.5"><Icon name="mail" className="h-4 w-4" />{creator.email}</span>}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={firstServiceId ? `/inquiry?service=${firstServiceId}` : '/inquiry'} className="btn-primary">Contact / Send Inquiry</Link>
                <a href="#services" className="btn-secondary">View services</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-14">
          <section>
            <h2 className="text-xl font-bold">About</h2>
            <p className="mt-3 leading-relaxed text-ink-700">{creator.bio}</p>
          </section>

          <section>
            <h2 className="mb-5 text-xl font-bold">Portfolio</h2>
            {creator.portfolio.length === 0 ? (
              <p className="text-sm text-ink-500">This creator has not added portfolio projects yet.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {creator.portfolio.map((p) => (
                  <article key={p.id} className="card group overflow-hidden">
                    <div className="overflow-hidden bg-ink-100">
                      <SafeImage src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <span className="chip">{p.category}</span>
                      <h3 className="mt-2 font-bold">{p.title}</h3>
                      <p className="mt-1 text-sm text-ink-500">{p.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section id="services" className="scroll-mt-24">
            <h2 className="mb-5 text-xl font-bold">Services by {creator.name.split(' ')[0]}</h2>
            {creatorServices.length === 0 ? (
              <p className="text-sm text-ink-500">No services listed yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {creatorServices.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-5 text-xl font-bold">Ratings & reviews</h2>
            <ul className="space-y-4">
              {creator.reviews.map((r) => (
                <li key={r.id} className="card p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink-900">{r.author}</span>
                    <Rating value={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-ink-700">{r.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside>
          <div className="card sticky top-24 p-6">
            <h3 className="font-bold">Skills & expertise</h3>
            <div className="mt-3 flex flex-wrap gap-2">{creator.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            <dl className="mt-6 space-y-3 border-t border-ink-100 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Experience</dt><dd className="font-semibold text-ink-900">{creator.experience} years</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Location</dt><dd className="font-semibold text-ink-900">{creator.location}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Services</dt><dd className="font-semibold text-ink-900">{creatorServices.length}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Projects</dt><dd className="font-semibold text-ink-900">{creator.portfolio.length}</dd></div>
            </dl>
            <Link to={firstServiceId ? `/inquiry?service=${firstServiceId}` : '/inquiry'} className="btn-primary mt-6 w-full">Send Inquiry</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
