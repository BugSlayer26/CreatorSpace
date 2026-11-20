import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { categoryNames } from '../data/categories'
import DashHeader from '../components/DashHeader'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import SafeImage from '../components/SafeImage'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icons'

const blank = { title: '', category: categoryNames[0], description: '', image: '' }

export default function MyPortfolio() {
  const { currentCreator, addProject, updateProject, deleteProject } = useApp()
  const [params, setParams] = useSearchParams()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [toDelete, setToDelete] = useState(null)

  const projects = currentCreator.portfolio

  const openNew = () => { setForm(blank); setErrors({}); setEditing('new') }
  const openEdit = (p) => { setForm({ title: p.title, category: p.category, description: p.description, image: p.image }); setErrors({}); setEditing(p) }
  const close = () => setEditing(null)

  useEffect(() => {
    if (params.get('new') === '1') { openNew(); setParams({}, { replace: true }) }
  }, []) // eslint-disable-line

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = (ev) => {
    ev.preventDefault()
    const e = {}
    if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters.'
    if (form.description.trim().length < 10) e.description = 'Add a short description (10+ characters).'
    if (form.image && !/^https?:\/\//i.test(form.image.trim())) e.image = 'Image must be a URL starting with http(s)://'
    setErrors(e)
    if (Object.keys(e).length) return
    const data = { title: form.title.trim(), category: form.category, description: form.description.trim(), image: form.image.trim() }
    if (editing === 'new') addProject(currentCreator.id, data)
    else updateProject(currentCreator.id, editing.id, data)
    close()
  }

  const err = (k) => errors[k] && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors[k]}</p>
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`

  return (
    <div>
      <DashHeader title="My Portfolio" subtitle={`${projects.length} ${projects.length === 1 ? 'project' : 'projects'} showcased`}
        action={<button onClick={openNew} className="btn-primary"><Icon name="plus" className="h-4 w-4" /> Add project</button>} />

      {projects.length === 0 ? (
        <EmptyState icon="image" title="Your portfolio is empty" message="Add projects to show clients the quality of your work." actionLabel="Add project" onAction={openNew} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <article key={p.id} className="card overflow-hidden">
              <SafeImage src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <span className="chip">{p.category}</span>
                <h3 className="mt-2 font-bold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-500">{p.description}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(p)} className="btn-secondary flex-1 !py-2"><Icon name="edit" className="h-4 w-4" /> Edit</button>
                  <button onClick={() => setToDelete(p)} className="btn-secondary !px-3 !py-2 hover:!border-red-500 hover:!text-red-600" aria-label={`Delete ${p.title}`}><Icon name="trash" className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={close} title={editing === 'new' ? 'Add portfolio project' : 'Edit project'}>
        <form onSubmit={save} noValidate className="space-y-4">
          <div><label htmlFor="pj-title" className="label">Project title *</label><input id="pj-title" className={cls('title')} value={form.title} onChange={(e) => set('title', e.target.value)} />{err('title')}</div>
          <div><label htmlFor="pj-cat" className="label">Category *</label><select id="pj-cat" className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>{categoryNames.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label htmlFor="pj-desc" className="label">Description *</label><textarea id="pj-desc" rows={3} className={cls('description')} value={form.description} onChange={(e) => set('description', e.target.value)} />{err('description')}</div>
          <div><label htmlFor="pj-img" className="label">Image URL <span className="font-normal text-ink-500">(optional)</span></label><input id="pj-img" className={cls('image')} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://..." />{err('image')}</div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={close} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing === 'new' ? 'Add project' : 'Save changes'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(toDelete)} title="Delete project?" message={`"${toDelete?.title}" will be removed from your portfolio.`}
        onCancel={() => setToDelete(null)} onConfirm={() => { deleteProject(currentCreator.id, toDelete.id); setToDelete(null) }} />
    </div>
  )
}
