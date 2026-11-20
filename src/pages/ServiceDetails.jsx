import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../utils/helpers'
import SafeImage from '../components/SafeImage'
import Rating from '../components/Rating'
import WishlistButton from '../components/WishlistButton'
import ServiceCard from '../components/ServiceCard'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icons'

export default function ServiceDetails() {
  const { id } = useParams()
  const { getService, getCreator, services } = useApp()
  const service = getService(id)
  const [activeImage, setActiveImage] = useState(0)
  const [activePackage, setActivePackage] = useState(0)

  if (!service) {
    return (
      <div className="container-page py-20">
        <EmptyState icon="alert" title="Service not found" message="This service may have been removed or the link is incorrect." actionLabel="Browse services" actionTo="/services" />
      </div>
    )
  }

  const creator = getCreator(service.creatorId)
  const gallery = service.gallery?.length ? service.gallery : [service.image]
  const pkg = service.packages[activePackage] || service.packages[0]
  const reviews = creator?.reviews || []
  const related = services
    .filter((s) => s.id !== service.id && (s.category === service.category || s.creatorId === service.creatorId))
    .sort((a, b) => Number(b.category === service.category) - Number(a.category === service.category))
    .slice(0, 3)

  return (
    <div className="container-page py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-600">Home</Link> /
        <Link to="/services" className="hover:text-brand-600">Services</Link> /
        <Link to={`/services?category=${encodeURIComponent(service.category)}`} className="hover:text-brand-600">{service.category}</Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Main column */}
        <div className="min-w-0">
          <span className="chip">{service.category}</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{service.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Rating value={service.rating} count={service.reviewsCount} size="lg" />
            <span className="flex items-center gap-1 text-ink-500"><Icon name="clock" className="h-4 w-4" /> {service.deliveryDays}-day delivery</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl bg-ink-100">
            <SafeImage src={gallery[activeImage] || gallery[0]} alt={service.title} className="aspect-[16/10] w-full object-cover" loading="eager" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} aria-label={`Show image ${i + 1}`} className={`overflow-hidden rounded-xl border-2 transition ${i === activeImage ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <SafeImage src={img} alt="" className="aspect-[16/10] w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-bold">About this service</h2>
            <p className="mt-3 leading-relaxed text-ink-700">{service.description}</p>
            {service.skills?.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-ink-500">Skills & expertise</h3>
                <div className="flex flex-wrap gap-2">{service.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </div>
            )}
          </section>

          {creator && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-bold">About the creator</h2>
              <div className="card flex flex-col gap-5 p-6 sm:flex-row">
                <SafeImage src={creator.avatar} alt={creator.name} className="h-20 w-20 shrink-0 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-bold">{creator.name}</h3>
                  <p className="text-sm font-medium text-brand-600">{creator.title}</p>
                  <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-ink-500">
                    <span className="flex items-center gap-1"><Icon name="pin" className="h-4 w-4" />{creator.location}</span>
                    <span className="flex items-center gap-1"><Icon name="briefcase" className="h-4 w-4" />{creator.experience} years experience</span>
                  </p>
                  <p className="mt-3 text-sm text-ink-700">{creator.shortBio}</p>
                  <Link to={`/creators/${creator.id}`} className="btn-secondary mt-4">View full profile</Link>
                </div>
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold">Client reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-ink-500">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink-900">{r.author}</span>
                      <Rating value={r.rating} />
                    </div>
                    <p className="mt-2 text-sm text-ink-700">{r.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Pricing sidebar */}
        <aside>
          <div className="card sticky top-24 overflow-hidden">
            <div role="tablist" aria-label="Packages" className="grid grid-cols-3 border-b border-ink-100">
              {service.packages.map((p, i) => (
                <button key={p.name} role="tab" aria-selected={i === activePackage} onClick={() => setActivePackage(i)}
                  className={`px-2 py-3.5 text-sm font-semibold transition ${i === activePackage ? 'border-b-2 border-brand-600 bg-brand-50 text-brand-700' : 'text-ink-500 hover:text-ink-900'}`}>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="p-6">
              <p className="text-3xl font-extrabold text-ink-900">{formatPrice(pkg.price)}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500"><Icon name="clock" className="h-4 w-4" /> {pkg.delivery}-day delivery</p>
              <ul className="mt-5 space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link to={`/inquiry?service=${service.id}&package=${pkg.name}`} className="btn-primary mt-6 w-full">Send Inquiry</Link>
              <div className="mt-3"><WishlistButton serviceId={service.id} variant="full" /></div>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold">Related services</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
