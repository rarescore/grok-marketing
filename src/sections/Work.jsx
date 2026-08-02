import { useState } from 'react'
import SectionIntro from '../components/SectionIntro'
import { projects } from '../data/content'
export default function Work({ chapter }) {
  const [active, setActive] = useState(0); const project = projects[active]
  return <section id="work" className="scene-section work-section" data-chapter="2"><div className="section-shell"><SectionIntro chapter={chapter} align="right" /><div className="work-stage reveal-panel"><div className="work-stage__visual"><div className="work-stage__number">{project.number}</div><div className="work-stage__industry">{project.industry}</div><div className="work-stage__scan" /></div><div className="work-stage__copy"><small>SELECTED SYSTEM / {project.number}</small><h3>{project.title}</h3><p>{project.statement}</p><span>{project.scope}</span></div><div className="work-stage__nav" role="tablist" aria-label="Selected work">{projects.map((item, index) => <button key={item.number} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`View ${item.title}`}>{item.number}</button>)}</div></div></div></section>
}
