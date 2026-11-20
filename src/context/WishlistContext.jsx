import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('creatorspace:wishlist', [])

  const toggleWishlist = useCallback(
    (serviceId) =>
      setWishlist((prev) =>
        prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
      ),
    [setWishlist]
  )
  const isWishlisted = useCallback((serviceId) => wishlist.includes(serviceId), [wishlist])
  const clearWishlist = useCallback(() => setWishlist([]), [setWishlist])

  const value = useMemo(
    () => ({ wishlist, toggleWishlist, isWishlisted, clearWishlist, count: wishlist.length }),
    [wishlist, toggleWishlist, isWishlisted, clearWishlist]
  )
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
