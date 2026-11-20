import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useWishlist } from '../context/WishlistContext'
import DashHeader from '../components/DashHeader'
import ConfirmDialog from '../components/ConfirmDialog'

function Toggle({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div><label htmlFor={id} className="font-semibold text-ink-900">{label}</label><p className="text-sm text-ink-500">{description}</p></div>
      <button id={id} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-ink-300'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

export default function Settings() {
  const { settings, updateSettings, creators, resetDemoData } = useApp()
  const { clearWishlist } = useWishlist()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div>
      <DashHeader title="Settings" subtitle="Profile and dashboard preferences saved on this device." />
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="text-lg font-bold">Dashboard profile</h2>
          <p className="mt-1 text-sm text-ink-500">There is no login in this demo. Choose which creator account you want to manage.</p>
          <label htmlFor="st-creator" className="label mt-4">Managing as</label>
          <select id="st-creator" className="input max-w-sm" value={settings.currentCreatorId} onChange={(e) => updateSettings({ currentCreatorId: e.target.value })}>
            {creators.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.title}</option>)}
          </select>
        </section>

        <section className="card divide-y divide-ink-100 px-6">
          <Toggle id="st-avail" label="Available for new work" description="Show an availability badge in your dashboard." checked={settings.availableForWork} onChange={(v) => updateSettings({ availableForWork: v })} />
          <Toggle id="st-email" label="Show email on public profile" description="Display your contact email on your creator profile page." checked={settings.showEmailPublicly} onChange={(v) => updateSettings({ showEmailPublicly: v })} />
          <Toggle id="st-notify" label="Inquiry email notifications" description="Preference only - no emails are sent in this demo." checked={settings.emailNotifications} onChange={(v) => updateSettings({ emailNotifications: v })} />
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold">Data</h2>
          <p className="mt-1 text-sm text-ink-500">All data lives in your browser's LocalStorage. Reset it to restore the original sample data.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={clearWishlist} className="btn-secondary">Clear wishlist</button>
            <button onClick={() => setConfirmReset(true)} className="btn-danger">Reset demo data</button>
          </div>
        </section>
      </div>

      <ConfirmDialog open={confirmReset} title="Reset demo data?" confirmLabel="Reset" message="Creators, services, portfolio, inquiries and settings will be restored to the original sample data. Your wishlist is kept."
        onCancel={() => setConfirmReset(false)} onConfirm={() => { resetDemoData(); setConfirmReset(false) }} />
    </div>
  )
}
