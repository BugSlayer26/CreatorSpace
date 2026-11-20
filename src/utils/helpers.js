export const formatPrice = (n) => `$${Number(n || 0).toLocaleString('en-US')}`

export const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const uid = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)

export const averageRating = (reviews = []) =>
  reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

// Inline SVG fallback used when a remote image fails to load.
export const placeholderImage = (label = 'CreatorSpace') => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#e0e7ff'/><stop offset='1' stop-color='#c7d2fe'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='36' fill='#4f46e5'>${label.replace(/[<>&']/g, '')}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
