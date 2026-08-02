import SectionIntro from '../components/SectionIntro'
import { processSteps } from '../data/content'
export default function Process({ chapter }) {
  return <section id="process" className="scene-section process-section" data-chapter="3"><div className="section-shell"><SectionIntro chapter={chapter} /><ol className="process-track">{processSteps.map(([number, title, copy]) => <li className="process-step reveal-panel" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><i /></li>)}</ol></div></section>
}
