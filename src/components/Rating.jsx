import Icon from './Icons'

export default function Rating({ value = 0, count, size = 'sm' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
      <Icon name="star" filled className={`${cls} text-amber-400`} />
      {value ? value.toFixed(1) : 'New'}
      {count !== undefined && value > 0 && <span className="font-normal text-ink-500">({count})</span>}
    </span>
  )
}
