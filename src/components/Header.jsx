import { useEffect, useState } from 'react'
import { siteConfig } from '../data/siteConfig'

const links = [
  ['Services', '#services'], ['Work', '#work'], ['Process', '#process'], ['Packages', '#packages'], ['Results', '#results'], ['Insights', '#articles']
]

export default function Header() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])
  return (
    <header className="site-header">
      <a href="#hero" className="brand" aria-label="RS Marketing home">
        <img src={siteConfig.logo} alt="RS Marketing" />
      </a>
      <nav className={open ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
        {links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        <a className="nav__cta" href="#contact">Start a project</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
        <span /><span />
      </button>
    </header>
  )
}
