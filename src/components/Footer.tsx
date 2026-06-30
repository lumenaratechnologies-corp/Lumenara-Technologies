import { useState } from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import TermsModal from './TermsModal'
import TermsContent from './TermsContent'
import PrivacyContent from './PrivacyContent'
import RefundContent from './RefundContent'

const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#industries' },
  { label: 'Services', href: '#services' },
  { label: 'Careers', href: '#contact' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [refundOpen, setRefundOpen] = useState(false)
  return (
    <footer className="mt-12 border-t border-white/20 bg-[#080810]/90">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + tagline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Lumenara Technologies" className="h-8 w-10 object-contain" />
              <span className="text-lg font-bold text-white">Lumenara Technologies</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed max-w-md">
              Empowering digital innovation and business performance. From strategic consulting to professional services, we are here for you every step of the way.
            </p>
            <p className="mt-4 text-white/80 text-sm">
              Chennai, Tamil Nadu, India
            </p>
            <a href="mailto:lumenaratechnologies@gmail.com" className="text-white/90 text-sm hover:text-white transition-colors mt-1 inline-block">
              lumenaratechnologies@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <motion.a href={l.href} whileHover={{ x: 4 }} className="text-white/80 hover:text-white text-sm transition-colors inline-block">
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <motion.button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-white/80 hover:text-white text-sm transition-colors text-left"
                >
                  Terms & Conditions
                </motion.button>
              </li>
              <li>
                <motion.button
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-white/80 hover:text-white text-sm transition-colors text-left"
                >
                  Privacy Policy
                </motion.button>
              </li>
              <li>
                <motion.button
                  type="button"
                  onClick={() => setRefundOpen(true)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-white/80 hover:text-white text-sm transition-colors text-left"
                >
                  Refund & Cancellation Policy
                </motion.button>
              </li>
            </ul>
          </div>
        </div>

        <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} title="Lumenara Tech – Terms And Conditions">
          <TermsContent />
        </TermsModal>
        <TermsModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Lumenara Tech – Privacy Policy">
          <PrivacyContent />
        </TermsModal>
        <TermsModal open={refundOpen} onClose={() => setRefundOpen(false)} title="Lumenara Tech – Refund & Cancellation Policy">
          <RefundContent />
        </TermsModal>

        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <p className="text-white/90 text-sm">
            © 2025 Lumenara Technologies. All rights reserved. | 33+ Clients Served | 70+ Projects Delivered
          </p>
        </div>
      </div>
    </footer>
  )
}
