import { Suspense, useEffect, useState } from 'react'
import Hero from './components/Hero'
import Services from './components/Services'
import Industries from './components/Industries'
import Process from './components/Process'
import PortfolioPreview from './components/PortfolioPreview'
import TechStack from './components/TechStack'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NoiseOverlay from './components/NoiseOverlay'
import AIChatbot from './components/AIChatbot'
import AuthDialog from './components/AuthDialog'
import ParticleField from './components/ParticleField'
import { LenisSetup } from './utils/animation'
import { resolveProfileImage } from './utils/profileImage'

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; picture?: string; profilePic?: string } | null>(null)

  useEffect(() => {
    const cleanup = LenisSetup()
    return () => cleanup?.()
  }, [])

  // Restore authenticated user from localStorage on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string; email?: string; picture?: string; profilePic?: string }
        if (parsed && parsed.email) {
          const resolvedPicture = resolveProfileImage(parsed)
          setUser({
            name: parsed.name || parsed.email.split('@')[0],
            email: parsed.email,
            picture: resolvedPicture,
            profilePic: resolvedPicture,
          })
        }
      }
    } catch (err) {
      console.warn('Failed to restore auth user from storage', err)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    try {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('token')
    } catch (err) {
      console.warn('Failed to clear auth storage on logout', err)
    }
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(135deg, #4a0a3a 0%, #2d0a3d 35%, #0a2d3d 70%, #0a1f2e 100%)' }}>
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <NoiseOverlay />
      <ParticleField />
      <main className="overflow-x-clip">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="rounded-full h-10 w-10 border-2 border-[#8A2BE2]/60 border-t-white/80 animate-spin" aria-hidden />
            <span className="sr-only">Loading…</span>
          </div>
        }>
          <Hero
            user={user}
            onLoginClick={() => setAuthOpen(true)}
            onLogoutClick={handleLogout}
            onGetQuoteClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <Services />
          <Industries />
          <Process />
          <PortfolioPreview />
          <TechStack />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CTA />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <AIChatbot />
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={(u) => {
          const resolvedPicture = resolveProfileImage(u)
          const normalizedUser = {
            ...u,
            picture: resolvedPicture,
            profilePic: resolvedPicture,
          }
          setUser(normalizedUser)
          try {
            localStorage.setItem('auth_user', JSON.stringify(normalizedUser))
          } catch (err) {
            console.warn('Failed to persist auth user to storage', err)
          }
          setAuthOpen(false)
        }}
      />
    </div>
  )
}

export default App


