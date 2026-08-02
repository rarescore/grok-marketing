import { useEffect, useState } from 'react'

export default function Preloader({ onComplete, reducedMotion }) {
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const first = setTimeout(() => setLeaving(true), reducedMotion ? 100 : 1450)
    const second = setTimeout(onComplete, reducedMotion ? 250 : 2150)
    return () => { clearTimeout(first); clearTimeout(second) }
  }, [onComplete, reducedMotion])
  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''}`} aria-label="Loading RS Marketing">
      <div className="preloader__mark"><span>R</span><i /><span>S</span></div>
      <p>Building the signal</p>
      <div className="preloader__track"><b /></div>
    </div>
  )
}
