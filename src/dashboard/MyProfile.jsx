import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import DashHeader from '../components/DashHeader'
import SafeImage from '../components/SafeImage'
import Icon from '../components/Icons'
import { isValidEmail } from '../utils/helpers'

const toForm = (c) => ({
  name: c.name, title: c.title, location: c.location, experience: String(c.experience),
  email: c.email || '', avatar: c.avatar, shortBio: c.shortBio, bio: c.bio, skills: c.skills.join(', '),
})

export default function MyProfile() {
  const { currentCreator, updateCreator } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(toForm(currentCreator))
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(toForm(currentCreator)); setEditing(false); setErrors({}) }, [currentCreator.id]) // eslint-disable-line

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.title.trim()) e.title = 'Professional title is required.'
    if (!form.location.trim()) e.location = 'Location is required.'
    if (form.experience === '' || Number(form.experience) < 0 || Number.isNaN(Number(form.experience))) e.experience = 'Enter a valid number of years.'
    if (form.email && !isValidEmail(form.email)) e.email = 'Enter a valid email address.'
    if (form.bio.trim().length < 20) e.bio = 'Bio should be at least 20 characters.'
    if (!form.skills.split(',').some((s) => s.trim())) e.skills = 'Add at least one skill.'
    return e
  }

  const save = (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return
    updateCreator(currentCreator.id, {
      name: form.name.trim(), title: form.title.trim(), location: form.location.trim(),
      experience: Number(form.experience), email: form.email.trim(),
      avatar: form.avatar.trim() || currentCreator.avatar,
      shortBio: form.shortBio.trim() || form.bio.trim().slice(0, 110),
      bio: form.bio.trim(),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const cancel = () => { setForm(toForm(currentCreator)); setErrors({}); setEditing(false) }
  const err = (k) => errors[k] && <p role="alert" className="mt-1.5 text-sm text-red-600">{errors[k]}</p>
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`

  return (
    <div>
      <DashHeader title="My Profile" subtitle="This is how clients see you across CreatorSpace."
        action={!editing && <button onClick={() => setEditing(true)} className="btn-primary"><Icon name="edit" className="h-4 w-4" /> Edit profile</button>} />

      {saved && <div role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700"><Icon name="check" className="h-4 w-4" /> Profile saved successfully.</div>}

      {!editing ? (
        <div className="card p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <SafeImage src={currentCreator.avatar} alt={currentCreator.name} className="h-28 w-28 rounded-full object-cover" />
            <div className="min-w-0">
              <h2 className="text-2xl font-extrabold">{currentCreator.name}</h2>
              <p className="font-medium text-brand-600">{currentCreator.title}</p>
              <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-500">
                <span className="flex items-center gap-1"><Icon name="pin" className="h-4 w-4" />{currentCreator.location}</span>
                <span className="flex items-center gap-1"><Icon name="briefcase" className="h-4 w-4" />{currentCreator.experience} years</span>
                {currentCreator.email && <span className="flex items-center gap-1"><Icon name="mail" className="h-4 w-4" />{currentCreator.email}</span>}
              </p>
            </div>
          </div>
          <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-ink-500">Short bio</h3>
          <p className="mt-2 text-ink-700">{currentCreator.shortBio}</p>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-ink-500">About</h3>
          <p className="mt-2 leading-relaxed text-ink-700">{currentCreator.bio}</p>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-ink-500">Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">{currentCreator.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        </div>
      ) : (
        <form onSubmit={save} noValidate className="card space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="pf-name" className="label">Full name *</label><input id="pf-name" className={cls('name')} value={form.name} onChange={(e) => set('name', e.target.value)} />{err('name')}</div>
            <div><label htmlFor="pf-title" className="label">Professional title *</label><input id="pf-title" className={cls('title')} value={form.title} onChange={(e) => set('title', e.target.value)} />{err('title')}</div>
            <div><label htmlFor="pf-loc" className="label">Location *</label><input id="pf-loc" className={cls('location')} value={form.location} onChange={(e) => set('location', e.target.value)} />{err('location')}</div>
            <div><label htmlFor="pf-exp" className="label">Years of experience *</label><input id="pf-exp" type="number" min="0" className={cls('experience')} value={form.experience} onChange={(e) => set('experience', e.target.value)} />{err('experience')}</div>
            <div><label htmlFor="pf-email" className="label">Contact email</label><input id="pf-email" type="email" className={cls('email')} value={form.email} onChange={(e) => set('email', e.target.value)} />{err('email')}</div>
            <div><label htmlFor="pf-avatar" className="label">Profile image URL</label><input id="pf-avatar" className="input" value={form.avatar} onChange={(e) => set('avatar', e.target.value)} placeholder="https://..." /></div>
          </div>
          <div><label htmlFor="pf-short" className="label">Short bio</label><input id="pf-short" className="input" maxLength={140} value={form.shortBio} onChange={(e) => set('shortBio', e.target.value)} /><p className="mt-1 text-xs text-ink-500">Shown on creator cards ({form.shortBio.length}/140)</p></div>
          <div><label htmlFor="pf-bio" className="label">About *</label><textarea id="pf-bio" rows={5} className={cls('bio')} value={form.bio} onChange={(e) => set('bio', e.target.value)} />{err('bio')}</div>
          <div><label htmlFor="pf-skills" className="label">Skills * <span className="font-normal text-ink-500">(comma separated)</span></label><input id="pf-skills" className={cls('skills')} value={form.skills} onChange={(e) => set('skills', e.target.value)} />{err('skills')}</div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">Save changes</button>
            <button type="button" onClick={cancel} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
