import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import Icon from './Icons'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Explore Services' },
  { to: '/creators', label: 'Creators' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
]

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-100 hover:text-ink-900'}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count } = useWishlist()
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  const wishlistLink = (
    <Link to="/wishlist" aria-label={`Wishlist, ${count} saved`} className="relative rounded-xl p-2.5 text-ink-700 transition hover:bg-ink-100">
      <Icon name="heart" className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>)}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {wishlistLink}
          <Link to="/dashboard" className="btn-ghost">Creator Dashboard</Link>
          <Link to="/services" className="btn-primary">Get Started</Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          {wishlistLink}
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu" className="rounded-xl p-2.5 text-ink-700 hover:bg-ink-100">
            <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>)}
            <NavLink to="/wishlist" className={linkClass}>Wishlist ({count})</NavLink>
            <NavLink to="/dashboard" className={linkClass}>Creator Dashboard</NavLink>
            <Link to="/services" className="btn-primary mt-3">Get Started</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
