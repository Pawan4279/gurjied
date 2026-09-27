export default function MathML({ value }: { value?: string | null }) {
  if (!value) return null
  const document = new DOMParser().parseFromString(value, 'application/xml')
  if (document.querySelector('parsererror')) return null
  const allowed = new Set(['math', 'mrow', 'mi', 'mn', 'mo', 'mfrac', 'msup', 'msub', 'msqrt', 'mroot', 'mtext', 'mtable', 'mtr', 'mtd'])
  for (const element of Array.from(document.querySelectorAll('*'))) {
    if (!allowed.has(element.localName)) return null
    for (const attribute of Array.from(element.attributes)) if (!['xmlns', 'display'].includes(attribute.name)) element.removeAttribute(attribute.name)
  }
  return <div className="math-expression" dangerouslySetInnerHTML={{ __html: document.documentElement.outerHTML }} />
}

