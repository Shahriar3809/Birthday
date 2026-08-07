import { useState } from 'react'
import { motion } from 'framer-motion'

const TILTS = [-1.5, 1, -0.75, 1.5, -1, 1.25, -1.25, 0.75, -1]

export default function PhotoCard({ memory, index, onOpen }) {
  const [broken, setBroken] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(memory)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.09 }}
      whileHover={{
        y: -8,
        rotate: 0,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 260, damping: 20 },
      }}
      whileTap={{ scale: 0.96 }}
      className={`group cursor-pointer text-left ${
        index % 3 === 1 ? 'md:translate-y-10' : index % 3 === 2 ? 'md:translate-y-5' : ''
      }`}
      style={{ rotate: TILTS[index % TILTS.length] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-maroon-800/50 shadow-md ring-1 ring-rose-300/25 transition-shadow duration-500 group-hover:shadow-[0_20px_50px_rgba(196,30,58,0.4)]">
        {broken ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-rose-800 to-maroon-900">
            <span className="text-4xl" aria-hidden>
              ❤️
            </span>
            <span className="font-bengali px-4 text-xs text-blush-200/80">{memory.caption}</span>
          </div>
        ) : (
          <motion.img
            src={memory.src}
            alt={memory.caption}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <p className="font-bengali text-sm text-blush-200/90 sm:text-base">{memory.caption}</p>
        <span className="text-gold-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">✦</span>
      </div>
    </motion.button>
  )
}
