import SectionIntro from '../components/SectionIntro'
import { articles } from '../data/content'
export default function Articles({ chapter }) {
  return <section id="articles" className="scene-section articles-section" data-chapter="7"><div className="section-shell"><SectionIntro chapter={chapter} /><div className="article-stack">{articles.map((article, index) => <article className="article-panel reveal-panel" key={article.title}><div className="article-panel__meta"><span>0{index + 1}</span><small>{article.category}</small><small>12 min read</small></div><h3>{article.title}</h3><p>{article.excerpt}</p><ul>{article.points.map((point) => <li key={point}>{point}</li>)}</ul><a href="#contact">Build this into your strategy ↗</a></article>)}</div></div></section>
}
