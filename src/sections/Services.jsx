import { useState } from 'react'
import SectionIntro from '../components/SectionIntro'
import { services } from '../data/content'
export default function Services({ chapter }) {
  const [active, setActive] = useState(0)
  return <section id="services" className="scene-section services-section" data-chapter="1"><div className="section-shell section-shell--split"><SectionIntro chapter={chapter} /><div className="service-console reveal-panel"><div className="service-console__status"><span>CAPABILITY MAP</span><b>{String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</b></div><div className="service-console__list">{services.map((service, index) => <button key={service.number} className={active === index ? 'service-row is-active' : 'service-row'} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{service.number}</span><strong>{service.name}</strong><i>↗</i></button>)}</div><div className="service-console__detail" aria-live="polite"><small>{services[active].short}</small><p>{services[active].detail}</p></div></div></div></section>
}
