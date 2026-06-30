import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import { FaCompass, FaPaintBrush, FaCode, FaRocket, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa'

const PROCESS_DETAILS = [
  {
    step: 'Discover',
    tagline: 'Mapping goals, risks, and boundaries',
    detail: 'We align stakeholder expectations, perform technical feasibility audits, and draft a clean scope outline to minimize future scope creep and design errors.',
    duration: '1 - 2 Weeks',
    icon: FaCompass,
    deliverables: ['Product Requirement Document (PRD)', 'Tech Architecture Diagram', 'Project Estimate & SOW'],
    color: '#FF10F0',
    glowClass: 'shadow-[0_0_15px_rgba(255,16,240,0.35)] border-[#FF10F0]/50'
  },
  {
    step: 'Design',
    tagline: 'High-fidelity mockups and interactive UX',
    detail: 'We build interactive Figma prototypes, wireframe complex user flows, and establish a cohesive design system aligned with modern visual practices.',
    duration: '2 - 3 Weeks',
    icon: FaPaintBrush,
    deliverables: ['Figma Styleguide & Library', 'Interactive Prototypes', 'User Testing Reports'],
    color: '#00E5FF',
    glowClass: 'shadow-[0_0_15px_rgba(0,229,255,0.35)] border-[#00E5FF]/50'
  },
  {
    step: 'Build',
    tagline: 'Clean, secure, and observable coding',
    detail: 'We write robust, modular TypeScript code with unified linting and CI/CD automated staging deployments. All API integrations are thoroughly unit-tested.',
    duration: '4 - 12 Weeks',
    icon: FaCode,
    deliverables: ['Clean Git Repositories', 'Staging Deployments', 'API Endpoints & Documentation'],
    color: '#7C4DFF',
    glowClass: 'shadow-[0_0_15px_rgba(124,77,255,0.35)] border-[#7C4DFF]/50'
  },
  {
    step: 'Launch',
    tagline: 'Performance optimization and hard release',
    detail: 'We optimize Core Web Vitals, run penetration tests, configure automated DNS/SSL structures, and publish listings to app stores or production servers.',
    duration: '1 Week',
    icon: FaRocket,
    deliverables: ['Lighthouse Audit Reports (90+)', 'Production Release Build', 'SSL/Security Configuration'],
    color: '#C3FF00',
    glowClass: 'shadow-[0_0_15px_rgba(195,255,0,0.35)] border-[#C3FF00]/50'
  },
  {
    step: 'Grow',
    tagline: 'Observed analytics and continuous iteration',
    detail: 'We install real-time analytics monitors, track conversion funnels, execute monthly optimization schedules, and deliver roadmap features.',
    duration: 'Ongoing Support',
    icon: FaChartLine,
    deliverables: ['Analytics Dashboards', 'Monthly Maintenance Audits', 'Performance Optimization Sprints'],
    color: '#FF2CFB',
    glowClass: 'shadow-[0_0_15px_rgba(255,44,251,0.35)] border-[#FF2CFB]/50'
  }
]

export default function Process() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const current = PROCESS_DETAILS[activeStep]
  const CurrentIcon = current.icon

  return (
    <section className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard>
          <SectionHeader id="process" kicker="How We Partner" title="From Brief to Breakthrough" subtitle="Our structured execution framework ensures transparency, velocity, and quality." />
          
          <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Steps List */}
            <div className="lg:col-span-5 relative space-y-4 text-left">
              {/* Vertical timeline track line background */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-white/10 hidden md:block" />
              
              {/* Dynamic filled line overlay */}
              <div 
                className="absolute left-[27px] top-6 w-0.5 bg-gradient-to-b from-[#FF10F0] via-[#00E5FF] to-[#7C4DFF] hidden md:block transition-all duration-500 ease-out" 
                style={{
                  height: `${(activeStep / (PROCESS_DETAILS.length - 1)) * 82}%`,
                }}
              />

              {PROCESS_DETAILS.map((s, idx) => {
                const Icon = s.icon
                const active = activeStep === idx
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 relative z-10 ${
                      active 
                        ? 'border-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.15)] scale-[1.02]' 
                        : 'border-white/10 bg-[#08080f]/50 hover:border-white/20'
                    }`}
                  >
                    {/* Step Icon Button */}
                    <div 
                      className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        active 
                          ? 'bg-[#00E5FF] text-black border-[#00E5FF]' 
                          : 'bg-white/5 text-white/50 border-white/20'
                      }`}
                      style={{
                        boxShadow: active ? `0 0 12px ${s.color}` : 'none'
                      }}
                    >
                      <Icon size={14} />
                    </div>

                    {/* Step Titles */}
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        active ? 'text-[#00E5FF]' : 'text-white/40'
                      }`}>
                        Stage 0{idx + 1}
                      </span>
                      <h4 className="font-semibold text-white text-base leading-tight mt-0.5">
                        {s.step}
                      </h4>
                      <p className="text-white/50 text-[11px] mt-0.5 line-clamp-1">
                        {s.tagline}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right Column: Step Details Panel (Glassmorphic Card) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl border bg-gradient-to-br from-[#0c0c14] to-[#121220] p-6 text-left ${current.glowClass}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl border border-white/10 bg-white/5" style={{ color: current.color }}>
                        <CurrentIcon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">
                          {current.step} Phase
                        </h3>
                        <p className="text-xs text-white/50">{current.tagline}</p>
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
                      <FaClock size={12} style={{ color: current.color }} />
                      <span>{current.duration}</span>
                    </div>
                  </div>

                  {/* Description body */}
                  <div className="mt-5 space-y-5">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5">
                        What We Do
                      </h4>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {current.detail}
                      </p>
                    </div>

                    {/* Key deliverables list */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2.5">
                        Key Deliverables
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/90">
                        {current.deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5">
                            <FaCheckCircle className="shrink-0 mt-0.5 text-xs" style={{ color: current.color }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  )
}
