import { useState } from 'react'
import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import { pricing } from '../data/content'
import { motion } from 'framer-motion'
import { FaLaptopCode, FaMobileAlt, FaHdd, FaBullhorn, FaCheck, FaCalendarAlt, FaFileContract } from 'react-icons/fa'
import TermsModal from './TermsModal'
import RefundContent from './RefundContent'

const basePrices: Record<string, { label: string; price: number; weeks: number; icon: any; desc: string }> = {
  web: { 
    label: 'Web Application', 
    price: 30000, 
    weeks: 2, 
    icon: FaLaptopCode,
    desc: 'Custom marketing sites, high-performance dashboards, or NextJS apps.' 
  },
  mobile: { 
    label: 'Mobile Application', 
    price: 50000, 
    weeks: 3, 
    icon: FaMobileAlt,
    desc: 'Native iOS & Android mobile apps built with React Native or Flutter.' 
  },
  iot: { 
    label: 'IoT Solution', 
    price: 70000, 
    weeks: 3.5, 
    icon: FaHdd,
    desc: 'Firmware development, MQTT cloud pipelines, and SCADA dashboard systems.' 
  },
  marketing: { 
    label: 'Digital Marketing & Content', 
    price: 20000, 
    weeks: 1.5, 
    icon: FaBullhorn,
    desc: 'SEO optimization, brand kit design, copy campaigns, and videos.' 
  },
}

const addonFeaturesMap: Record<string, Array<{ id: string; label: string; price: number; weeks: number; desc: string }>> = {
  web: [
    { id: 'auth', label: 'User Authentication & Roles', price: 6000, weeks: 0.5, desc: 'Secure logins, Google Sign-in, and RBAC policies.' },
    { id: 'db', label: 'Database & Backend API', price: 10000, weeks: 0.5, desc: 'Custom databases (MongoDB/Postgres) and Express REST endpoints.' },
    { id: 'payment', label: 'Payment Gateway Setup', price: 8000, weeks: 0.5, desc: 'Stripe, PayPal, or Razorpay subscription integrations.' },
    { id: 'dashboard', label: 'Real-time Telemetry Dashboard', price: 12000, weeks: 0.5, desc: 'Live websockets, graphs, charts, and system monitoring.' },
    { id: 'ai', label: 'Custom Generative AI Chatbot', price: 15000, weeks: 1.0, desc: 'LLM agents, vector embeddings, and customized prompt models.' },
  ],
  mobile: [
    { id: 'push', label: 'Push Notifications Setup', price: 5000, weeks: 0.5, desc: 'Targeted alerts, background fetch, and real-time triggers.' },
    { id: 'stores', label: 'App Store & Play Store Submissions', price: 8000, weeks: 0.5, desc: 'App bundle builds, metadata preparation, and store publishing.' },
    { id: 'offline', label: 'Offline Sync Engine', price: 10000, weeks: 0.5, desc: 'Local database storage (SQLite) with background syncing.' },
    { id: 'social_auth', label: 'Social Logins (Google/Apple)', price: 6000, weeks: 0.5, desc: 'Single tap logins and authentication tokens.' },
    { id: 'in_app', label: 'In-App Purchase & Subscriptions', price: 9000, weeks: 1.0, desc: 'Setup subscription tiers and billing validation hooks.' },
  ],
  iot: [
    { id: 'ota', label: 'OTA Firmware Update Pipeline', price: 12000, weeks: 1.0, desc: 'Secure remote device updates flashed over-the-air.' },
    { id: 'mqtt_sec', label: 'MQTT TLS Security & Keys', price: 8000, weeks: 0.5, desc: 'x509 cert authentication, TLS sockets, and payload encryption.' },
    { id: 'timeseries', label: 'Time-Series Data Integration', price: 15000, weeks: 1.0, desc: 'InfluxDB or TimescaleDB database for fast events.' },
    { id: 'hardware', label: 'Hardware Calibration', price: 20000, weeks: 1.5, desc: 'ESP32 / custom board integrations and physical pins.' },
    { id: 'websockets', label: 'Low-Latency Alert Sockets', price: 10000, weeks: 0.5, desc: 'Real-time socket servers and immediate push alarms.' },
  ],
  marketing: [
    { id: 'seo_camp', label: 'Professional SEO Campaign', price: 8000, weeks: 0.5, desc: 'Keywords optimization, directory setup, and backlink audit.' },
    { id: 'copy', label: 'Conversion Copywriting', price: 10000, weeks: 0.5, desc: 'Email workflows, landing pages, and content guides.' },
    { id: 'brand', label: 'Premium Visual Brand Kit', price: 12000, weeks: 1.0, desc: 'Typography guidelines, style guides, logos, and printable formats.' },
    { id: 'ads', label: 'Social Ad Campaign Setup', price: 7000, weeks: 0.5, desc: 'Meta Ads, Google Ads targeted parameters setup.' },
    { id: 'explainer', label: '3D Animated Explainer Video', price: 18000, weeks: 1.5, desc: 'Product modeling, custom graphics, narration, and render.' },
  ]
}

const speeds: Record<string, { label: string; multiplier: number; durationFactor: number; badge: string; desc: string }> = {
  relaxed: { 
    label: 'Relaxed Timeline', 
    multiplier: 0.9, 
    durationFactor: 1.25, 
    badge: 'Save 10%', 
    desc: 'Extended delivery dates for lower priority budgets.' 
  },
  standard: { 
    label: 'Standard Speed', 
    multiplier: 1.0, 
    durationFactor: 1.0, 
    badge: 'Standard', 
    desc: 'Symmetric sprints with normal delivery cycles.' 
  },
  express: { 
    label: 'Express Acceleration', 
    multiplier: 1.35, 
    durationFactor: 0.7, 
    badge: 'Accelerated', 
    desc: 'Overtime sprint schedules to squeeze delivery milestones.' 
  },
}

const subscriptionPlans = [
  {
    name: 'Starter Retainer',
    desc: 'Best for static sites, landing pages & minor ongoing updates.',
    monthlyPrice: 12000,
    yearlyPrice: 122400, // 15% discount of 12000 * 12
    features: [
      '10 Hours of Development / mo',
      'Basic updates & content revisions',
      'Standard email support (48h SLA)',
      'Hosting & SSL configuration support',
      'Monthly backup & security scan'
    ],
    color: '#FF10F0',
    popular: false
  },
  {
    name: 'Growth Retainer',
    desc: 'Perfect for active web apps, e-commerce, and mobile platforms.',
    monthlyPrice: 28000,
    yearlyPrice: 285600, // 15% discount
    features: [
      '30 Hours of Development / mo',
      'Priority UI/UX design & coding Sprints',
      'Fast response support (24h SLA)',
      'Server maintenance & API monitoring',
      'Analytics & SEO performance audits',
      'Weekly backups & uptime checks'
    ],
    color: '#00E5FF',
    popular: true
  },
  {
    name: 'Enterprise Retainer',
    desc: 'Dedicated capacity for complex systems, IoT support, and continuous builds.',
    monthlyPrice: 55000,
    yearlyPrice: 561000, // 15% discount
    features: [
      '60 Hours of Dedicated Sprints / mo',
      'Dedicated full-stack engineer access',
      'Instant Slack/Teams support chat',
      'Custom SLA & hotfixes',
      'Vulnerability assessments',
      'Full cloud infrastructure DevOps'
    ],
    color: '#7C4DFF',
    popular: false
  }
]

const emiPlans = [
  {
    term: 'Short-Term Monthly EMI',
    badge: '0% Interest',
    desc: 'Distribute the project cost over several months with zero interest using credit/debit cards.',
    options: [
      { duration: '3 Months', text: 'Split cost into 3 equal monthly milestones' },
      { duration: '6 Months', text: 'Split cost into 6 equal monthly milestones' },
      { duration: '12 Months', text: 'Split cost into 12 equal monthly milestones' }
    ],
    footer: 'Requires credit/debit card pre-authorization or post-dated checks.'
  },
  {
    term: 'Long-Term Yearly/Quarterly Installments',
    badge: 'Low Downpayment',
    desc: 'Perfect for enterprise-scale platforms. Pay annually or break the yearly milestone into quarters.',
    options: [
      { duration: '1 Year Plan', text: 'Pay in 4 quarterly installments (every 3 months)' },
      { duration: '2 Years Plan', text: 'Pay in 8 quarterly installments (over 24 months)' },
      { duration: '3 Years Plan', text: 'Pay in 12 quarterly installments (over 36 months)' }
    ],
    footer: 'Ideal for larger products under yearly maintenance and scaling budgets.'
  }
]

export default function Pricing() {
  const [projectType, setProjectType] = useState<string>('web')
  const [features, setFeatures] = useState<string[]>([])
  const [timeline, setTimeline] = useState<string>('standard')
  const [billingMode, setBillingMode] = useState<'upfront' | 'emi' | 'subscription'>('upfront')
  const [refundOpen, setRefundOpen] = useState(false)

  // UI state for standard plans sections
  const [standardView, setStandardView] = useState<'models' | 'subscriptions' | 'emi'>('models')
  const [subBillingCycle, setSubBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  // Interactive Estimator detail configurations
  const [calculatorSubCycle, setCalculatorSubCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [calculatorEmiCycle, setCalculatorEmiCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [calculatorEmiTerm, setCalculatorEmiTerm] = useState<number>(6) // Default to 6 Months for monthly EMI

  const currentAddons = addonFeaturesMap[projectType] || []

  // Calculate pricing
  const base = basePrices[projectType]
  let subtotalPrice = base.price
  let subtotalWeeks = base.weeks

  features.forEach((fId) => {
    const feature = currentAddons.find((f) => f.id === fId)
    if (feature) {
      subtotalPrice += feature.price
      subtotalWeeks += feature.weeks
    }
  })

  const speed = speeds[timeline]
  const finalPrice = Math.round(subtotalPrice * speed.multiplier)
  const finalWeeks = Math.max(0.5, Math.round((subtotalWeeks * speed.durationFactor) * 2) / 2)

  const toggleFeature = (id: string) => {
    setFeatures((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleConvertToBrief = () => {
    const selectedFeaturesText = features.length > 0 
      ? features.map(fId => currentAddons.find(f => f.id === fId)?.label).join(', ') 
      : 'None'

    let billingText = ''
    if (billingMode === 'upfront') {
      billingText = `Upfront Milestone Payment (₹${finalPrice.toLocaleString('en-IN')})`
    } else if (billingMode === 'emi') {
      if (calculatorEmiCycle === 'monthly') {
        billingText = `0% Interest Monthly EMI Option (${calculatorEmiTerm} Months: ₹${Math.round(finalPrice / calculatorEmiTerm).toLocaleString('en-IN')}/month)`
      } else {
        const yearUnit = calculatorEmiTerm === 1 ? 'Year' : 'Years'
        billingText = `0% Interest Yearly Installment Option (${calculatorEmiTerm} ${yearUnit}: ₹${Math.round(finalPrice / calculatorEmiTerm).toLocaleString('en-IN')}/year, or ₹${Math.round(finalPrice / (calculatorEmiTerm * 4)).toLocaleString('en-IN')}/quarter)`
      }
    } else {
      if (calculatorSubCycle === 'monthly') {
        billingText = `Monthly Retainer Subscription (₹${Math.round(finalPrice * 0.08 + 3000).toLocaleString('en-IN')}/month)`
      } else {
        billingText = `Yearly Retainer Subscription (₹${Math.round((finalPrice * 0.08 + 3000) * 10).toLocaleString('en-IN')}/year, includes 15% discount)`
      }
    }

    const brief = [
      `Hello! I used your Interactive Cost Calculator to structure an estimate:`,
      `----------------------------------------------------`,
      `• Project Type: ${basePrices[projectType].label}`,
      `• Chosen Features: ${selectedFeaturesText}`,
      `• Timeline Speed: ${speeds[timeline].label} (${speeds[timeline].badge})`,
      `• Billing Format: ${billingText}`,
      `• Target Duration: ~${finalWeeks} weeks`,
      `----------------------------------------------------`,
      `I would like to discuss my requirements and finalize the scope. Please contact me.`
    ].join('\n')

    // Find contact message textarea
    const contactMessageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement | null
    const textarea = contactMessageTextarea || document.querySelector('#contact textarea') as HTMLTextAreaElement | null
    
    if (textarea) {
      textarea.value = brief
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
      textarea.dispatchEvent(new Event('change', { bubbles: true }))
    }

    // Scroll to contact form
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
      // Focus name field
      setTimeout(() => {
        const nameInput = document.querySelector('#contact input[name="name"]') as HTMLInputElement | null || document.querySelector('#contact input') as HTMLInputElement | null
        if (nameInput) nameInput.focus()
      }, 800)
    }
  }

  return (
    <section className="relative py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard className="space-y-12">
          {/* Section Heading & Plan Tabs */}
          <div className="space-y-8">
            <SectionHeader id="pricing" kicker="Engagement & Calculator" title="Flexible Ways to Partner" subtitle="Transparent engagement models and automated scoping tools." />
            
            {/* Top Tab Swapper */}
            <div className="flex justify-center">
              <div className="flex border border-white/10 bg-black/40 rounded-xl p-1 text-[11px] font-semibold select-none max-w-md w-full shadow-inner">
                <button
                  type="button"
                  onClick={() => setStandardView('models')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    standardView === 'models'
                      ? 'bg-gradient-to-r from-[#FF10F0]/20 to-[#00E5FF]/20 text-white border border-white/10 shadow-glow'
                      : 'text-white/45 hover:text-white border border-transparent'
                  }`}
                >
                  Engagement Models
                </button>
                <button
                  type="button"
                  onClick={() => setStandardView('subscriptions')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    standardView === 'subscriptions'
                      ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#7C4DFF]/20 text-white border border-white/10 shadow-glow'
                      : 'text-white/45 hover:text-white border border-transparent'
                  }`}
                >
                  Retainer Subscriptions
                </button>
                <button
                  type="button"
                  onClick={() => setStandardView('emi')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    standardView === 'emi'
                      ? 'bg-gradient-to-r from-[#7C4DFF]/20 to-[#FF10F0]/20 text-white border border-white/10 shadow-glow'
                      : 'text-white/45 hover:text-white border border-transparent'
                  }`}
                >
                  0% Interest EMI
                </button>
              </div>
            </div>

            {/* Dynamic Details based on standardView */}
            <div className="min-h-[220px]">
              {standardView === 'models' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {pricing.map((p) => (
                    <div key={p.plan} className="rounded-xl border border-[#FF10F0]/25 bg-white/5 p-6 hover:border-[#FF10F0]/50 hover:shadow-glow transition-all duration-300 text-left">
                      <h3 className="text-xl font-semibold text-glow">{p.plan}</h3>
                      <p className="mt-2 text-white/70 text-sm leading-relaxed">{p.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {standardView === 'subscriptions' && (
                <div className="space-y-6">
                  {/* Billing Cycle Switcher for Retainer */}
                  <div className="flex justify-center items-center gap-3">
                    <span className={`text-xs ${subBillingCycle === 'monthly' ? 'text-white font-semibold' : 'text-white/50'}`}>Billed Monthly</span>
                    <button
                      type="button"
                      onClick={() => setSubBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                      className="w-11 h-6 rounded-full bg-white/15 p-1 transition-colors duration-300 relative focus:outline-none"
                    >
                      <div className={`w-4 h-4 rounded-full bg-[#00E5FF] transition-transform duration-300 transform ${subBillingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-xs ${subBillingCycle === 'yearly' ? 'text-white font-semibold' : 'text-white/50'} flex items-center gap-1.5`}>
                      Billed Annually
                      <span className="bg-gradient-to-r from-[#FF10F0] to-[#00E5FF] text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded">Save 15%</span>
                    </span>
                  </div>

                  {/* Subscriptions Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan) => (
                      <div 
                        key={plan.name} 
                        className={`rounded-2xl border bg-white/5 p-6 relative flex flex-col justify-between transition-all duration-300 text-left ${
                          plan.popular 
                            ? 'border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.15)] bg-white/[0.07]' 
                            : 'border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 right-4 bg-[#00E5FF] text-black text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-glow">
                            Most Popular
                          </span>
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight">{plan.name}</h3>
                          <p className="text-xs text-white/50 mt-1 leading-relaxed min-h-[32px]">{plan.desc}</p>
                          
                          <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-lg font-semibold text-white/70">₹</span>
                            <span className="text-2xl font-extrabold text-white">
                              {(subBillingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-white/40">
                              /mo
                            </span>
                            {subBillingCycle === 'yearly' && (
                              <span className="text-[10px] text-emerald-400 font-medium ml-2 block">
                                (Billed ₹{plan.yearlyPrice.toLocaleString('en-IN')}/yr)
                              </span>
                            )}
                          </div>

                          <ul className="mt-6 space-y-2.5 text-left border-t border-white/5 pt-4">
                            {plan.features.map((feat) => (
                              <li key={feat} className="text-xs text-white/70 flex items-start gap-2">
                                <span className="text-emerald-400 mt-0.5"><FaCheck size={9} /></span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 pt-2">
                          <button 
                            onClick={() => {
                              const contactMessageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement | null || document.querySelector('#contact textarea') as HTMLTextAreaElement | null
                              if (contactMessageTextarea) {
                                contactMessageTextarea.value = `Hello! I would like to subscribe to the ${plan.name} (${subBillingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Plan). Please contact me to set this up.`
                                contactMessageTextarea.dispatchEvent(new Event('input', { bubbles: true }))
                              }
                              const contactSection = document.getElementById('contact')
                              if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${
                              plan.popular
                                ? 'bg-[#00E5FF] text-black border-[#00E5FF] hover:bg-[#00E5FF]/80 hover:shadow-glow'
                                : 'bg-transparent text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                            }`}
                          >
                            Select {plan.name}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {standardView === 'emi' && (
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  {emiPlans.map((plan) => (
                    <div key={plan.term} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white">{plan.term}</h3>
                          <span className="bg-[#FF10F0]/15 text-[#FF10F0] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            {plan.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{plan.desc}</p>
                        
                        <div className="mt-6 space-y-3">
                          {plan.options.map((opt) => (
                            <div key={opt.duration} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                              <span className="text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-lg shrink-0">
                                {opt.duration}
                              </span>
                              <span className="text-xs text-white/80">{opt.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] text-white/40">
                        <span>{plan.footer}</span>
                        <button
                          onClick={() => {
                            const contactMessageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement | null || document.querySelector('#contact textarea') as HTMLTextAreaElement | null
                            if (contactMessageTextarea) {
                              contactMessageTextarea.value = `Hello! I would like to explore the ${plan.term} options for my project. Please get in touch with details.`
                              contactMessageTextarea.dispatchEvent(new Event('input', { bubbles: true }))
                            }
                            const contactSection = document.getElementById('contact')
                            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className="text-[#FF10F0] hover:text-[#FF10F0]/80 font-bold self-start sm:self-auto"
                        >
                          Inquire Option &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Glowing Neon Divider */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#FF10F0]/40 to-transparent my-6" />

          {/* Cost Calculator Section */}
          <div className="space-y-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF10F0] to-[#00E5FF]">
                  Interactive Project Estimator
                </span>
              </h3>
              <p className="text-white/60 text-sm mt-1">
                Customize your features, stack, and delivery requirements to generate a real-time visual quote.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Controls Column */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* 1. Project Type Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                    1. Select Project Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(basePrices).map(([key, data]) => {
                      const Icon = data.icon
                      const active = projectType === key
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setProjectType(key)
                            setFeatures([])
                          }}
                          className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                            active 
                              ? 'border-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.25)]' 
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${active ? 'bg-[#00E5FF] text-black' : 'bg-white/5 text-[#00E5FF]'}`}>
                              <Icon size={18} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-sm">{data.label}</h4>
                              <p className="text-[11px] text-white/50 mt-0.5 line-clamp-1">{data.desc}</p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Feature Add-ons Checkbox Grid */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                    2. Add Custom Features (Optional Add-ons)
                  </label>
                  <div className="space-y-2">
                    {currentAddons.map((feat) => {
                      const checked = features.includes(feat.id)
                      return (
                        <button
                          key={feat.id}
                          type="button"
                          onClick={() => toggleFeature(feat.id)}
                          className={`w-full rounded-xl border p-3.5 text-left transition-all duration-300 flex items-center justify-between ${
                            checked 
                              ? 'border-[#FF10F0] bg-[#FF10F0]/5 shadow-[0_0_12px_rgba(255,16,240,0.15)]' 
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 pr-2">
                            <div className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              checked ? 'bg-[#FF10F0] border-[#FF10F0] text-black' : 'border-white/30 bg-transparent'
                            }`}>
                              {checked && <FaCheck size={10} />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-sm">{feat.label}</h4>
                              <p className="text-[11px] text-white/50 mt-0.5">{feat.desc}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-[#FF10F0]">+₹{feat.price.toLocaleString('en-IN')}</span>
                            <span className="block text-[10px] text-white/40 font-medium">+{feat.weeks} wk</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Delivery Speed Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                    3. Delivery Speed & Urgency
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(speeds).map(([key, data]) => {
                      const active = timeline === key
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTimeline(key)}
                          className={`rounded-xl border p-4 text-left transition-all duration-300 relative ${
                            active 
                              ? 'border-[#7C4DFF] bg-[#7C4DFF]/5 shadow-[0_0_15px_rgba(124,77,255,0.25)]' 
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <span className={`absolute right-3 top-3 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            active ? 'bg-[#7C4DFF] text-white' : 'bg-white/10 text-white/60'
                          }`}>
                            {data.badge}
                          </span>
                          <div className="mt-1">
                            <h4 className="font-semibold text-white text-sm">{data.label}</h4>
                            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{data.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Estimate Display Column */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c0c14] to-[#121220] p-6 shadow-glow relative overflow-hidden flex flex-col justify-between h-full min-h-[380px]">
                  {/* Neon Grid Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-20" />
                  
                  {/* Highlight Glow Accent */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#00E5FF]/20 blur-[50px]" />
                  <div className="pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-[#FF10F0]/10 blur-[50px]" />

                  <div className="relative space-y-6 flex-1 flex flex-col justify-center">
                    {/* Billing Mode Toggle Switcher */}
                    <div className="flex border border-white/10 bg-black/40 rounded-xl p-1 text-[10px] font-semibold select-none">
                      <button
                        type="button"
                        onClick={() => setBillingMode('upfront')}
                        className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                          billingMode === 'upfront'
                            ? 'bg-[#00E5FF]/20 text-white border border-[#00E5FF]/30 shadow-glow'
                            : 'text-white/45 hover:text-white border border-transparent'
                        }`}
                      >
                        Upfront
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingMode('emi')}
                        className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                          billingMode === 'emi'
                            ? 'bg-[#FF10F0]/20 text-white border border-[#FF10F0]/30 shadow-glow'
                            : 'text-white/45 hover:text-white border border-transparent'
                        }`}
                      >
                        EMI (0%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingMode('subscription')}
                        className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                          billingMode === 'subscription'
                            ? 'bg-[#7C4DFF]/20 text-white border border-[#7C4DFF]/30 shadow-glow'
                            : 'text-white/45 hover:text-white border border-transparent'
                        }`}
                      >
                        Subscription
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                        Project Summary
                      </span>
                      <h4 className="text-lg font-semibold text-white mt-1">
                        {basePrices[projectType].label}
                      </h4>
                    </div>

                    {/* Cost Showcase based on Billing Mode */}
                    {billingMode === 'upfront' && (
                      <div className="text-center py-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-xs text-white/50 font-medium">Estimated Investment</span>
                        <div className="mt-1 flex items-baseline justify-center gap-1">
                          <span className="text-xl font-medium text-[#00E5FF]">₹</span>
                          <motion.span 
                            key={finalPrice}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-5xl font-extrabold tracking-tight text-white text-glow"
                          >
                            {finalPrice.toLocaleString('en-IN')}
                          </motion.span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">Paid in milestones (50% upfront, 50% completion)</p>
                      </div>
                    )}

                    {billingMode === 'emi' && (
                      <div className="text-left py-4 px-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                        {/* Sub-selector for Monthly vs Yearly EMI */}
                        <div className="flex border border-white/5 bg-black/60 rounded-lg p-0.5 text-[9px] font-semibold">
                          <button
                            type="button"
                            onClick={() => {
                              setCalculatorEmiCycle('monthly')
                              setCalculatorEmiTerm(6)
                            }}
                            className={`flex-1 py-1 text-center rounded transition-all ${
                              calculatorEmiCycle === 'monthly'
                                ? 'bg-[#FF10F0]/20 text-white'
                                : 'text-white/45 hover:text-white'
                            }`}
                          >
                            Monthly EMI
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCalculatorEmiCycle('yearly')
                              setCalculatorEmiTerm(2)
                            }}
                            className={`flex-1 py-1 text-center rounded transition-all ${
                              calculatorEmiCycle === 'yearly'
                                ? 'bg-[#00E5FF]/20 text-white'
                                : 'text-white/45 hover:text-white'
                            }`}
                          >
                            Yearly Installment
                          </button>
                        </div>

                        {calculatorEmiCycle === 'monthly' ? (
                          <div className="space-y-3">
                            <span className="text-[10px] text-white/50 font-semibold uppercase block">Select Month Term</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[3, 6, 12].map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => setCalculatorEmiTerm(term)}
                                  className={`py-1 text-center rounded text-[10px] border font-bold transition-all ${
                                    calculatorEmiTerm === term
                                      ? 'border-[#FF10F0] bg-[#FF10F0]/10 text-white'
                                      : 'border-white/10 bg-transparent text-white/60 hover:border-white/30'
                                  }`}
                                >
                                  {term} Mo
                                </button>
                              ))}
                            </div>
                            <div className="flex items-baseline gap-1 mt-2 justify-center py-2 bg-white/5 rounded-xl border border-white/5">
                              <span className="text-sm font-semibold text-[#FF10F0]">₹</span>
                              <span className="text-2xl font-bold text-white">
                                {Math.round(finalPrice / calculatorEmiTerm).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-white/40">/ month</span>
                            </div>
                            <p className="text-[9px] text-white/45 text-center mt-1">0% interest credit card EMI or custom post-dated plans</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <span className="text-[10px] text-white/50 font-semibold uppercase block">Select Year Term</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[1, 2, 3].map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => setCalculatorEmiTerm(term)}
                                  className={`py-1 text-center rounded text-[10px] border font-bold transition-all ${
                                    calculatorEmiTerm === term
                                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                                      : 'border-white/10 bg-transparent text-white/60 hover:border-white/30'
                                  }`}
                                >
                                  {term} {term === 1 ? 'Year' : 'Years'}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-1.5 py-2 px-3 bg-white/5 rounded-xl border border-white/5 text-center">
                              <div className="flex items-baseline gap-1 justify-center">
                                <span className="text-sm font-semibold text-[#00E5FF]">₹</span>
                                <span className="text-2xl font-bold text-white">
                                  {Math.round(finalPrice / calculatorEmiTerm).toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-white/40">/ year</span>
                              </div>
                              <div className="text-[9px] text-white/50">
                                or <span className="text-white font-semibold">₹{Math.round(finalPrice / (calculatorEmiTerm * 4)).toLocaleString('en-IN')}</span> / quarter (4 payments/yr)
                              </div>
                            </div>
                            <p className="text-[9px] text-white/45 text-center mt-1">Structured billing options for annual software rollout budgets</p>
                          </div>
                        )}
                      </div>
                    )}

                    {billingMode === 'subscription' && (
                      <div className="text-left py-4 px-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                        {/* Sub-selector for Monthly vs Yearly Subscription */}
                        <div className="flex border border-white/5 bg-black/60 rounded-lg p-0.5 text-[9px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setCalculatorSubCycle('monthly')}
                            className={`flex-1 py-1 text-center rounded transition-all ${
                              calculatorSubCycle === 'monthly'
                                ? 'bg-[#7C4DFF]/20 text-white'
                                : 'text-white/45 hover:text-white'
                            }`}
                          >
                            Monthly Retainer
                          </button>
                          <button
                            type="button"
                            onClick={() => setCalculatorSubCycle('yearly')}
                            className={`flex-1 py-1 text-center rounded transition-all ${
                              calculatorSubCycle === 'yearly'
                                ? 'bg-[#C3FF00]/20 text-white'
                                : 'text-white/45 hover:text-white'
                            }`}
                          >
                            Yearly Retainer (Save 15%)
                          </button>
                        </div>

                        {calculatorSubCycle === 'monthly' ? (
                          <div className="space-y-3">
                            <span className="text-[10px] text-white/50 font-semibold uppercase block flex items-center justify-between">
                              Monthly Subscription Rate
                              <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/80 font-normal">Retainer</span>
                            </span>
                            <div className="flex items-baseline gap-1 justify-center py-2 bg-white/5 rounded-xl border border-white/5">
                              <span className="text-sm font-semibold text-[#7C4DFF]">₹</span>
                              <span className="text-2xl font-bold text-white">
                                {Math.round(finalPrice * 0.08 + 3000).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-white/40">/ month</span>
                            </div>
                            <p className="text-[9px] text-white/45 text-center mt-1">Provides updates, priority support SLA, and continuous development blocks</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <span className="text-[10px] text-white/50 font-semibold uppercase block flex items-center justify-between">
                              Yearly Subscription Rate
                              <span className="text-[8px] bg-gradient-to-r from-[#FF10F0] to-[#00E5FF] px-1.5 py-0.5 rounded text-black font-bold">15% Discount</span>
                            </span>
                            <div className="flex items-baseline gap-1 justify-center py-2 bg-white/5 rounded-xl border border-white/5">
                              <span className="text-sm font-semibold text-[#C3FF00]">₹</span>
                              <span className="text-2xl font-bold text-white">
                                {Math.round((finalPrice * 0.08 + 3000) * 10).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-white/40">/ year</span>
                            </div>
                            <p className="text-[9px] text-white/45 text-center mt-1">Prepaid yearly retainer covering security SLA, hosting support & development hours</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timeline Showcase */}
                    <div className="flex justify-around items-center text-center">
                      <div>
                        <span className="text-xs text-white/50 block">Target Timeline</span>
                        <span className="text-2xl font-bold text-[#FF10F0] mt-1 block">
                          ~{finalWeeks} Weeks
                        </span>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div>
                        <span className="text-xs text-white/50 block">Selected Add-ons</span>
                        <span className="text-2xl font-bold text-white mt-1 block">
                           {features.length} / {currentAddons.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="relative mt-6 pt-4 border-t border-white/5">
                    <button
                      onClick={handleConvertToBrief}
                      className="w-full py-4 rounded-xl font-bold text-white bg-black border border-[#FF10F0]/50 shadow-neon-pink hover:shadow-neon-pink-glow hover:border-[#FF10F0]/80 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FaFileContract className="text-[#FF10F0]" />
                      Convert to Brief & Get Quote
                    </button>
                    <span className="text-[10px] text-white/40 block text-center mt-2.5">
                      This will auto-fill the contact form details below!
                    </span>
                    <div className="text-[10px] text-white/50 text-center mt-3">
                      By proceeding, you agree to our{' '}
                      <button
                        type="button"
                        onClick={() => setRefundOpen(true)}
                        className="text-[#FF10F0] hover:underline font-semibold focus:outline-none"
                      >
                        Refund & Cancellation Policy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
      <TermsModal open={refundOpen} onClose={() => setRefundOpen(false)} title="Lumenara Tech – Refund & Cancellation Policy">
        <RefundContent />
      </TermsModal>
    </section>
  )
}

