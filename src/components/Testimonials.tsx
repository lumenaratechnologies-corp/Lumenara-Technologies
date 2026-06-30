import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import { testimonials } from '../data/content'

export default function Testimonials() {
  return (
    <section className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard>
          <SectionHeader id="testimonials" kicker="Testimonials" title="What partners say" />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <blockquote key={t.author} className="rounded-xl border border-[#FF10F0]/25 bg-white/5 p-6 hover:border-[#FF10F0]/50 hover:shadow-glow transition-all">
            <p className="text-white/90">“{t.quote}”</p>
            <footer className="mt-3 text-sm text-white/60">— {t.author}</footer>
          </blockquote>
        ))}
          </div>
        </SectionCard>
      </div>
    </section>
  )
}


