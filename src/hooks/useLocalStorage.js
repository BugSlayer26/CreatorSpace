import { useEffect, useState } from 'react'

// useState that persists to localStorage and fails gracefully if storage is unavailable.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or blocked - ignore */
    }
  }, [key, value])

  return [value, setValue]
}
