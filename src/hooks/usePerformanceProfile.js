import { useEffect, useState } from 'react'

function readProfile() {
  if (typeof window === 'undefined') return { reducedMotion: false, compact: false, enableWebGL: true }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const compact = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
  const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4
  const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4
  return { reducedMotion, compact, enableWebGL: !reducedMotion && !(compact && (lowMemory || lowCores)) }
}

export function usePerformanceProfile() {
  const [profile, setProfile] = useState(readProfile)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setProfile(readProfile())
    media.addEventListener?.('change', update)
    window.addEventListener('resize', update, { passive: true })
    return () => {
      media.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return profile
}
