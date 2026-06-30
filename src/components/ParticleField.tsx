import { useEffect, useRef } from 'react'

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let frame = 0
    let raf = 0

    function resize() {
      canvas.width = canvas.clientWidth * devicePixelRatio
      canvas.height = canvas.clientHeight * devicePixelRatio
    }
    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.0005,
      vy: (Math.random() - 0.5) * 0.0005,
    }))

    function draw() {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        p.x = (p.x + p.vx + 1) % 1
        p.y = (p.y + p.vy + 1) % 1
        const x = p.x * w
        const y = p.y * h
        ctx.beginPath()
        const hue = (frame * 0.2 + x * 0.02) % 360
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.5)`
        ctx.arc(x, y, p.r * devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
      })
      frame++
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full opacity-60" />
    </div>
  )
}


