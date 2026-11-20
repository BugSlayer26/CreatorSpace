export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', action }) {
  return (
    <div className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${align === 'center' ? 'text-center sm:flex-col sm:items-center' : ''}`}>
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</p>}
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-base text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
