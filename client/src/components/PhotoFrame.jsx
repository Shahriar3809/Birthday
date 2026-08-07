import { useState } from 'react'
import { motion } from 'framer-motion'
import shantaPhoto from '../assets/shanta.jpg'

export default function PhotoFrame({ className = '' }) {
  const [broken, setBroken] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <motion.div
        aria-hidden
        className="absolute -inset-10 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(230,57,80,0.4) 0%, rgba(196,30,58,0.22) 40%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        className="absolute -inset-2 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, #d4af37, #e63950, #c41e3a, #f4c2c2, #d4af37)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        aria-hidden
        className="absolute -inset-2 rounded-full opacity-70"
        style={{ boxShadow: '0 0 0 2px rgba(244,194,194,0.8), 0 0 26px rgba(230,57,80,0.55)' }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 overflow-hidden rounded-full ring-4 ring-rose-300/60">
        {broken ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-800 to-maroon-900">
            <span className="text-5xl" aria-hidden>
              ❤️
            </span>
          </div>
        ) : (
          <img
            src={shantaPhoto}
            alt="Shanta"
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="h-full w-full scale-105 object-cover"
          />
        )}
      </div>
    </motion.div>
  )
}
