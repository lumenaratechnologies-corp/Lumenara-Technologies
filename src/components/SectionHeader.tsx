import { motion } from 'framer-motion'
import { revealUp } from '../utils/animation'

export default function SectionHeader({ id, kicker, title, subtitle }: { id: string; kicker: string; title: string; subtitle?: string }) {
  return (
    <div id={id} className="pt-2 -mt-2 scroll-mt-24">
      <motion.p variants={revealUp} className="bg-gradient-to-r from-[#FF10F0] to-[#00E5FF] bg-clip-text text-transparent text-sm tracking-widest uppercase" style={{ textShadow: '0 0 10px rgba(255,16,240,0.6), 0 0 10px rgba(0,229,255,0.4)' }}>
        {kicker}
      </motion.p>
      <motion.h2 variants={revealUp} className="mt-2 text-3xl md:text-4xl font-semibold text-white">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={revealUp} className="mt-3 text-white/90 max-w-2xl">
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}


