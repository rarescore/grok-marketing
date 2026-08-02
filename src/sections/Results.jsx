import SectionIntro from '../components/SectionIntro'
import { results } from '../data/content'
export default function Results({ chapter }) {
  return <section id="results" className="scene-section results-section" data-chapter="5"><div className="section-shell"><SectionIntro chapter={chapter} /><div className="results-grid">{results.map((result, index) => <article className="result-card reveal-panel" key={result.label}><span>0{index + 1}</span><strong>{result.display}</strong><h3>{result.label}</h3><p>{result.note}</p><div className="result-card__trace"><i /><i /><i /><i /><i /></div></article>)}</div><p className="verification-note reveal-copy">Figures retained from current RS Marketing material. Verify supporting records before public publication.</p></div></section>
}
