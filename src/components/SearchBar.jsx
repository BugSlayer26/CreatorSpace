import Icon from './Icons'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search services, creators or keywords...', large = false, buttonLabel }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(value) }}
      className={`flex w-full items-center gap-2 rounded-2xl border border-ink-300 bg-white shadow-card focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200 ${large ? 'p-2' : 'p-1.5'}`}
      role="search"
    >
      <Icon name="search" className="ml-3 h-5 w-5 shrink-0 text-ink-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className={`min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-500 focus:outline-none ${large ? 'py-2.5 text-base' : 'py-2 text-sm'}`}
      />
      {buttonLabel && <button type="submit" className="btn-primary shrink-0">{buttonLabel}</button>}
    </form>
  )
}
