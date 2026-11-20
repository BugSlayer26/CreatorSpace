import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isValidEmail } from '../utils/helpers'
import Icon from '../components/Icons'

const today = () => new Date().toISOString().slice(0, 10)

const validate = (v) => {
  const e = {}
  if (!v.clientName.trim()) e.clientName = 'Please enter your name.'
  else if (v.clientName.trim().length < 2) e.clientName = 'Name must be at least 2 characters.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!isValidEmail(v.email.trim())) e.email = 'Enter a valid email, e.g. name@example.com.'
  if (!v.serviceId) e.serviceId = 'Please select a service.'
  if (!v.projectTitle.trim()) e.projectTitle = 'Give your project a short title.'
  else if (v.projectTitle.trim().length < 3) e.projectTitle = 'Title must be at least 3 characters.'
  if (!v.description.trim()) e.description = 'Please describe your project.'
  else if (v.description.trim().length < 20) e.description = 'Add a little more detail (at least 20 characters).'
  if (v.budget === '') e.budget = 'Please enter your budget.'
  else if (Number.isNaN(Number(v.budget)) || Number(v.budget) <= 0) e.budget = 'Budget must be a positive number.'
  if (!v.deadline) e.deadline = 'Please choose a preferred deadline.'
  else if (v.deadline < today()) e.deadline = 'Deadline cannot be in the past.'
  return e
}

function Field({ label, error, children, htmlFor, hint }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
      {error && <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default function Inquiry() {
  const [params] = useSearchParams()
  const { services, getCreator, getService, addInquiry } = useApp()
  const presetService = params.get('service')

  const emptyForm = useMemo(() => ({
    clientName: '', email: '',
    serviceId: getService(presetService) ? presetService : '',
    projectTitle: '', description: '', budget: '', deadline: '',
  }), [presetService, getService])

  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const selected = getService(values.serviceId)
  const selectedCreator = selected ? getCreator(selected.creatorId) : null

  const setField = (name, value) => {
    const next = { ...values, [name]: value }
    setValues(next)
    if (touched[name] || Object.keys(errors).length) setErrors(validate(next))
  }
  const blur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }
  const showError = (name) => (touched[name] || submittedAttempt) && errors[name]
  const [submittedAttempt, setAttempt] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setAttempt(true)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(first)?.focus()
      return
    }
    const saved = addInquiry({
      clientName: values.clientName.trim(),
      email: values.email.trim(),
      serviceId: values.serviceId,
      projectTitle: values.projectTitle.trim(),
      description: values.description.trim(),
      budget: Number(values.budget),
      deadline: values.deadline,
    })
    setSubmitted(saved)
  }

  const reset = () => { setValues({ ...emptyForm, serviceId: '' }); setErrors({}); setTouched({}); setAttempt(false); setSubmitted(null) }

  if (submitted) {
    const svc = getService(submitted.serviceId)
    return (
      <div className="container-page py-16">
        <div className="card mx-auto max-w-xl p-10 text-center">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"><Icon name="check" className="h-8 w-8" /></span>
          <h1 className="text-2xl font-extrabold">Inquiry sent!</h1>
          <p className="mt-3 text-ink-500">
            Thanks {submitted.clientName.split(' ')[0]}, your inquiry <strong className="text-ink-900">"{submitted.projectTitle}"</strong>
            {svc && <> for <strong className="text-ink-900">{svc.title}</strong></>} has been saved. The creator can now review it in their dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/services" className="btn-primary">Keep exploring</Link>
            <button onClick={reset} className="btn-secondary">Send another inquiry</button>
          </div>
        </div>
      </div>
    )
  }

  const inputClass = (name) => `input ${showError(name) ? 'input-error' : ''}`
  const aria = (name) => ({ 'aria-invalid': Boolean(showError(name)), 'aria-describedby': showError(name) ? `${name}-error` : undefined })

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Send a project inquiry</h1>
          <p className="mt-2 text-ink-500">Tell the creator about your project. Fields marked with * are required.</p>

          <form onSubmit={onSubmit} noValidate className="card mt-8 space-y-5 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name *" htmlFor="clientName" error={showError('clientName')}>
                <input id="clientName" className={inputClass('clientName')} value={values.clientName} onChange={(e) => setField('clientName', e.target.value)} onBlur={() => blur('clientName')} placeholder="Jane Doe" autoComplete="name" {...aria('clientName')} />
              </Field>
              <Field label="Email address *" htmlFor="email" error={showError('email')}>
                <input id="email" type="email" className={inputClass('email')} value={values.email} onChange={(e) => setField('email', e.target.value)} onBlur={() => blur('email')} placeholder="jane@example.com" autoComplete="email" {...aria('email')} />
              </Field>
            </div>

            <Field label="Selected service *" htmlFor="serviceId" error={showError('serviceId')}>
              <select id="serviceId" className={inputClass('serviceId')} value={values.serviceId} onChange={(e) => setField('serviceId', e.target.value)} onBlur={() => blur('serviceId')} {...aria('serviceId')}>
                <option value="">Select a service...</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.title} - {getCreator(s.creatorId)?.name}</option>)}
              </select>
            </Field>

            <Field label="Project title *" htmlFor="projectTitle" error={showError('projectTitle')}>
              <input id="projectTitle" className={inputClass('projectTitle')} value={values.projectTitle} onChange={(e) => setField('projectTitle', e.target.value)} onBlur={() => blur('projectTitle')} placeholder="e.g. Rebrand for my bakery" {...aria('projectTitle')} />
            </Field>

            <Field label="Project description *" htmlFor="description" error={showError('description')} hint={`${values.description.trim().length} characters - minimum 20`}>
              <textarea id="description" rows={5} className={inputClass('description')} value={values.description} onChange={(e) => setField('description', e.target.value)} onBlur={() => blur('description')} placeholder="Describe your goals, audience and any requirements..." {...aria('description')} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Budget (USD) *" htmlFor="budget" error={showError('budget')}>
                <input id="budget" type="number" min="1" inputMode="numeric" className={inputClass('budget')} value={values.budget} onChange={(e) => setField('budget', e.target.value)} onBlur={() => blur('budget')} placeholder="500" {...aria('budget')} />
              </Field>
              <Field label="Preferred deadline *" htmlFor="deadline" error={showError('deadline')}>
                <input id="deadline" type="date" min={today()} className={inputClass('deadline')} value={values.deadline} onChange={(e) => setField('deadline', e.target.value)} onBlur={() => blur('deadline')} {...aria('deadline')} />
              </Field>
            </div>

            <button type="submit" className="btn-primary w-full sm:w-auto">Submit inquiry <Icon name="arrowRight" className="h-4 w-4" /></button>
          </form>
        </div>

        <aside>
          <div className="card sticky top-24 p-6">
            <h2 className="font-bold">Selected service</h2>
            {selected ? (
              <div className="mt-4">
                <img src={selected.image} alt="" className="aspect-video w-full rounded-xl object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <p className="mt-3 font-semibold text-ink-900">{selected.title}</p>
                {selectedCreator && <p className="mt-1 text-sm text-ink-500">by {selectedCreator.name}</p>}
                <p className="mt-3 text-sm text-ink-500">Starting at <span className="font-bold text-ink-900">${selected.price}</span> - {selected.deliveryDays}-day delivery</p>
                <Link to={`/services/${selected.id}`} className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">View service details</Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-500">Choose a service to see its details here. Not sure yet? <Link to="/services" className="font-semibold text-brand-600 hover:underline">Browse services</Link>.</p>
            )}
            <div className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
              <Icon name="info" className="mb-1 h-4 w-4" /> This is a frontend demo: inquiries are stored in your browser's LocalStorage and appear in the Creator Dashboard.
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
