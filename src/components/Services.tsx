import { motion } from 'framer-motion'
import { revealParent } from '../utils/animation'
import SectionHeader from './SectionHeader'
import ServiceCard from './ServiceCard'
import SectionCard from './SectionCard'
import { services } from '../data/content'

export default function Services() {
  return (
    <section className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard>
          <SectionHeader id="services" kicker="Services" title="From Prototype to Planet-Scale" subtitle="Full-spectrum product, platform, and growth engineering." />
          <div className="mt-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={revealParent} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.title} title={s.title} summary={s.summary} points={s.points} />
          ))}
        </motion.div>
          </div>
        </SectionCard>
      </div>
    </section>
  )
}


