import { useEffect, useRef } from 'react'

export default function CustomCursor({ disabled }) {
  const dot = useRef(null)
  const ring = useRef(null)
  useEffect(() => {
    if (disabled) return
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf
    const move = (event) => { x = event.clientX; y = event.clientY }
    const over = (event) => {
      const interactive = event.target.closest('a, button, input, textarea, [data-cursor]')
      ring.current?.classList.toggle('is-active', Boolean(interactive))
    }
    const frame = () => {
      rx += (x - rx) * .16; ry += (y - ry) * .16
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`
      raf = requestAnimationFrame(frame)
    }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerover', over, { passive: true })
    frame()
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerover', over); cancelAnimationFrame(raf) }
  }, [disabled])
  if (disabled) return null
  return <><div className="cursor-dot" ref={dot} /><div className="cursor-ring" ref={ring} /></>
}
