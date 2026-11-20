import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import Icon from './Icons'
import Logo from './Logo'

const social = [
  { name: 'twitter', label: 'Twitter' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'linkedin', label: 'LinkedIn' },
  { name: 'dribbble', label: 'Dribbble' },
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink-900 text-ink-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-ink-300">
            A marketplace where talented designers, developers and creators meet clients with great ideas.
          </p>
          <div className="mt-5 flex gap-2">
            {social.map((s) => (
              <a key={s.name} href="#top" onClick={(e) => e.preventDefault()} aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-600">
                <Icon name={s.name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services" className="hover:text-white">Explore Services</Link></li>
            <li><Link to="/creators" className="hover:text-white">Creators</Link></li>
            <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Categories</h4>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}><Link to={`/services?category=${encodeURIComponent(c.name)}`} className="hover:text-white">{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/inquiry" className="hover:text-white">Send an Inquiry</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Creator Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-ink-500">
        &copy; {new Date().getFullYear()} CreatorSpace. A frontend demo project - all data is sample data.
      </div>
    </footer>
  )
}
