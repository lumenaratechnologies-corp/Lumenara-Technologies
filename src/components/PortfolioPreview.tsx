import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import { motion } from 'framer-motion'
import { revealParent, revealUp } from '../utils/animation'

const items = [
  { title: 'E‑commerce Launchpad', img: 'https://picsum.photos/seed/1/800/500' },
  { title: 'IoT Telemetry Hub', img: 'https://picsum.photos/seed/2/800/500' },
  { title: 'FinTech Dashboard', img: 'https://picsum.photos/seed/3/800/500' },
]

export default function PortfolioPreview() {
  return (
    <section className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard>
          <SectionHeader id="portfolio" kicker="Portfolio" title="Selected work" />
          <div className="mt-8 grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <motion.figure key={it.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={revealParent} className="group overflow-hidden rounded-xl border border-[#FF10F0]/25 bg-white/5 hover:border-[#FF10F0]/50 hover:shadow-glow transition-all">
            <motion.img variants={revealUp} src={it.img} alt="Portfolio" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <figcaption className="p-4 text-sm text-white/80">{it.title}</figcaption>
          </motion.figure>
        ))}
          </div>
        </SectionCard>
      </div>
    </section>
  )
}


