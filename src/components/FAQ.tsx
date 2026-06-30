import { useState } from 'react'
import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import { faqs } from '../data/content'

export default function FAQ() {
  return (
    <section className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard>
          <SectionHeader id="faq" kicker="FAQ" title="Answers, fast" />
          <div className="mt-6 divide-y divide-white/10">
            {faqs.map((f) => (
              <Accordion key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  )
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="py-3">
      <button className="w-full text-left flex items-center justify-between py-2" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="font-medium">{q}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      <div className="overflow-hidden transition-[max-height] duration-300" style={{ maxHeight: open ? 120 : 0 }}>
        <p className="text-white/70 pb-3">{a}</p>
      </div>
    </div>
  )
}


