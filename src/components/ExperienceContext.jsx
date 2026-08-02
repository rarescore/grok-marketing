import { createContext, useContext, useMemo, useRef } from 'react'

const Context = createContext(null)

export function ExperienceProvider({ children }) {
  const progress = useRef(0)
  const velocity = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const active = useRef(0)
  const value = useMemo(() => ({ progress, velocity, pointer, active }), [])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useExperience() {
  const value = useContext(Context)
  if (!value) throw new Error('useExperience must be used within ExperienceProvider')
  return value
}
