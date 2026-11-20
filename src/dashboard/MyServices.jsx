import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { categoryNames } from '../data/categories'
import { formatPrice } from '../utils/helpers'
import DashHeader from '../components/DashHeader'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import SafeImage from '../components/SafeImage'
import EmptyState from '../components/EmptyState'
import Rating from '../components/Rating'
import Icon from '../components/Icons'

const blank = { title: '', category: categoryNames[0], shortDescription: '', description: '', price: '', deliveryDays: '3', image: '', skills: '' }

export default function MyServices() {
  const { currentCreator, services, addService, updateService, deleteService } = useApp()
  const [params, setParams] = useSearchParams()
  const [editing, setEditing] = useState(null) // null | 'new' | service
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [toDelete, setToDelete] = useState(null)

  const mine = services.filter((s) => s.creatorId === currentCreator.id)

  const openNew = () => { setForm(blank); setErrors({}); setEditing('new') }
  const openEdit = (s) => {
    setForm({ title: s.title, category: s.category, shortDescription: s.shortDescription, description: s.description, price: String(s.price), deliveryDays: String(s.deliveryDays), image: s.image, skills: (s.skills || []).join(', ') })
    setErrors({}); setEditing(s)
  }
  const close = () => setEditing(null)

  // Support the "Add service" quick action from the overview page.
  useEffect(() => {
    if (params.get('new') === '1') { openNew(); setParams({}, { replace: true }) }
  }, []) // eslint-disable-line

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.'
    if (!form.category) e.category = 'Choose a category.'
    if (form.shortDescription.trim().length < 10) e.shortDescription = 'Add a short description (10+ characters).'
    if (form.price === '' || Number(form.price) <= 0 || Number.isNaN(Number(form.price))) e.price = 'Enter a price greater than 0.'
    if (!form.deliveryDays || Number(form.deliveryDays) < 1) e.deliveryDays = 'Delivery must be at least 1 day.'
    if (form.image && !/^https?:\/\//i.test(form.image.trim())) e.image = 'Image must be a URL starting with http(s)://'
    return e
  }

  const save = (ev) => {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return
    const data = {
      title: form.title.trim(), category: form.category, shortDescription: form.shortDescription.trim(),
      description: form.description.trim() || form.shortDescription.trim(),
      price: Number(form.price), deliveryDays: Number(form.deliveryDays), image: form.image.trim(),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    }
    if (editing === 'new') addService(currentCreator.id, data)
    else updateService(editing.id, data)
    close()
  }

  const err = (k) => errors[k] && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors[k]}</p>
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`

  return (
    <div>
      <DashHeader title="My Services" subtitle={`${mine.length} listed ${mine.length === 1 ? 'service' : 'services'}`}
        action={<button onClick={openNew} className="btn-primary"><Icon name="plus" className="h-4 w-4" /> Add service</button>} />

      {mine.length === 0 ? (
        <EmptyState icon="briefcase" title="No services yet" message="List your first service so clients can discover and hire you." actionLabel="Add service" onAction={openNew} />
      ) : (
        <div className="grid gap-4">
          {mine.map((s) => (
            <article key={s.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <SafeImage src={s.image} alt={s.title} className="aspect-video w-full rounded-xl object-cover sm:h-24 sm:w-40 sm:shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="chip">{s.category}</span>
                <h3 className="mt-1.5 line-clamp-1 font-bold">{s.title}</h3>
                <p className="line-clamp-1 text-sm text-ink-500">{s.shortDescription}</p>
                <div className="mt-1.5 flex items-center gap-4 text-sm">
                  <span className="font-bold text-ink-900">{formatPrice(s.price)}</span>
                  <Rating value={s.rating} />
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/services/${s.id}`} className="btn-ghost !px-3" aria-label={`View ${s.title}`}><Icon name="eye" className="h-4 w-4" /></Link>
                <button onClick={() => openEdit(s)} className="btn-secondary !px-3" aria-label={`Edit ${s.title}`}><Icon name="edit" className="h-4 w-4" /></button>
                <button onClick={() => setToDelete(s)} className="btn-secondary !px-3 hover:!border-red-500 hover:!text-red-600" aria-label={`Delete ${s.title}`}><Icon name="trash" className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={close} title={editing === 'new' ? 'Add service' : 'Edit service'} wide>
        <form onSubmit={save} noValidate className="space-y-4">
          <div><label htmlFor="sv-title" className="label">Title *</label><input id="sv-title" className={cls('title')} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="I will design..." />{err('title')}</div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1"><label htmlFor="sv-cat" className="label">Category *</label>
              <select id="sv-cat" className={cls('category')} value={form.category} onChange={(e) => set('category', e.target.value)}>{categoryNames.map((c) => <option key={c}>{c}</option>)}</select>{err('category')}</div>
            <div><label htmlFor="sv-price" className="label">Starting price (USD) *</label><input id="sv-price" type="number" min="1" className={cls('price')} value={form.price} onChange={(e) => set('price', e.target.value)} />{err('price')}</div>
            <div><label htmlFor="sv-days" className="label">Delivery (days) *</label><input id="sv-days" type="number" min="1" className={cls('deliveryDays')} value={form.deliveryDays} onChange={(e) => set('deliveryDays', e.target.value)} />{err('deliveryDays')}</div>
          </div>
          <div><label htmlFor="sv-short" className="label">Short description *</label><input id="sv-short" maxLength={140} className={cls('shortDescription')} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />{err('shortDescription')}</div>
          <div><label htmlFor="sv-desc" className="label">Full description</label><textarea id="sv-desc" rows={4} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div><label htmlFor="sv-skills" className="label">Skills <span className="font-normal text-ink-500">(comma separated)</span></label><input id="sv-skills" className="input" value={form.skills} onChange={(e) => set('skills', e.target.value)} /></div>
          <div><label htmlFor="sv-img" className="label">Image URL <span className="font-normal text-ink-500">(optional)</span></label><input id="sv-img" className={cls('image')} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://..." />{err('image')}<p className="mt-1 text-xs text-ink-500">Leave empty to use a category image.</p></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={close} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing === 'new' ? 'Add service' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(toDelete)} title="Delete service?" message={`"${toDelete?.title}" will be removed from the marketplace. This cannot be undone.`}
        onCancel={() => setToDelete(null)} onConfirm={() => { deleteService(toDelete.id); setToDelete(null) }} />
    </div>
  )
}
