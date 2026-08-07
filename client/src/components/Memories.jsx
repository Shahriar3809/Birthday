import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MEMORIES } from '../data/memories.js'
import PhotoCard from './PhotoCard.jsx'
import Lightbox from './Lightbox.jsx'
import FloatingParticles from './FloatingParticles.jsx'

const EASE = [0.22, 1, 0.36, 1]

export default function Memories() {
  const [selected, setSelected] = useState(null)

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

        <p className="font-bengali mt-5 text-sm text-blush-300/75 sm:text-base">
          ছবিতে ট্যাপ করে দেখো —
        </p>

        <div
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-20 md:grid md:grid-cols-3 md:gap-x-10 md:gap-y-16 md:overflow-visible md:pb-0"
        >
          {MEMORIES.map((memory, i) => (
            <div key={i} className="w-[75vw] shrink-0 snap-center sm:w-[60vw] md:w-auto">
              <PhotoCard memory={memory} index={i} onOpen={setSelected} />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <Lightbox memory={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
