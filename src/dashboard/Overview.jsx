import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useWishlist } from '../context/WishlistContext'
import { formatDate, formatPrice } from '../utils/helpers'
import DashHeader from '../components/DashHeader'
import Icon from '../components/Icons'
import StatusBadge from '../components/StatusBadge'

export default function Overview() {
  const { currentCreator, services, inquiries, getService } = useApp()
  const { wishlist } = useWishlist()

  const myServices = services.filter((s) => s.creatorId === currentCreator.id)
  const myIds = new Set(myServices.map((s) => s.id))
  const myInquiries = inquiries.filter((i) => myIds.has(i.serviceId))
  const savedCount = wishlist.filter((id) => myIds.has(id)).length
  const pending = myInquiries.filter((i) => i.status === 'Pending').length
  const recent = myInquiries.slice(0, 4)

  const stats = [
    { label: 'Listed services', value: myServices.length, icon: 'briefcase' },
    { label: 'Portfolio projects', value: currentCreator.portfolio.length, icon: 'image' },
    { label: 'Inquiries received', value: myInquiries.length, icon: 'inbox', note: `${pending} pending` },
    { label: 'Saved by visitors', value: savedCount, icon: 'heart', note: 'In your wishlist' },
  ]

  return (
    <div>
      <DashHeader title={`Welcome back, ${currentCreator.name.split(' ')[0]}`} subtitle="Here is what is happening with your creative business." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-500">{s.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon name={s.icon} className="h-5 w-5" /></span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-ink-900">{s.value}</p>
            {s.note && <p className="mt-1 text-xs text-ink-500">{s.note}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent inquiries</h2>
            <Link to="/dashboard/inquiries" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-500">No inquiries yet. They will show up here when clients contact you.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recent.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{i.projectTitle}</p>
                    <p className="truncate text-sm text-ink-500">{i.clientName} - {getService(i.serviceId)?.title || 'Service removed'}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-ink-500">{formatPrice(i.budget)}</span>
                    <StatusBadge status={i.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-lg font-bold">Quick actions</h2>
          <div className="flex flex-col gap-3">
            <Link to="/dashboard/services?new=1" className="btn-primary"><Icon name="plus" className="h-4 w-4" /> Add service</Link>
            <Link to="/dashboard/portfolio?new=1" className="btn-secondary"><Icon name="plus" className="h-4 w-4" /> Add portfolio project</Link>
            <Link to="/dashboard/profile" className="btn-secondary"><Icon name="edit" className="h-4 w-4" /> Edit profile</Link>
            <Link to={`/creators/${currentCreator.id}`} className="btn-ghost"><Icon name="eye" className="h-4 w-4" /> View public profile</Link>
          </div>
          <p className="mt-5 text-xs text-ink-500">Member since {formatDate('2023-03-01')}</p>
        </section>
      </div>
    </div>
  )
}
