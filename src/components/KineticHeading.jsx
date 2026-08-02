export default function KineticHeading({ lines, as: Tag = 'h2' }) {
  return (
    <Tag className="kinetic-heading">
      {lines.map((line, row) => (
        <span className="kinetic-heading__line" key={`${line}-${row}`}>
          {line.split(' ').map((word, index) => <span className="heading-word" key={`${word}-${index}`}><span>{word}&nbsp;</span></span>)}
        </span>
      ))}
    </Tag>
  )
}
