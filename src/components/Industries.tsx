import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import { industries } from '../data/content'
import { revealParent, revealUp } from '../utils/animation'

export default function Industries() {
  return (
    <section className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard>
          <SectionHeader id="industries" kicker="Industries" title="Battle-tested across domains" />
          <div className="mt-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={revealParent} className="flex flex-wrap gap-3">
          {industries.map((i) => (
            <motion.span key={i} variants={revealUp} className="px-4 py-2 rounded-full border border-[#FF10F0]/30 bg-white/5 hover:bg-[#FF10F0]/10 hover:border-[#00E5FF]/50 hover:shadow-neon-pink transition-all duration-300">
              {i}
            </motion.span>
          ))}
        </motion.div>
          </div>
        </SectionCard>
      </div>
    </section>
  )
}


