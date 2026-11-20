const styles = {
  Pending: 'bg-amber-100 text-amber-800',
  Reviewed: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
}

export default function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || 'bg-ink-100 text-ink-700'}`}>{status}</span>
}
