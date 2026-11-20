import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatDate, formatPrice } from '../utils/helpers'
import DashHeader from '../components/DashHeader'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icons'

const statuses = ['Pending', 'Reviewed', 'Completed']

export default function Inquiries() {
  const { currentCreator, services, inquiries, getService, updateInquiryStatus, deleteInquiry } = useApp()
  const [filter, setFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const myIds = new Set(services.filter((s) => s.creatorId === currentCreator.id).map((s) => s.id))
  const mine = inquiries.filter((i) => myIds.has(i.serviceId))
  const shown = filter === 'All' ? mine : mine.filter((i) => i.status === filter)
  const selected = mine.find((i) => i.id === selectedId)

  return (
    <div>
      <DashHeader title="Inquiries" subtitle="Project requests sent by clients for your services." />

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {['All', ...statuses].map((s) => {
          const count = s === 'All' ? mine.length : mine.filter((i) => i.status === s).length
          return (
            <button key={s} role="tab" aria-selected={filter === s} onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === s ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 shadow-card hover:text-brand-600'}`}>
              {s} ({count})
            </button>
          )
        })}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="inbox" title={mine.length === 0 ? 'No inquiries yet' : `No ${filter.toLowerCase()} inquiries`}
          message={mine.length === 0 ? 'When clients submit the inquiry form for one of your services, it will appear here.' : 'Try another status filter.'}
          actionLabel={mine.length === 0 ? 'Send a test inquiry' : undefined} actionTo="/inquiry" />
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden grid-cols-[1.4fr_1.4fr_100px_120px_130px] gap-4 border-b border-ink-100 bg-ink-100/60 px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-500 md:grid">
            <span>Client / Project</span><span>Service</span><span>Budget</span><span>Deadline</span><span>Status</span>
          </div>
          <ul className="divide-y divide-ink-100">
            {shown.map((i) => (
              <li key={i.id}>
                <button onClick={() => setSelectedId(i.id)} className="grid w-full gap-1 px-5 py-4 text-left transition hover:bg-brand-50/50 md:grid-cols-[1.4fr_1.4fr_100px_120px_130px] md:items-center md:gap-4">
                  <span className="min-w-0"><span className="block truncate font-semibold text-ink-900">{i.projectTitle}</span><span className="block truncate text-sm text-ink-500">{i.clientName} - {i.email}</span></span>
                  <span className="truncate text-sm text-ink-700">{getService(i.serviceId)?.title || 'Service removed'}</span>
                  <span className="text-sm font-semibold text-ink-900">{formatPrice(i.budget)}</span>
                  <span className="text-sm text-ink-500">{formatDate(i.deadline)}</span>
                  <span><StatusBadge status={i.status} /></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} title="Inquiry details" wide>
        {selected && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="text-xl font-extrabold">{selected.projectTitle}</h3><p className="text-sm text-ink-500">Received {formatDate(selected.createdAt)}</p></div>
              <StatusBadge status={selected.status} />
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-ink-500">Client</dt><dd className="font-semibold text-ink-900">{selected.clientName}</dd></div>
              <div><dt className="text-ink-500">Email</dt><dd><a href={`mailto:${selected.email}`} className="font-semibold text-brand-600 hover:underline">{selected.email}</a></dd></div>
              <div><dt className="text-ink-500">Service</dt><dd className="font-semibold text-ink-900">{getService(selected.serviceId)?.title || 'Service removed'}</dd></div>
              <div><dt className="text-ink-500">Budget</dt><dd className="font-semibold text-ink-900">{formatPrice(selected.budget)}</dd></div>
              <div><dt className="text-ink-500">Preferred deadline</dt><dd className="font-semibold text-ink-900">{formatDate(selected.deadline)}</dd></div>
            </dl>
            <h4 className="mt-5 text-sm text-ink-500">Project description</h4>
            <p className="mt-1 whitespace-pre-line rounded-xl bg-ink-100/60 p-4 text-sm leading-relaxed text-ink-700">{selected.description}</p>

            <div className="mt-6 border-t border-ink-100 pt-5">
              <label htmlFor="inq-status" className="label">Update status</label>
              <div className="flex flex-wrap items-center gap-3">
                <select id="inq-status" className="input !w-auto" value={selected.status} onChange={(e) => updateInquiryStatus(selected.id, e.target.value)}>
                  {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => setToDelete(selected)} className="btn-secondary hover:!border-red-500 hover:!text-red-600"><Icon name="trash" className="h-4 w-4" /> Delete</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(toDelete)} title="Delete inquiry?" message="This inquiry will be permanently removed."
        onCancel={() => setToDelete(null)} onConfirm={() => { deleteInquiry(toDelete.id); setToDelete(null); setSelectedId(null) }} />
    </div>
  )
}
