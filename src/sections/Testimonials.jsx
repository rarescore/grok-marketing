import SectionIntro from '../components/SectionIntro'
import { reviews } from '../data/content'
export default function Testimonials({ chapter }) {
  return <section id="testimonials" className="scene-section testimonials-section" data-chapter="6"><div className="section-shell"><SectionIntro chapter={chapter} align="right" /><div className="transmission-grid">{reviews.map((review, index) => <blockquote className="transmission reveal-panel" key={review.name}><div><span>TRANSMISSION {String(index + 1).padStart(2, '0')}</span><span>★★★★★</span></div><p>“{review.quote}”</p><footer><strong>{review.name}</strong><span>{review.company} / {review.plan}</span></footer></blockquote>)}</div><p className="verification-note reveal-copy">Development content with privacy-masked names. Confirm the wording and client permission before launch.</p></div></section>
}
