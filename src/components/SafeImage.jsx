import { useState } from 'react'
import { placeholderImage } from '../utils/helpers'

// <img> with lazy loading and an inline fallback if the remote image fails.
export default function SafeImage({ src, alt, className = '', fallbackLabel, ...rest }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed || !src ? placeholderImage(fallbackLabel || alt || 'CreatorSpace') : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
