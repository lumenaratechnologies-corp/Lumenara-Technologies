import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import axios from 'axios'
import { FaEye, FaEyeSlash, FaSpinner, FaUserPlus, FaSignInAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { revealParent, revealUp, scaleIn } from '../utils/animation'
import { resolveProfileImage } from '../utils/profileImage'
import logo from '../assets/logo.png'

type AuthUser = {
  name: string
  email: string
  picture?: string
  profilePic?: string
}

type AuthDialogProps = {
  open: boolean
  onClose: () => void
  onAuthenticated: (user: AuthUser) => void
}

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:5000'

export default function AuthDialog({ open, onClose, onAuthenticated }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Reset fields on close
  useEffect(() => {
    if (!open) {
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setErrorMsg(null)
      setSuccessMsg(null)
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [open])

  if (!open) return null

  const handleClose = () => {
    onClose()
  }

  // Basic Form Submission Handler (Sign In & Sign Up Simulation)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedName = name.trim()

    // 1. Validations
    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    if (trimmedPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }

    if (activeTab === 'signup') {
      if (!trimmedName) {
        setErrorMsg('Please enter your full name.')
        return
      }
      if (trimmedPassword !== confirmPassword.trim()) {
        setErrorMsg('Passwords do not match.')
        return
      }
    }

    setSubmitting(true)

    try {
      // Simulate backend delays
      await new Promise((resolve) => setTimeout(resolve, 1200))

      if (activeTab === 'signup') {
        // Save simulated user details to localStorage
        const accounts = JSON.parse(localStorage.getItem('mock_accounts') || '[]') as Array<{ name: string; email: string }>
        
        if (accounts.some(acc => acc.email.toLowerCase() === trimmedEmail.toLowerCase())) {
          setErrorMsg('An account with this email already exists.')
          setSubmitting(false)
          return
        }

        accounts.push({ name: trimmedName, email: trimmedEmail })
        localStorage.setItem('mock_accounts', JSON.stringify(accounts))

        setSuccessMsg('Account created successfully! Switching to sign in...')
        setName('')
        setPassword('')
        setConfirmPassword('')
        
        // Auto transition to Sign In tab
        setTimeout(() => {
          setActiveTab('signin')
          setSuccessMsg(null)
        }, 1500)
      } else {
        // Sign In Flow Simulation
        const user: AuthUser = {
          name: trimmedEmail.split('@')[0],
          email: trimmedEmail,
        }
        onAuthenticated(user)
        handleClose()
      }
    } catch (err) {
      console.error('Authentication error', err)
      setErrorMsg('Authentication failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Google Login Handler
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setErrorMsg(null)
    setGoogleBusy(true)

    // Decode basic user info from Google Token
    const fallbackUserFromToken = (() => {
      try {
        if (!credentialResponse.credential) return null
        const [, payloadB64] = credentialResponse.credential.split('.')
        if (!payloadB64) return null

        const normalized = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
        const decodedJson = JSON.parse(atob(padded))

        const emailFromToken = decodedJson.email as string | undefined
        const nameFromToken =
          (decodedJson.name as string | undefined) ||
          (decodedJson.given_name as string | undefined) ||
          (emailFromToken ? emailFromToken.split('@')[0] : undefined) ||
          'Google User'

        const userFromToken: AuthUser = {
          name: nameFromToken,
          email: emailFromToken || 'unknown@google-user',
          picture: decodedJson.picture as string | undefined,
        }

        return userFromToken
      } catch (decodeErr) {
        console.warn('Failed to decode Google token payload', decodeErr)
        return null
      }
    })()

    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google.')
      }

      const res = await axios.post(`${API_BASE}/api/auth/google`, {
        token: credentialResponse.credential,
      })

      const payload = (res.data as any)?.data ?? res.data
      const { token, user: backendUser } = payload as {
        token?: string
        user?: AuthUser
      }

      if (token && typeof token === 'string') {
        localStorage.setItem('token', token)
      }

      let finalUser: AuthUser | null = null

      if (backendUser && backendUser.email) {
        const mergedUser: AuthUser = {
          ...backendUser,
          picture: backendUser.picture || backendUser.profilePic || fallbackUserFromToken?.picture,
          profilePic: backendUser.profilePic || backendUser.picture || fallbackUserFromToken?.picture,
        }

        finalUser = {
          ...mergedUser,
          picture: resolveProfileImage(mergedUser),
          profilePic: resolveProfileImage(mergedUser),
        }
      } else {
        finalUser = fallbackUserFromToken
      }

      if (!finalUser) {
        throw new Error('Unable to derive user information from login response.')
      }

      onAuthenticated(finalUser)
      handleClose()
    } catch (err: unknown) {
      console.error('Google login error', err)

      // Fallback if backend is unreachable but token is valid
      if (axios.isAxiosError(err) && !err.response && fallbackUserFromToken) {
        console.warn('Backend unreachable, logging in using Google token.')
        onAuthenticated(fallbackUserFromToken)
        handleClose()
      } else {
        let friendly = 'Google login failed. Please try again.'
        if (axios.isAxiosError(err)) {
          const backendMessage =
            (err.response?.data as any)?.message ||
            (err.response?.data as any)?.error ||
            (err.response?.data as any)?.detail
          if (typeof backendMessage === 'string' && backendMessage.trim()) {
            friendly = backendMessage
          }
        }
        setErrorMsg(friendly)
      }
    } finally {
      setGoogleBusy(false)
    }
  }

  const handleGoogleError = () => {
    setGoogleBusy(false)
    setErrorMsg('Google login was cancelled or failed.')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-8"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Ring Wrapper */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#FF10F0] via-[#7C4DFF] to-[#00E5FF] opacity-35 blur-md" />
        
        <motion.div
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={revealParent}
          className="relative rounded-2xl border border-white/10 bg-[#0a0a0f] p-6 sm:p-8 shadow-2xl flex flex-col items-center"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-4 top-4 h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm leading-none"
          >
            ×
          </button>

          {/* Brand logo header */}
          <div className="flex flex-col items-center mb-6 text-center select-none">
            <img src={logo} alt="Lumenara logo" className="h-10 w-auto mb-2" />
            <h1 className="text-sm font-semibold tracking-widest uppercase text-white/40">Lumenara Portal</h1>
            <p className="text-[11px] text-white/60 mt-0.5">Access developer briefs, estimates and quote logs</p>
          </div>

          {/* Auth Tabbing Switcher */}
          <div className="flex w-full bg-black/40 border border-white/10 rounded-xl p-1 mb-5 select-none text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin')
                setErrorMsg(null)
              }}
              className={`flex-1 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-[#FF10F0]/10 to-[#00E5FF]/10 text-white border border-white/10 shadow-glow'
                  : 'text-white/55 hover:text-white border border-transparent'
              }`}
            >
              <FaSignInAlt size={12} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup')
                setErrorMsg(null)
              }}
              className={`flex-1 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-[#FF10F0]/10 to-[#00E5FF]/10 text-white border border-white/10 shadow-glow'
                  : 'text-white/55 hover:text-white border border-transparent'
              }`}
            >
              <FaUserPlus size={12} /> Create Account
            </button>
          </div>

          {/* Form */}
          <motion.form
            variants={scaleIn}
            className="w-full space-y-4 text-left"
            onSubmit={handleFormSubmit}
          >
            {activeTab === 'signup' && (
              <div>
                <label className="mb-1 block text-xs text-white/80 font-medium uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  maxLength={100}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#00E5FF]/60 focus:ring-1 focus:ring-[#00E5FF]/30"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs text-white/80 font-medium uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
                maxLength={254}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#00E5FF]/60 focus:ring-1 focus:ring-[#00E5FF]/30"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-xs text-white/80 font-medium uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    maxLength={128}
                    className="w-full rounded-xl border border-white/10 bg-black/40 pl-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#00E5FF]/60 focus:ring-1 focus:ring-[#00E5FF]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              {activeTab === 'signup' && (
                <div>
                  <label className="mb-1 block text-xs text-white/80 font-medium uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      maxLength={128}
                      className="w-full rounded-xl border border-white/10 bg-black/40 pl-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-[#00E5FF]/60 focus:ring-1 focus:ring-[#00E5FF]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-white/40 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Success Banner */}
            {successMsg && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/40 text-green-400 text-xs flex items-center gap-2">
                <FaCheckCircle size={14} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                <FaExclamationCircle size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 mt-2 rounded-xl font-semibold bg-black text-white border border-[#FF10F0]/50 shadow-neon-pink hover:shadow-neon-pink-glow hover:border-[#FF10F0]/80 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{activeTab === 'signin' ? 'Sign In' : 'Register Account'}</span>
              )}
            </button>

            {/* Alternative separator */}
            <div className="flex items-center gap-3 text-xs text-white/30 py-2">
              <div className="h-px flex-1 bg-white/10" />
              <span>Or connect with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google OAuth Login Container */}
            <div className="flex justify-center select-none opacity-95 hover:opacity-100 transition-opacity">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="350"
                useOneTap={false}
              />
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
