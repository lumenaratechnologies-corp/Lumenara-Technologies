import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TermsModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function TermsModal({ open, onClose, title, children }: TermsModalProps) {
  useEffect(() => {
    const body = typeof document !== 'undefined' ? document.body : null
    if (body) {
      if (open) body.style.overflow = 'hidden'
      else body.style.overflow = ''
    }
    return () => {
      if (body) body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl h-[85vh] max-h-[800px] flex flex-col rounded-2xl bg-[#080810] border-2 border-white/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </motion.button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-6 pb-10 text-white/90 text-sm leading-relaxed space-y-4 scroll-smooth">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
