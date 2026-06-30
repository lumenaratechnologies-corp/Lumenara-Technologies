import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'

type Props = {
  /** 0–1 progress while the hero section crosses the viewport */
  scrollProgress: MotionValue<number>
}

export default function NeonAbstractBackground({ scrollProgress }: Props) {
  const reduce = useReducedMotion()

  const yPink = useSpring(
    useTransform(scrollProgress, [0, 1], [0, reduce ? 0 : 72]),
    { stiffness: 90, damping: 28 }
  )
  const yBlue = useSpring(
    useTransform(scrollProgress, [0, 1], [0, reduce ? 0 : 110]),
    { stiffness: 85, damping: 26 }
  )
  const yBlend = useSpring(
    useTransform(scrollProgress, [0, 1], [0, reduce ? 0 : 48]),
    { stiffness: 95, damping: 30 }
  )
  const scale = useSpring(
    useTransform(scrollProgress, [0, 1], [1, reduce ? 1 : 1.06]),
    { stiffness: 80, damping: 32 }
  )

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ scale }}
    >
      {/* Neon pink - top right */}
      <motion.div
        className="absolute right-0 top-0 h-[85%] w-[60%] opacity-90 blur-[110px] animate-pulse"
        style={{
          y: yPink,
          background:
            'radial-gradient(ellipse at top right, rgba(255, 16, 240, 0.7) 0%, rgba(255, 105, 180, 0.5) 35%, transparent 70%)',
        }}
      />
      {/* Neon blue - bottom right */}
      <motion.div
        className="absolute right-0 bottom-0 h-[70%] w-[65%] opacity-85 blur-[100px]"
        style={{
          y: yBlue,
          background:
            'radial-gradient(ellipse at bottom right, rgba(0, 229, 255, 0.6) 0%, rgba(0, 191, 255, 0.4) 40%, transparent 75%)',
        }}
      />
      {/* Pink-blue blend - center right */}
      <motion.div
        className="absolute right-20 top-1/3 h-[50%] w-[45%] opacity-70 blur-[80px]"
        style={{
          y: yBlend,
          background:
            'radial-gradient(ellipse at center, rgba(255, 44, 251, 0.5) 0%, rgba(0, 229, 255, 0.4) 50%, transparent 80%)',
        }}
      />
    </motion.div>
  )
}
