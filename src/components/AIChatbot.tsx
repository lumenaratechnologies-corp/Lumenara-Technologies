import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCog, FaArrowLeft, FaPaperPlane, FaRobot, FaLock, FaTimes, FaGlobe, FaChevronRight } from 'react-icons/fa'
import logo from '../assets/logo.png'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

// Highly comprehensive offline response system
const OFFLINE_KNOWLEDGE: Record<string, string> = {
  greeting: "Hello there! 👋 Welcome to Lumenara Technologies. I am your assistant. How can I help you today?\n\nYou can ask me about our **Services**, **Pricing**, **Careers**, or **how to contact us**.",
  thanks: "You are very welcome! Let me know if there's anything else about Lumenara Technologies you'd like to explore.",
  bye: "Goodbye! 👋 Thanks for visiting. Feel free to open this chat anytime if you have more questions.",
  
  services: [
    "At **Lumenara Technologies**, we build high-performance products across multiple domains:",
    "- **Website Development**: High-speed landing pages, NextJS/React web apps, custom dashboards, SEO optimization, and design systems.",
    "- **Mobile App Development**: Offline-first, secure iOS and Android apps built with Flutter and React Native.",
    "- **IoT Solutions**: Device firmware, cloud gateways, MQTT messaging protocols, and real-time SCADA/telemetry dashboards.",
    "- **Digital Content**: 3D explainer videos, brand identity kits, motion graphics, and marketing assets.",
    "- **Digital Marketing**: Result-oriented SEO, paid social media campaigns, conversion rate optimization, and automated pipelines.",
    "- **Technical Assistance**: DevOps engineering, cloud migrations (AWS/GCP), and on-demand staff augmentation.",
    "\nWould you like a price estimate for any of these?"
  ].join('\n'),

  pricing: [
    "We offer three flexible pricing and engagement models:",
    "1. **Fixed Scope**: Great for well-defined projects with set deliverables, timelines, and budgets.",
    "2. **Time & Materials**: Flexible sprint-based model with transparent time tracking and reporting.",
    "3. **Dedicated Team**: A specialized full-time squad (developers, designers, QA) aligned to your roadmap.",
    "\n💡 Check out our interactive **Project Cost Calculator** in the **Pricing** section on the main page to build a customized estimate and generate a proposal!",
  ].join('\n'),

  contact: [
    "You can get in touch with our team through the following channels:",
    "- **Email**: Send your requirements directly to **lumenaratechnologies@gmail.com**.",
    "- **Location**: Chennai, Tamil Nadu, India.",
    "- **Online Form**: Scroll down to the bottom of this page and fill out our contact form.",
    "- **Socials**: We are active on LinkedIn, Twitter, Instagram, and Facebook.",
    "\nIf you fill out our contact form, we typically get back to you within 24 hours."
  ].join('\n'),

  careers: [
    "🚀 **Careers at Lumenara Technologies**",
    "We are always looking for talented minds to join us! We currently have open roles for:",
    "- **Frontend React / NextJS Engineer** (1-3 yrs experience)",
    "- **React Native Developer** (2+ yrs experience)",
    "- **UI/UX Designer** (Figma-focused)",
    "\n**How to Apply**:",
    "Please send your resume, portfolio links, and a brief intro to **lumenaratechnologies@gmail.com** with the subject line `Job Application - [Your Position]`. We'd love to chat!"
  ].join('\n'),

  who: [
    "**Lumenara Technologies** is a modern software development and design agency based in Chennai, India.",
    "We blend premium design aesthetics (neon branding, glassmorphic interfaces) with solid engineering practices to build scalable products for startups and enterprises.",
    "\nOur process covers discovery, UI/UX design, modular build, hardened launch, and analytics-driven growth."
  ].join('\n'),

  default: "I'm not fully sure how to answer that. Could you try asking about our **services**, **pricing models**, **careers**, or **contact details**? \n\n*Tip: You can also click the gear icon at the top to plug in a Gemini API key and activate full conversational AI!*"
}

// Local router for smart offline replies
function getSmartOfflineReply(input: string): string {
  const clean = input.toLowerCase().trim()

  if (/^(hi|hello|hey|hiya|greetings|yo|sup|good morning|good afternoon|good evening)\b/i.test(clean) || clean === 'hi' || clean === 'hello' || clean === 'hey') {
    return OFFLINE_KNOWLEDGE.greeting
  }
  if (/\b(thanks|thank you|thx|ty|appreciate)\b/i.test(clean)) {
    return OFFLINE_KNOWLEDGE.thanks
  }
  if (/\b(bye|goodbye|see you|exit|close)\b/i.test(clean)) {
    return OFFLINE_KNOWLEDGE.bye
  }
  if (/\b(service|what do you|provide|offer|build|develop|website|mobile|app|iot|sensor|firmware|marketing|devops|cloud)\b/i.test(clean)) {
    return OFFLINE_KNOWLEDGE.services
  }
  if (/\b(pricing|price|cost|how much|budget|charge|fee|model|fixed|materials|dedicated)\b/i.test(clean)) {
    return OFFLINE_KNOWLEDGE.pricing
  }
  if (/\b(contact|reach|email|address|location|phone|call|talk|speak|meet|office|chennai)\b/i.test(clean)) {
    return OFFLINE_KNOWLEDGE.contact
  }
  if (/\b(career|job|hiring|work|apply|position|openings|developer|designer|resume)\b/i.test(clean)) {
    return OFFLINE_KNOWLEDGE.careers
  }
  if (/\b(who|about|company|lumenara|agency|team|founder)\b/i.test(clean)) {
    return OFFLINE_KNOWLEDGE.who
  }

  return OFFLINE_KNOWLEDGE.default
}

// Basic markdown formatter to render styled lists, bolding, and inline code in React
function formatMessageContent(content: string) {
  const lines = content.split('\n')
  let insideCodeBlock = false
  let codeBlockLines: string[] = []

  return lines.map((line, idx) => {
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (insideCodeBlock) {
        insideCodeBlock = false
        const codeText = codeBlockLines.join('\n')
        codeBlockLines = []
        return (
          <pre key={`code-${idx}`} className="my-3 overflow-x-auto rounded-lg bg-black/60 p-3 text-xs font-mono text-neon-blue border border-white/10 select-all">
            <code>{codeText}</code>
          </pre>
        )
      } else {
        insideCodeBlock = true
        return null
      }
    }

    if (insideCodeBlock) {
      codeBlockLines.push(line)
      return null
    }

    // Process lists and bold text
    let text = line.trim()
    const isBullet = text.startsWith('- ') || text.startsWith('* ')
    const isNumbered = /^\d+\.\s/.test(text)

    if (isBullet) {
      text = text.replace(/^[\-\*]\s+/, '')
    } else if (isNumbered) {
      text = text.replace(/^\d+\.\s+/, '')
    }

    // Parse inline bolding (**text**) and inline code (`code`)
    const regex = /(\*\*.*?\*\*|`.*?`)/g
    const tokens = text.split(regex)
    const formattedText = tokens.map((token, tIdx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={tIdx} className="font-bold text-white [text-shadow:0_0_8px_rgba(255,255,255,0.2)]">{token.slice(2, -2)}</strong>
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={tIdx} className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs text-[#00E5FF] border border-white/5">
            {token.slice(1, -1)}
          </code>
        )
      }
      return token
    })

    if (isBullet) {
      return (
        <ul key={idx} className="list-disc pl-5 my-1 text-sm text-white/90">
          <li className="leading-relaxed">{formattedText}</li>
        </ul>
      )
    }

    if (isNumbered) {
      const match = line.trim().match(/^(\d+)\.\s+/)
      const num = match ? match[1] : '1'
      return (
        <ol key={idx} className="list-decimal pl-5 my-1 text-sm text-white/90" start={parseInt(num)}>
          <li className="leading-relaxed">{formattedText}</li>
        </ol>
      )
    }

    return text === '' ? (
      <div key={idx} className="h-2" />
    ) : (
      <p key={idx} className="text-sm leading-relaxed text-white/90">
        {formattedText}
      </p>
    )
  }).filter((el) => el !== null)
}

const WELCOME_MESSAGE = [
  "Hi! I'm **Lumenara AI**.",
  "I can guide you through our services, pricing estimates, job applications, or project setup details.",
  "\n*Tip: Connect your own Gemini API key using the gear settings above to unlock general conversation!*"
].join('\n')

const QUICK_CHIPS = [
  { label: '💼 Services', text: 'What services do you offer?' },
  { label: '💰 Pricing Models', text: 'How do you structure project pricing?' },
  { label: '🚀 Careers', text: 'Are there any job openings or careers?' },
  { label: '📞 Contact', text: 'How can I get in touch with you?' }
]

function isValidGeminiKey(key: string): boolean {
  const k = key.trim()
  return k.length > 0 && k.startsWith('AIzaSy') && !k.toLowerCase().includes('placeholder') && !k.toLowerCase().includes('your')
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MESSAGE }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [savedKey, setSavedKey] = useState('')
  const [apiError, setApiError] = useState('')
  
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load API key from localStorage
  useEffect(() => {
    const localKey = localStorage.getItem('gemini_api_key')
    const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim()
    const key = localKey || envKey || ''
    if (isValidGeminiKey(key)) {
      setSavedKey(key)
      setApiKey(key)
    } else {
      setSavedKey('')
      setApiKey('')
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, showSettings])

  useEffect(() => {
    if (open && !showSettings) {
      inputRef.current?.focus()
    }
  }, [open, showSettings])

  const handleSaveKey = () => {
    const cleanKey = apiKey.trim()
    if (!cleanKey) {
      setApiError('Key cannot be empty')
      return
    }
    if (!cleanKey.startsWith('AIzaSy')) {
      setApiError('Invalid key format. Gemini keys typically start with "AIzaSy".')
      return
    }
    localStorage.setItem('gemini_api_key', cleanKey)
    setSavedKey(cleanKey)
    setApiError('')
    setShowSettings(false)
    
    // Add success message
    setMessages((m) => [
      ...m,
      { role: 'assistant', content: '❇️ **Gemini API Mode Activated!** I am now powered by Google Gemini. Ask me anything!' }
    ])
  }

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key')
    setSavedKey('')
    setApiKey('')
    setApiError('')
    setShowSettings(false)
    setMessages((m) => [
      ...m,
      { role: 'assistant', content: '🔄 **Smart Local Mode Re-activated.** Your API key has been cleared from local storage.' }
    ])
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text) return

    setMessages((m) => [...m, { role: 'user', content: text }])
    if (!textToSend) setInput('')
    setTyping(true)

    // Mode check
    if (savedKey && isValidGeminiKey(savedKey)) {
      try {
        // Send using Gemini API
        const systemPrompt = "You are Lumenara AI, the official virtual assistant for Lumenara Technologies (https://www.lumenara.co.in). You are highly professional, polite, and technical. Lumenara builds websites, mobile apps, and IoT devices. Highlight this context in your replies. Keep responses concise, clean, structured, and output them in standard markdown with lists or bold text where appropriate. For pricing queries, suggest checking the Cost Calculator. Direct contacts to lumenaratechnologies@gmail.com."
        
        // Map messages history to Gemini format (user/model)
        // Only map the last 8 messages to avoid hitting limits
        const historyContext = messages.slice(-8).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))

        // Push current message
        historyContext.push({
          role: 'user',
          parts: [{ text: text }]
        })

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${savedKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: historyContext,
              systemInstruction: {
                parts: [{ text: systemPrompt }]
              }
            })
          }
        )

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData?.error?.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't receive a response from Gemini. Please double-check your API key."
        
        setMessages((m) => [...m, { role: 'assistant', content: reply }])
      } catch (err: any) {
        console.error('Gemini API Error:', err)
        setMessages((m) => [
          ...m,
          { 
            role: 'assistant', 
            content: `❌ **API Error:** ${err.message || 'Unable to connect'}. Falling back to smart offline mode.\n\n*Smart response:* ${getSmartOfflineReply(text)}` 
          }
        ])
      } finally {
        setTyping(false)
      }
    } else {
      // Simulate typing delay for Smart Offline mode
      setTimeout(() => {
        const reply = getSmartOfflineReply(text)
        setMessages((m) => [...m, { role: 'assistant', content: reply }])
        setTyping(false)
      }, 700)
    }
  }

  return (
    <>
      {/* Rainbow Glow & Animations style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rainbow-glow {
          0%, 100% { border-color: rgba(255, 16, 240, 0.6); box-shadow: 0 0 15px rgba(255, 16, 240, 0.4); }
          50% { border-color: rgba(0, 229, 255, 0.6); box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); }
        }
        .gemini-glow-border {
          animation: rainbow-glow 3s ease-in-out infinite;
          border-width: 2px !important;
        }
        .gemini-text-shimmer {
          background: linear-gradient(to right, #FF10F0 20%, #00E5FF 40%, #7C4DFF 60%, #FF10F0 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}} />

      {/* Chat Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 overflow-hidden ${
          savedKey 
            ? 'bg-gradient-to-r from-[#FF10F0] via-[#7C4DFF] to-[#00E5FF] shadow-glow-strong animate-pulse-slow' 
            : 'bg-gradient-to-r from-[#FF10F0] to-[#00E5FF] shadow-neon-pink hover:shadow-neon-pink-glow'
        }`}
        aria-label="Open Lumenara AI Assistant"
      >
        {savedKey ? (
          <FaRobot className="h-6 w-6 animate-bounce" style={{ animationDuration: '3s' }} />
        ) : (
          <img src={logo} alt="Lumenara" className="h-10 w-10 object-contain p-1" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-end p-4 pb-20 bg-black/40 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className={`flex h-[450px] max-h-[calc(100vh-120px)] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f15] shadow-2xl relative mb-2 mr-2 ${
                savedKey ? 'gemini-glow-border' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#07070a] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img src={logo} alt="Lumenara" className="h-8 w-8 object-contain" />
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black ${
                      savedKey ? 'bg-green-400 animate-pulse' : 'bg-neon-pink'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-1.5">
                      Lumenara AI 
                      {savedKey && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-[#FF10F0] to-[#00E5FF] text-black">
                          Gemini
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      {savedKey ? (
                        <>
                          <FaGlobe className="text-neon-cyan text-[10px]" /> Live LLM connected
                        </>
                      ) : (
                        'Smart Local Mode'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setShowSettings(true)
                      setApiError('')
                    }}
                    className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Settings"
                    title="Configure AI API"
                  >
                    <FaCog className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Viewport Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                
                {/* Messages Box */}
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.role === 'assistant' && (
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center border text-xs shrink-0 ${
                            savedKey ? 'border-neon-cyan/50 bg-[#00E5FF]/10 text-neon-cyan' : 'border-neon-pink/50 bg-[#FF10F0]/10 text-neon-pink'
                          }`}>
                            <FaRobot size={12} />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2.5 space-y-1.5 border ${
                            msg.role === 'user'
                              ? 'bg-[#181824] text-white border-white/10 rounded-tr-none'
                              : 'bg-[#0b0b0f] text-white/95 border-white/5 rounded-tl-none'
                          }`}
                        >
                          {formatMessageContent(msg.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {typing && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[85%] items-center">
                        <div className="h-7 w-7 rounded-full border border-neon-cyan/50 bg-[#00E5FF]/10 text-neon-cyan flex items-center justify-center shrink-0">
                          <FaRobot size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <div className="rounded-2xl bg-[#0b0b0f] border border-white/5 px-4 py-3 rounded-tl-none">
                          <span className="flex gap-1.5 items-center">
                            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 rounded-full bg-[#FF10F0] animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>

              {/* Suggestions Chips & Input Bar */}
              <div className="border-t border-white/10 bg-[#07070a] p-3 space-y-2.5">
                
                {/* Suggestions List */}
                {!showSettings && messages.length <= 2 && (
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
                    {QUICK_CHIPS.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleSendMessage(chip.text)}
                        className="shrink-0 px-3 py-1.5 rounded-full border border-white/5 bg-[#121218] hover:border-neon-cyan/30 hover:bg-[#151522] text-xs text-white/80 hover:text-white transition-all flex items-center gap-1"
                      >
                        {chip.label} <FaChevronRight size={8} className="text-white/30" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Controls */}
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    disabled={showSettings}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={showSettings ? "Configure settings..." : "Ask Lumenara AI..."}
                    className="flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 disabled:opacity-40"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={showSettings || !input.trim()}
                    className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-neon-cyan hover:border-neon-cyan/40 disabled:opacity-30 disabled:hover:text-white/60 disabled:hover:border-white/10 transition-colors"
                    aria-label="Send"
                  >
                    <FaPaperPlane size={14} />
                  </button>
                </div>
              </div>

              {/* Sliding Settings Overlay (Full-screen overlay covering the entire chatbot box) */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="absolute inset-0 bg-[#0f0f15] z-50 p-5 flex flex-col justify-between rounded-2xl border border-white/5"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <button
                          onClick={() => setShowSettings(false)}
                          className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors"
                        >
                          <FaArrowLeft size={12} />
                        </button>
                        <h4 className="font-bold text-white text-base">AI Model Settings</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                          <h5 className="text-sm font-semibold text-white flex items-center gap-1.5 mb-1.5 text-glow-blue">
                            <FaLock className="text-neon-cyan" /> Secure Direct Connection
                          </h5>
                          <p className="text-xs text-white/60 leading-relaxed">
                            Save your **Google Gemini API Key** to connect the chatbot directly to Gemini models. Your key is stored purely on your local browser's `localStorage` and sent directly to Google's endpoints.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white/70 block">
                            Gemini API Key
                          </label>
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30"
                          />
                          {apiError && (
                            <p className="text-[11px] text-red-400 font-medium">{apiError}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={handleSaveKey}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FF10F0] to-[#00E5FF] text-black font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                      >
                        Activate Gemini Mode
                      </button>
                      {savedKey && (
                        <button
                          onClick={handleClearKey}
                          className="w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 active:scale-95 transition-all"
                        >
                          Clear Key & Disconnect
                        </button>
                      )}
                      <button
                        onClick={() => setShowSettings(false)}
                        className="w-full py-2 rounded-lg text-white/40 hover:text-white text-xs font-medium transition-colors"
                      >
                        Back to Chat
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
