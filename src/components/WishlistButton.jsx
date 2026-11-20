import { useWishlist } from '../context/WishlistContext'
import Icon from './Icons'

export default function WishlistButton({ serviceId, variant = 'icon' }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(serviceId)

  if (variant === 'full') {
    return (
      <button onClick={() => toggleWishlist(serviceId)} className="btn-secondary w-full" aria-pressed={saved}>
        <Icon name="heart" filled={saved} className={`h-5 w-5 ${saved ? 'text-red-500' : ''}`} />
        {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
      </button>
    )
  }
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(serviceId) }}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-card transition hover:scale-110"
    >
      <Icon name="heart" filled={saved} className={`h-5 w-5 ${saved ? 'text-red-500' : 'text-ink-700'}`} />
    </button>
  )
}
