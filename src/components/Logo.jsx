import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="CreatorSpace home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M16 7.5a6.500 6.500 0 1 0 0 9" /><circle cx="19" cy="12" r="1.500" fill="#f97316" stroke="none" /></svg>
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`}>
        Creator<span className="text-brand-500">Space</span>
      </span>
    </Link>
  )
}
