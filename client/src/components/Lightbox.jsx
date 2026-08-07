import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Lightbox({ memory, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={memory.caption}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-950/85 p-5 backdrop-blur-md sm:p-8"
    >
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white/90 backdrop-blur transition-colors hover:bg-white/25"
      >
        ×
      </motion.button>

      <motion.figure
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 14, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="flex max-h-[90vh] max-w-3xl flex-col items-center"
      >
        <img
          src={memory.src}
          alt={memory.caption}
          className="max-h-[76vh] w-auto max-w-full rounded-2xl object-contain shadow-[0_25px_80px_rgba(0,0,0,0.6)] ring-1 ring-rose-300/30"
        />
        <figcaption className="font-bengali mt-5 text-lg text-cream/95 sm:text-xl">
          {memory.caption}
        </figcaption>
      </motion.figure>
    </motion.div>
  )
}
