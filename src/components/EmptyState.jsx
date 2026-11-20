import { Link } from 'react-router-dom'
import Icon from './Icons'

export default function EmptyState({ icon = 'search', title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-500">{message}</p>
      {actionLabel && actionTo && <Link to={actionTo} className="btn-primary mt-6">{actionLabel}</Link>}
      {actionLabel && onAction && <button onClick={onAction} className="btn-primary mt-6">{actionLabel}</button>}
    </div>
  )
}
