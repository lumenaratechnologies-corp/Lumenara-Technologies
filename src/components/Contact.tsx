import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import { useState, useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'
import SectionCard from './SectionCard'
import logo from '../assets/logo.png'

const MAX_NAME = 100
const MAX_EMAIL = 254
const MAX_MESSAGE = 5000

const schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(MAX_NAME, `Name must be at most ${MAX_NAME} characters`),
  email: z.string().trim().email('Please enter a valid email address').max(MAX_EMAIL, 'Email address is too long'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(MAX_MESSAGE, `Message must be at most ${MAX_MESSAGE} characters`)
})

type FormData = z.infer<typeof schema>

const RECIPIENT_EMAIL = 'lumenaratechnologies@gmail.com'

// EmailJS Configuration - You can set these via environment variables or replace directly
// To use EmailJS: 
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create an email service (Gmail recommended)
// 3. Create an email template with variables: {{from_name}}, {{from_email}}, {{message}}
// 4. Get your Service ID, Template ID, and Public Key from the dashboard
// 5. Either set environment variables or replace the values below
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

const SUBMIT_THROTTLE_MS = 60000 // 1 minute between submissions

export default function Contact() {
  const [activeTab, setActiveTab] = useState<'project' | 'career'>('project')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const lastSubmitTimeRef = useRef<number>(0)
  
  // Career application states
  const [careerName, setCareerName] = useState('')
  const [careerEmail, setCareerEmail] = useState('')
  const [careerRole, setCareerRole] = useState('Frontend React Developer')
  const [careerLink, setCareerLink] = useState('')
  const [careerNote, setCareerNote] = useState('')
  const [careerSubmitting, setCareerSubmitting] = useState(false)
  const [careerSuccess, setCareerSuccess] = useState(false)
  const [careerError, setCareerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ 
    resolver: zodResolver(schema) 
  })

  // Listen to navigation events to toggle tabs
  useEffect(() => {
    const handleCareersOpen = () => setActiveTab('career')
    const handleContactOpen = () => setActiveTab('project')

    window.addEventListener('careers-tab-open', handleCareersOpen)
    window.addEventListener('contact-tab-open', handleContactOpen)

    return () => {
      window.removeEventListener('careers-tab-open', handleCareersOpen)
      window.removeEventListener('contact-tab-open', handleContactOpen)
    }
  }, [])

  // Initialize EmailJS if configured
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY)
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    const now = Date.now()
    if (now - lastSubmitTimeRef.current < SUBMIT_THROTTLE_MS) {
      setSubmitError('Please wait a moment before sending another message.')
      return
    }
    lastSubmitTimeRef.current = now
    setSubmitError(null)
    setSubmitSuccess(false)
    
    try {
      // Try EmailJS first if configured
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          const templateParams = {
            from_name: data.name,
            from_email: data.email,
            message: data.message,
            to_email: RECIPIENT_EMAIL,
            reply_to: data.email
          }

          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
          )

          setSubmitSuccess(true)
          reset()
          setTimeout(() => {
            setSubmitSuccess(false)
          }, 5000)
          return
        } catch (emailjsError) {
          console.error('EmailJS failed, trying alternative method:', emailjsError)
        }
      }

      // Fallback: Use FormSubmit
      const formData = new FormData()
      formData.append('Name', data.name)
      formData.append('Email', data.email)
      formData.append('Message', data.message)
      
      formData.append('_to', RECIPIENT_EMAIL)
      formData.append('_subject', `New Contact Form Submission from ${data.name.slice(0, 50)}`)
      formData.append('_replyto', data.email)
      formData.append('_captcha', 'false')
      formData.append('_template', 'table')

      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      const result = await response.json()
      
      if (result.success !== false) {
        setSubmitSuccess(true)
        reset()
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } else {
        throw new Error(result.message || 'Failed to send email')
      }
      
    } catch (error) {
      console.error('Email sending failed:', error)
      setSubmitError('Failed to send message. Please contact us directly at lumenaratechnologies@gmail.com or try again later.')
    }
  }

  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!careerName.trim() || !careerEmail.trim() || !careerNote.trim()) {
      setCareerError('Please fill out your Name, Email, and message note.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(careerEmail)) {
      setCareerError('Please enter a valid email address.')
      return
    }

    setCareerSubmitting(true)
    setCareerError(null)
    setCareerSuccess(false)

    try {
      const formData = new FormData()
      formData.append('Form Type', 'Careers Job Application')
      formData.append('Candidate Name', careerName.trim())
      formData.append('Candidate Email', careerEmail.trim())
      formData.append('Target Position', careerRole)
      formData.append('Portfolio/LinkedIn URL', careerLink.trim() || 'Not Provided')
      formData.append('Cover Message / Note', careerNote.trim())

      formData.append('_to', RECIPIENT_EMAIL)
      formData.append('_subject', `Careers Application: ${careerRole} - ${careerName.slice(0, 40)}`)
      formData.append('_replyto', careerEmail.trim())
      formData.append('_captcha', 'false')
      formData.append('_template', 'table')

      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Submission request failed')
      const result = await response.json()

      if (result.success !== false) {
        setCareerSuccess(true)
        setCareerName('')
        setCareerEmail('')
        setCareerLink('')
        setCareerNote('')
        setTimeout(() => setCareerSuccess(false), 6000)
      } else {
        throw new Error(result.message || 'Submission failed')
      }

    } catch (err: any) {
      console.error(err)
      setCareerError('Failed to submit application. Please email your CV directly to lumenaratechnologies@gmail.com.')
    } finally {
      setCareerSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionCard>
          <SectionHeader id="contact-anchor" kicker="Contact & Careers" title="Let's Connect" />
          <div className="mt-6 grid md:grid-cols-2 gap-8">
            <div className="text-white/75 text-left">
              <div className="mb-6 flex items-center gap-3">
                <img src={logo} alt="Lumenara Technologies" className="h-10 w-auto" />
                <span className="font-semibold text-white text-lg">Lumenara Technologies</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Empowering digital innovation and business performance. From strategic consulting to professional services, we are here for you every step of the way.
              </p>
              <br />
              <p className="text-white/90 text-sm">
                <span className="block font-medium">Chennai, Tamil Nadu, India</span>
                <a href="mailto:lumenaratechnologies@gmail.com" className="text-[#00E5FF] hover:underline font-semibold">lumenaratechnologies@gmail.com</a>
              </p>
              <div className="mt-6">
                <p className="text-white/80 mb-3 text-sm font-medium">Follow us</p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.instagram.com/lumenaratechnologies/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#E4405F]/20"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61583658801224"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#1877F2]/20"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href="https://x.com/LumenaraTech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#1DA1F2]/20"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/lumenara-technologies-b04654397/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#0077B5] hover:border-[#0077B5]/50 hover:bg-[#0077B5]/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#0077B5]/20"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column form: Toggle tabs */}
            <div className="rounded-xl border border-[#FF10F0]/25 bg-[#08080f]/50 p-6 space-y-4 hover:border-[#FF10F0]/40 transition-all duration-300">
              <div className="flex border-b border-white/10 pb-4 mb-2 gap-2 text-xs md:text-sm font-semibold select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('project')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    activeTab === 'project'
                      ? 'bg-gradient-to-r from-[#FF10F0]/10 to-[#00E5FF]/10 text-white border border-[#FF10F0]/40 shadow-glow'
                      : 'text-white/50 hover:text-white/80 border border-transparent'
                  }`}
                >
                  Hire Us (Project Quote)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('career')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    activeTab === 'career'
                      ? 'bg-gradient-to-r from-[#FF10F0]/10 to-[#00E5FF]/10 text-white border border-[#FF10F0]/40 shadow-glow'
                      : 'text-white/50 hover:text-white/80 border border-transparent'
                  }`}
                >
                  Join Our Team (Careers)
                </button>
              </div>

              {activeTab === 'project' ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
                  <Field label="Name" error={errors.name?.message}>
                    <input {...register('name')} maxLength={MAX_NAME} autoComplete="name" className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF]" placeholder="Your Name" />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input {...register('email')} type="email" maxLength={MAX_EMAIL} autoComplete="email" className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF]" placeholder="Mail@company.com" />
                  </Field>
                  <Field label="Project Brief" error={errors.message?.message}>
                    <textarea {...register('message')} rows={5} maxLength={MAX_MESSAGE} className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF] leading-relaxed" placeholder="Tell us about your project or cost estimate brief…" />
                  </Field>
                  {submitError && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}
                  {submitSuccess && !submitError && (
                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/50 text-green-400 text-sm">
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold bg-black text-white border border-[#8A2BE2]/60 shadow-neon-purple hover:shadow-neon-purple-hover disabled:opacity-60 disabled:shadow-none transition-all duration-300 [text-shadow:0_0_12px_rgba(255,255,255,0.4)]"
                  >
                    {isSubmitting ? 'Sending…' : submitSuccess ? 'Sent!' : 'Send Request'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCareerSubmit} className="space-y-4 text-left" noValidate>
                  {/* Position open roles mini showcase */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#00E5FF] block">Active Openings</span>
                    <div className="text-[11px] space-y-1 text-white/70">
                      <p>• **Frontend React Developer** (1-3 yrs, Chennai/Hybrid)</p>
                      <p>• **Mobile Native Developer** (2+ yrs Flutter/RN, Hybrid)</p>
                      <p>• **Figma UI/UX Designer** (Intern / Junior, Hybrid)</p>
                    </div>
                  </div>

                  <Field label="Candidate Name" error={careerError && !careerName ? 'Required' : undefined}>
                    <input type="text" value={careerName} onChange={(e) => setCareerName(e.target.value)} maxLength={100} className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF]" placeholder="Your Name" />
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="Email Address">
                      <input type="email" value={careerEmail} onChange={(e) => setCareerEmail(e.target.value)} maxLength={100} className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF]" placeholder="you@example.com" />
                    </Field>
                    <Field label="Apply Position">
                      <select 
                        value={careerRole} 
                        onChange={(e) => setCareerRole(e.target.value)} 
                        className="w-full rounded-md bg-[#0d0d15] border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF] h-[46px]"
                      >
                        <option value="Frontend React Developer">Frontend React Developer</option>
                        <option value="Mobile Native Developer">Mobile Native Developer</option>
                        <option value="Figma UI/UX Designer">Figma UI/UX Designer</option>
                        <option value="Other / General Application">Other / Speculative CV</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Portfolio or LinkedIn URL (Optional)">
                    <input type="url" value={careerLink} onChange={(e) => setCareerLink(e.target.value)} maxLength={200} className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF]" placeholder="https://github.com/... or linkedin" />
                  </Field>

                  <Field label="Introduction Note / Cover Letter" error={careerError && !careerNote ? 'Required' : undefined}>
                    <textarea value={careerNote} onChange={(e) => setCareerNote(e.target.value)} rows={4} maxLength={2000} className="w-full rounded-md bg-black/40 border border-white/10 p-3 text-sm text-white outline-none focus:border-[#00E5FF] leading-relaxed" placeholder="Tell us about yourself and your primary tech stacks..." />
                  </Field>

                  {careerError && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-400 text-xs">
                      {careerError}
                    </div>
                  )}

                  {careerSuccess && (
                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/50 text-green-400 text-xs">
                      Application submitted successfully! Our HR team will reach out via email.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={careerSubmitting}
                    className="w-full inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold bg-black text-white border border-[#FF10F0]/50 shadow-neon-pink hover:shadow-neon-pink-glow disabled:opacity-60 disabled:shadow-none transition-all duration-300 [text-shadow:0_0_12px_rgba(255,255,255,0.4)]"
                  >
                    {careerSubmitting ? 'Submitting…' : careerSuccess ? 'Submitted!' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-white/80">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-xs text-red-400 mt-1 block">{error}</span>}
    </label>
  )
}



