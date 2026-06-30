import { useEffect, useRef, useState } from 'react'

export default function CursorFX() {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Check if device is touch-based
    const touchQuery = window.matchMedia('(pointer: coarse)')
    setIsTouch(touchQuery.matches)
    
    const el = ref.current
    if (!el || touchQuery.matches) return

    function onMove(e: MouseEvent) {
      if (!isVisible) setIsVisible(true)
      el!.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    function onMouseLeave() {
      setIsVisible(false)
    }

    function onMouseEnter() {
      setIsVisible(true)
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') ||
        window.getComputedStyle(target).cursor === 'pointer'

      setIsHovered(!!isInteractive)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [isVisible])

  if (isTouch) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] mix-blend-screen -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div 
        className={`rounded-full border transition-all duration-300 ease-out ${
          isHovered 
            ? 'h-10 w-10 border-neon-pink bg-neon-pink/10 shadow-glow-strong scale-110' 
            : 'h-6 w-6 border-neon-cyan/70 bg-transparent shadow-glow'
        }`} 
      />
    </div>
  )
}



