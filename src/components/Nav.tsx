import { useState } from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const sections = [
  { id: 'services', label: 'Services' },
  { id: 'industries', label: 'Industries' },
  { id: 'process', label: 'Process' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
]

type NavProps = {
  onLoginClick?: () => void
  onGetQuoteClick?: () => void
  onLogoutClick?: () => void
  user?: { name: string; email: string; picture?: string; profilePic?: string } | null
}

export default function Nav({ onLoginClick, onGetQuoteClick, onLogoutClick, user }: NavProps) {
  const [open, setOpen] = useState(false)
  const userInitial =
    user && (user.name || user.email)
      ? (user.name || user.email).trim().charAt(0).toUpperCase()
      : 'U'
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1f]/90 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="#" className="inline-flex items-center gap-2">
          <img src={logo} alt="Lumenara Technologies" className="h-7 w-10 object-contain" />
          <span className="font-semibold tracking-wide text-white">Lumenara Technologies</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-sm font-medium text-white/90 hover:text-neon-cyan transition-colors">
              {s.label}
            </a>
          ))}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="relative h-8 w-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={user.picture || user.profilePic || '/default-avatar.svg'}
                    alt={user.name || user.email}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/default-avatar.svg'
                    }}
                  />
                  {/* Always show alphabet avatar as well */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-black/80 flex items-center justify-center border border-white/30">
                    <span className="text-[9px] font-semibold text-white">
                      {userInitial}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-white/70 px-2 py-1.5 max-w-[160px] truncate">
                  {user.name || user.email}
                </span>
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white border border-white/20 hover:border-red-400/50 hover:bg-red-500/10 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white border border-white/20 hover:border-neon-cyan/50 hover:bg-white/5 transition-all duration-300"
                >
                  Login / Sign In
                </button>
                <button
                  onClick={onGetQuoteClick}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#6A00FF] text-white hover:bg-[#7a10ff] hover:shadow-[0_0_20px_rgba(106,0,255,0.4)] transition-all duration-300"
                >
                  Get a Quote
                </button>
              </>
            )}
          </div>
        </nav>
        <button onClick={() => setOpen((v) => !v)} className="md:hidden p-2 text-white" aria-label="Menu">
          <span className="text-2xl">≡</span>
        </button>
      </div>
      {open && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="md:hidden bg-[#1a1a1f]/95 border-t border-white/5">
          <div className="px-4 pb-4 flex flex-col gap-3">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="py-2 border-b border-white/10 text-white/90 hover:text-neon-cyan" onClick={() => setOpen(false)}>
                {s.label}
              </a>
            ))}
            {user ? (
              <button onClick={() => { onLogoutClick?.(); setOpen(false); }} className="py-2 text-left text-red-400 hover:text-red-300">Logout</button>
            ) : (
              <div className="flex gap-2 pt-2">
                <button onClick={() => { onLoginClick?.(); setOpen(false); }} className="flex-1 py-2 rounded-lg border border-white/20 text-sm">Login / Sign In</button>
                <button onClick={() => { onGetQuoteClick?.(); setOpen(false); }} className="flex-1 py-2.5 rounded-full bg-black text-white border border-[#8A2BE2]/60 shadow-neon-purple hover:shadow-neon-purple-hover text-sm font-semibold transition-all duration-300 [text-shadow:0_0_8px_rgba(255,255,255,0.35)]">Get a Quote</button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
