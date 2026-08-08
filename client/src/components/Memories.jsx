import { motion } from 'framer-motion'
import { FEATURED_MEMORY } from '../data/memories.js'
import FloatingParticles from './FloatingParticles.jsx'

const EASE = [0.22, 1, 0.36, 1]

export default function Memories() {
  return (
    <section
      id="memories"
      className="relative overflow-hidden py-24 text-center sm:py-32"
      style={{ background: 'linear-gradient(180deg, #4a0e0e 0%, #571414 45%, #3f0d0d 100%)' }}
    >
      <FloatingParticles count={10} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display mb-4 text-sm italic text-gold-400/90 sm:text-base"
        >
          little moments, big love
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-bengali text-3xl font-bold text-cream/95 sm:text-4xl md:text-5xl"
        >
          আমাদের কিছু মুহূর্ত
        </motion.h2>

        <div className="mx-auto mt-5 h-[3px] w-56 overflow-hidden rounded-full bg-rose-900/60">
          <motion.div
            className="h-full w-full rounded-full bg-gradient-to-r from-rose-500 via-gold-400 to-rose-400"
            style={{ transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          />
        </div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mx-auto mt-12 w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          <motion.div
            aria-hidden
            className="absolute -inset-10 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(196,30,58,0.4) 0%, rgba(212,175,55,0.15) 55%, transparent 75%)' }}
            animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10 rounded-[2rem] bg-gradient-to-br from-gold-400/70 via-rose-400/50 to-gold-400/70 p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="overflow-hidden rounded-[1.65rem] ring-4 ring-maroon-900/90">
              <img
                src={FEATURED_MEMORY.src}
                alt={FEATURED_MEMORY.caption}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>

          <figcaption className="relative z-10 mt-5 font-bengali text-base text-blush-200/85 sm:text-lg">
            {FEATURED_MEMORY.caption}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
