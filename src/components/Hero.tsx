import { useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import logo from '../assets/logo.png'
import NeonAbstractBackground from './NeonAbstractBackground'
import NeonButton from './NeonButton'

const navLinks = [
  { id: '', label: 'Home', href: '#' },
  { id: 'industries', label: 'About Us', section: 'industries' },
  { id: 'services', label: 'Services', section: 'services' },
  { id: 'pricing', label: 'Pricing', section: 'pricing' },
  { id: 'careers', label: 'Careers', type: 'careers' },
  { id: 'contact', label: 'Contact', type: 'contact' },
]

type HeroProps = {
  onGetQuoteClick?: () => void
  onLoginClick?: () => void
  onLogoutClick?: () => void
  user?: { name: string; email: string; picture?: string; profilePic?: string } | null
}

export default function Hero({ onGetQuoteClick, onLoginClick, onLogoutClick, user }: HeroProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroSectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  })

  const userInitial =
    user && (user.name || user.email)
      ? (user.name || user.email).trim().charAt(0).toUpperCase()
      : 'U'

  return (
    <section ref={heroSectionRef} className="relative pt-6 pb-10 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-[#080810] border-2 border-white/20 shadow-xl">
          <NeonAbstractBackground scrollProgress={heroScrollProgress} />
          <div className="relative">
            {/* Header - inside card */}
            <header className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5">
              <a href="#" className="inline-flex items-center gap-2 group">
                <img
                  src={logo}
                  alt="Lumenara Technologies"
                  className="h-6 w-8 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="text-sm font-semibold tracking-wide text-white group-hover:text-white/90 transition-colors duration-300">
                  Lumenara Technologies
                </span>
              </a>
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href || `#${l.id}`}
                    onClick={(e) => {
                      if (l.type === 'careers') {
                        e.preventDefault()
                        window.dispatchEvent(new Event('careers-tab-open'))
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      } else if (l.type === 'contact') {
                        e.preventDefault()
                        window.dispatchEvent(new Event('contact-tab-open'))
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      } else if (l.section) {
                        e.preventDefault()
                        document.getElementById(l.section)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="text-sm font-medium text-white hover:text-white/90 transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="flex items-center gap-3">
                  {user ? (
                    <>
                      <div className="relative h-7 w-7 rounded-full border border-white/30 bg-white/10 flex items-center justify-center overflow-hidden">
                        <img
                          src={user.picture || user.profilePic || '/default-avatar.svg'}
                          alt={user.name || user.email}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).src = '/default-avatar.svg'
                          }}
                        />
                        {/* Always show alphabet avatar as well */}
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-black/80 flex items-center justify-center border border-white/30">
                          <span className="text-[9px] font-semibold text-white">
                            {userInitial}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-white/75 max-w-[160px] truncate">
                        {user.name || user.email}
                      </span>
                      <button
                        type="button"
                        onClick={onLogoutClick}
                        className="text-xs font-semibold tracking-wide uppercase text-white/80 hover:text-neon-blue transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={onLoginClick}
                        className="text-xs font-semibold tracking-wide uppercase text-white/80 hover:text-neon-blue transition-colors"
                      >
                        Login
                      </button>
                    </>
                  )}
                  <NeonButton onClick={onGetQuoteClick} variant="solid">
                    Get a Quote
                  </NeonButton>
                </div>
              </nav>
              <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden text-white p-2 hover:text-neon-blue transition-colors" aria-label="Menu">≡</button>
            </header>
            {mobileOpen && (
              <div className="md:hidden px-6 pb-4 flex flex-col gap-2 border-t border-[#FF10F0]/20 pt-4">
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href || `#${l.id}`}
                    onClick={(e) => {
                      setMobileOpen(false)
                      if (l.type === 'careers') {
                        e.preventDefault()
                        window.dispatchEvent(new Event('careers-tab-open'))
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      } else if (l.type === 'contact') {
                        e.preventDefault()
                        window.dispatchEvent(new Event('contact-tab-open'))
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      } else if (l.section) {
                        e.preventDefault()
                        document.getElementById(l.section)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="text-sm text-white/90 hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-3">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => {
                        onLogoutClick?.()
                        setMobileOpen(false)
                      }}
                      className="text-xs font-semibold tracking-wide uppercase text-left text-white/80"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onLoginClick?.()
                        setMobileOpen(false)
                      }}
                      className="text-xs font-semibold tracking-wide uppercase text-left text-white/80"
                    >
                      Login
                    </button>
                  )}
                  <NeonButton
                    onClick={() => {
                      onGetQuoteClick?.()
                      setMobileOpen(false)
                    }}
                    variant="solid"
                  >
                    Get a Quote
                  </NeonButton>
                </div>
              </div>
            )}

            {/* Hero content */}
            <div className="flex flex-col lg:flex-row min-h-[520px] md:min-h-[560px]">
              <div className="flex-1 px-8 py-12 md:px-10 md:py-16 lg:py-20 lg:pl-12 flex flex-col justify-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
                >
                  Build the Future with Us
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-8 max-w-2xl text-lg md:text-xl text-white leading-relaxed"
                >
                  Empowering digital innovation and business performance. From strategic consulting to professional services, we are here for you every step of the way.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-10 flex flex-wrap gap-5"
                >
                  <NeonButton href="#contact" variant="solid">Start a Project</NeonButton>
                  <NeonButton href="#services" variant="outline">Explore Services</NeonButton>
                </motion.div>
              </div>
              <div className="relative z-[1] lg:w-[45%] min-h-[240px] lg:min-h-[400px] flex items-center justify-center px-6 pb-10 lg:pb-0 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="w-full flex flex-col items-center justify-center gap-6"
                >
                  <img
                    src={logo}
                    alt="Lumenara Technologies Logo"
                    className="w-full max-w-xs lg:max-w-sm h-auto object-contain drop-shadow-[0_0_45px_rgba(138,43,226,0.5)] select-none pointer-events-none"
                  />
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-2xl md:text-3xl font-extrabold tracking-widest text-center select-none uppercase text-white text-glow"
                  >
                    Lumenara Technologies
                  </motion.h2>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
