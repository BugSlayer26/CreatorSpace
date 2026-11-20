import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SafeImage from '../components/SafeImage'
import Icon from '../components/Icons'

const nav = [
  { to: '/dashboard', label: 'Overview', icon: 'grid', end: true },
  { to: '/dashboard/profile', label: 'My Profile', icon: 'user' },
  { to: '/dashboard/services', label: 'My Services', icon: 'briefcase' },
  { to: '/dashboard/portfolio', label: 'My Portfolio', icon: 'image' },
  { to: '/dashboard/inquiries', label: 'Inquiries', icon: 'inbox' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'settings' },
]

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-700 hover:bg-ink-100'}`

export default function Dashboard() {
  const { currentCreator, settings } = useApp()
  const [open, setOpen] = useState(false)

  const sidebar = (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {nav.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} className={itemClass} onClick={() => setOpen(false)}>
          <Icon name={n.icon} className="h-5 w-5" /> {n.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="bg-ink-100/60">
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[260px_1fr] lg:py-8">
        {/* Mobile bar */}
        <div className="card flex items-center justify-between p-3 lg:hidden">
          <div className="flex items-center gap-3">
            <SafeImage src={currentCreator.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div><p className="text-sm font-bold leading-tight">{currentCreator.name}</p><p className="text-xs text-ink-500">Creator Dashboard</p></div>
          </div>
          <button onClick={() => setOpen((o) => !o)} className="btn-secondary !px-3" aria-expanded={open} aria-label="Toggle dashboard menu">
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
        {open && <div className="card p-3 lg:hidden">{sidebar}</div>}

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-4">
            <div className="mb-4 flex items-center gap-3 border-b border-ink-100 pb-4">
              <SafeImage src={currentCreator.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate font-bold text-ink-900">{currentCreator.name}</p>
                <p className="truncate text-xs text-ink-500">{currentCreator.title}</p>
              </div>
            </div>
            {sidebar}
            <p className={`mt-4 rounded-xl px-3 py-2 text-xs ${settings.availableForWork ? 'bg-green-50 text-green-700' : 'bg-ink-100 text-ink-500'}`}>
              {settings.availableForWork ? 'Available for new work' : 'Not taking new work'}
            </p>
          </div>
        </aside>

        <div className="min-w-0"><Outlet /></div>
      </div>
    </div>
  )
}
