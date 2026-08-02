import KineticHeading from './KineticHeading'

export default function SectionIntro({ chapter, align = 'left', children }) {
  return (
    <div className={`section-intro section-intro--${align}`}>
      <div className="section-intro__meta reveal-copy"><span>{chapter.index}</span><span>{chapter.label}</span></div>
      <KineticHeading lines={chapter.title} />
      <p className="section-intro__copy reveal-copy">{chapter.copy}</p>
      {children}
    </div>
  )
}
