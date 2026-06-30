import { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

type Props = PropsWithChildren<{
  href?: string
  onClick?: () => void
  className?: string
  variant?: 'neon' | 'solid' | 'outline'
}>

export default function NeonButton({ href, onClick, className, variant = 'neon', children }: Props) {
  const solidClass = 'relative overflow-hidden rounded-full font-semibold tracking-wide px-8 py-3.5 bg-black text-white border border-[#8A2BE2]/60 shadow-neon-purple hover:shadow-neon-purple-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [text-shadow:0_0_12px_rgba(255,255,255,0.4)]'
  const neonClass = 'relative overflow-hidden rounded-full font-semibold tracking-wide px-8 py-3.5 bg-black text-white border border-[#8A2BE2]/60 shadow-neon-purple hover:shadow-neon-purple-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [text-shadow:0_0_12px_rgba(255,255,255,0.4)]'
  const outlineClass = 'relative rounded-full font-semibold px-8 py-3.5 border-2 border-[#8A2BE2]/80 text-white bg-transparent shadow-[0_0_15px_rgba(138,43,226,0.25)] hover:bg-[#8A2BE2]/10 hover:shadow-neon-purple hover:scale-[1.02] active:scale-[0.98] transition-all duration-300'

  const base = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className={clsx(
        'inline-flex items-center justify-center',
        variant === 'solid' ? solidClass : variant === 'outline' ? outlineClass : neonClass
      )}
    >
      <span className="relative z-10">{children}</span>
    </motion.span>
  )

  if (href) {
    return (
      <a href={href} onClick={onClick} className={clsx('group', className)}>
        {base}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={clsx('group', className)}>
      {base}
    </button>
  )
}
