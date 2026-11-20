import { useApp } from '../context/AppContext'
import { useWishlist } from '../context/WishlistContext'
import ServiceCard from '../components/ServiceCard'
import EmptyState from '../components/EmptyState'

export default function Wishlist() {
  const { services } = useApp()
  const { wishlist, clearWishlist } = useWishlist()
  // Ignore saved ids whose service no longer exists (e.g. deleted from a dashboard).
  const saved = wishlist.map((id) => services.find((s) => s.id === id)).filter(Boolean)

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Your Wishlist</h1>
          <p className="mt-2 text-ink-500">{saved.length} saved {saved.length === 1 ? 'service' : 'services'}</p>
        </div>
        {saved.length > 0 && <button onClick={clearWishlist} className="btn-secondary">Clear wishlist</button>}
      </div>
      {saved.length === 0 ? (
        <EmptyState icon="heart" title="Your wishlist is empty" message="Tap the heart on any service to save it here for later." actionLabel="Explore services" actionTo="/services" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {saved.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      )}
    </div>
  )
}
