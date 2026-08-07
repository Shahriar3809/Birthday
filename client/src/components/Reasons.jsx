import { useState } from 'react'
import { motion } from 'framer-motion'
import { REASONS } from '../data/reasons.js'
import ReasonCard from './ReasonCard.jsx'
import FloatingParticles from './FloatingParticles.jsx'

const EASE = [0.22, 1, 0.36, 1]

export default function Reasons() {
  const [active, setActive] = useState(null)

  const toggle = (index) => setActive((current) => (current === index ? null : index))

  return (
    <section
      id="reasons"
      className="relative overflow-hidden py-24 text-center sm:py-32"
      style={{ background: 'linear-gradient(180deg, #3f0d0d 0%, #5e1616 50%, #4a0e0e 100%)' }}
    >
      <FloatingParticles count={8} />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display mb-4 text-sm italic text-gold-400/90 sm:text-base"
        >
          and here is why
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-bengali text-3xl font-bold text-cream/95 sm:text-4xl md:text-5xl"
        >
          যে কারণে আমি তোমাকে ভালোবাসি
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
          প্রতিটা কার্ডে ট্যাপ করো —
        </p>

        <motion.div
          className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:mt-20 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {REASONS.map((reason, i) => (
            <ReasonCard
              key={i}
              reason={reason}
              index={i}
              active={active === i}
              onFlip={toggle}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
