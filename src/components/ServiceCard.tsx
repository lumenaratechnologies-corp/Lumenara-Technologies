import { useState } from 'react'
import { motion } from 'framer-motion'
import { computeTiltStyle, revealUp } from '../utils/animation'

export default function ServiceCard({ title, summary, points }: { title: string; summary: string; points: string[] }) {
  const [style, setStyle] = useState<string>('')
  return (
    <motion.div
      variants={revealUp}
      onMouseMove={(e) => setStyle(computeTiltStyle(e, 10))}
      onMouseLeave={() => setStyle('')}
      style={{ transform: style }}
      className="group relative h-full rounded-xl border border-[#FF10F0]/25 bg-surface/50 p-5 backdrop-blur transition-all duration-300 hover:shadow-glow hover:border-[#FF10F0]/50"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-neon-gradient opacity-10 group-hover:opacity-20 transition-opacity" />
      <h3 className="text-xl font-semibold text-glow">{title}</h3>
      <p className="mt-2 text-white/70">{summary}</p>
      <ul className="mt-4 space-y-1 text-sm text-white/70 list-disc list-inside">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </motion.div>
  )
}


