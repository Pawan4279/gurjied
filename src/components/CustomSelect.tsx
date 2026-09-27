import { useState } from 'react'

type Option = { label: string; disabled?: boolean }

export default function CustomSelect({ label, value, options, placeholder, onChange }: { label: string; value: string; options: Option[]; placeholder: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  return <div className="custom-field"><span className="field-label">{label}</span><button type="button" className={`select-trigger ${open ? 'open' : ''}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}><span>{value || placeholder}</span><i>⌄</i></button>{open && <div className="select-menu" role="listbox" aria-label={label}>{options.map(option => <button type="button" role="option" aria-selected={value === option.label} className={`${value === option.label ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`} key={option.label} disabled={option.disabled} onClick={() => { onChange(option.label); setOpen(false) }}><span>{option.label}</span>{option.disabled ? <small>Coming soon</small> : value === option.label && <b>✓</b>}</button>)}</div>}</div>
}

