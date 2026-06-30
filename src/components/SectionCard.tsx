import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function SectionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl bg-[#080810] border-2 border-white/20 shadow-xl px-6 py-10 md:px-8 md:py-12 ${className}`}
    >
      {children}
    </motion.div>
  )
}
