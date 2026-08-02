import { chapters } from '../data/content'

export default function ProgressRail() {
  return (
    <aside className="progress-rail" aria-hidden="true">
      <span id="progress-index">01</span>
      <div className="progress-rail__line"><b id="progress-fill" /></div>
      <span id="progress-label">The signal</span>
      <small>{String(chapters.length).padStart(2, '0')}</small>
    </aside>
  )
}
