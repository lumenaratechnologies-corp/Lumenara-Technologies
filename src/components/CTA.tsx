import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import NeonButton from './NeonButton'

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const gradientY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 36]),
    { stiffness: 100, damping: 32 }
  )

  return (
    <section ref={sectionRef} className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl bg-[#080810] border-2 border-white/20 p-10 shadow-xl"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#FF10F0]/10 via-transparent to-[#00E5FF]/10 pointer-events-none"
            style={{ y: gradientY }}
          />
          <h3 className="relative text-2xl md:text-3xl font-semibold text-white">Ready to ship something legendary?</h3>
          <p className="relative mt-2 text-white/90 max-w-2xl">Tell us about your goals. We’ll reply within 1–2 business days with next steps.</p>
          <div className="relative mt-6 flex flex-wrap gap-4">
            <NeonButton href="#contact" variant="solid">Start a Project</NeonButton>
            <NeonButton href="#services" variant="outline">Explore Services</NeonButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


