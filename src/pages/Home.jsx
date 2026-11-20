import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { categories } from '../data/categories'
import SectionHeading from '../components/SectionHeading'
import SearchBar from '../components/SearchBar'
import CategoryCard from '../components/CategoryCard'
import ServiceCard from '../components/ServiceCard'
import CreatorCard from '../components/CreatorCard'
import SafeImage from '../components/SafeImage'
import Icon from '../components/Icons'
import { unsplash } from '../data/images'

const steps = [
  { icon: 'search', title: 'Discover services', text: 'Browse categories or search by skill, keyword and budget to find the right fit.' },
  { icon: 'users', title: 'Choose a creator', text: 'Compare portfolios, ratings and reviews to pick the creator you trust.' },
  { icon: 'mail', title: 'Submit your inquiry', text: 'Share your project details and budget with a simple inquiry form.' },
]

const reasons = [
  { icon: 'globe', title: 'Diverse creative talent', text: 'Designers, developers, editors, writers and more in one place.' },
  { icon: 'zap', title: 'Easy service discovery', text: 'Powerful search and filters help you find the right service fast.' },
  { icon: 'award', title: 'Professional portfolios', text: 'Real project work and reviews so you can hire with confidence.' },
  { icon: 'shield', title: 'Simple inquiry process', text: 'Describe your project once and get in touch without the hassle.' },
]

const heroImages = [
  'photo-1561070791-2526d30994b5',
  'photo-1551650975-87deedd944c3',
  'photo-1574717024653-61fd2cf4d44d',
  'photo-1452587925148-ce544e77e70d',
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { services, creators } = useApp()

  const featuredServices = [...services].sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount).slice(0, 8)
  const featuredCreators = creators.slice(0, 4)
  const countFor = (name) => services.filter((s) => s.category === name).length

  const search = (q) => navigate(q.trim() ? `/services?q=${encodeURIComponent(q.trim())}` : '/services')

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="chip mb-5">Creative marketplace</span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find the creative talent <span className="text-brand-600">your project deserves</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-500">
              Discover designers, developers, editors and storytellers. Explore portfolios, compare services and send your project inquiry in minutes.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar large value={query} onChange={setQuery} onSubmit={search} buttonLabel="Search" placeholder="Try &quot;logo design&quot; or &quot;React&quot;" />
              <p className="mt-3 text-sm text-ink-500">
                Popular:{' '}
                {['Logo Design', 'React', 'SEO', 'Video'].map((t, i) => (
                  <button key={t} onClick={() => search(t)} className="mr-2 font-medium text-ink-700 underline-offset-2 hover:text-brand-600 hover:underline">
                    {t}{i < 3 ? ',' : ''}
                  </button>
                ))}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services" className="btn-primary">Explore Services <Icon name="arrowRight" className="h-4 w-4" /></Link>
              <Link to="/dashboard" className="btn-secondary">Become a Creator</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[[`${creators.length}+`, 'Creators'], [`${services.length}+`, 'Services'], ['4.8', 'Avg. rating']].map(([v, l]) => (
                <div key={l}><dt className="text-sm text-ink-500">{l}</dt><dd className="text-2xl font-extrabold text-ink-900">{v}</dd></div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4">
            {heroImages.map((id, i) => (
              <div key={id} className={`overflow-hidden rounded-3xl shadow-lift ${i % 2 === 1 ? 'mt-8' : ''}`}>
                <SafeImage src={unsplash(id, 600)} alt="Creative work sample" className="aspect-[4/5] h-full w-full object-cover" loading="eager" />
              </div>
            ))}
            <div className="absolute -left-2 bottom-6 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-lift sm:-left-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"><Icon name="check" /></span>
              <div><p className="text-sm font-bold text-ink-900">Project delivered</p><p className="text-xs text-ink-500">Rated 5.0 by client</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20" id="categories">
        <div className="container-page">
          <SectionHeading eyebrow="Categories" title="Explore popular categories" subtitle="From brand identity to web development, find the skills your project needs." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => <CategoryCard key={c.id} category={c} count={countFor(c.name)} />)}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="bg-ink-100/60 py-20">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="Featured" title="Top-rated services" subtitle="Hand-picked services loved by clients."
            action={<Link to="/services" className="btn-secondary self-start sm:self-auto">View all services</Link>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      {/* Featured creators */}
      <section className="py-20">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="Creators" title="Meet featured creators" subtitle="Experienced professionals with proven portfolios."
            action={<Link to="/creators" className="btn-secondary self-start sm:self-auto">See all creators</Link>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCreators.map((c) => <CreatorCard key={c.id} creator={c} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink-900 py-20 text-white">
        <div className="container-page">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-300">How it works</p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Hire creative talent in three steps</h2>
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
                <span className="absolute right-6 top-4 font-display text-5xl font-extrabold text-white/10">0{i + 1}</span>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600"><Icon name={s.icon} className="h-6 w-6" /></span>
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-300">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Why CreatorSpace" title="Built for clients and creators" subtitle="Everything you need to discover, evaluate and connect with great talent." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="card p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon name={r.icon} /></span>
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-page">
          <div className="rounded-3xl bg-brand-600 px-6 py-14 text-center sm:px-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to start your next project?</h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">Browse services today, or join as a creator and showcase your work to clients.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/services" className="btn bg-white text-brand-700 hover:bg-brand-50">Explore Services</Link>
              <Link to="/dashboard" className="btn border border-white/40 text-white hover:bg-white/10">Become a Creator</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
