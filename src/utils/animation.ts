import Lenis from '@studio-freight/lenis'
import { Variants } from 'framer-motion'

export function LenisSetup() {
  try {
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.12,
    })
    let rafId = 0
    function raf(time: number) {
      try {
        lenis.raf(time)
      } catch {
        // no-op if lenis is already destroyed
      }
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      try {
        if (typeof lenis.destroy === 'function') lenis.destroy()
      } catch {
        // ignore teardown errors
      }
    }
  } catch {
    return () => {}
  }
}

export const revealParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

export function computeTiltStyle(e: React.MouseEvent, strength = 10) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const rx = ((y - rect.height / 2) / rect.height) * -strength
  const ry = ((x - rect.width / 2) / rect.width) * strength
  return `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
}


