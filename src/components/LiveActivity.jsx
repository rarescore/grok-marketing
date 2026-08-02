import { useEffect, useState } from 'react'
import { activityItems } from '../data/content'

export default function LiveActivity({ reducedMotion }) {
  const [item, setItem] = useState(null)
  useEffect(() => {
    if (reducedMotion) return
    let timeout
    const show = () => {
      const next = activityItems[Math.floor(Math.random() * activityItems.length)]
      setItem(next)
      timeout = setTimeout(() => { setItem(null); timeout = setTimeout(show, 9000 + Math.random() * 12000) }, 5200)
    }
    timeout = setTimeout(show, 6500)
    return () => clearTimeout(timeout)
  }, [reducedMotion])
  return (
    <div className={`activity-toast ${item ? 'is-visible' : ''}`} aria-live="polite">
      <span className="activity-toast__pulse" />
      <div><small>DEMO FEED</small><strong>{item?.[0] ?? 'Visibility system'}</strong><p>{item?.[1] ?? 'Preview notification'}</p></div>
    </div>
  )
}
