import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import confetti from 'canvas-confetti'
import WordReveal from './WordReveal.jsx'
import Balloons from './Balloons.jsx'

const PALETTE = ['#c41e3a', '#e63950', '#d4af37', '#f4c2c2', '#fff5f0', '#e84a5f']
const EASE = [0.22, 1, 0.36, 1]

const HEADING = [
  { text: 'আজকে', className: 'text-cream/95' },
  { text: 'তোমার', className: 'text-cream/95' },
  { text: 'জন্মদিন!', className: 'font-display italic text-rose-400' },
  { text: '🎉', className: '' },
]

export default function Celebration() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 })

  useEffect(() => {
    if (!inView) return
    const fire = (opts) => confetti({ ...opts, colors: PALETTE, zIndex: 60 })
    fire({ particleCount: 110, spread: 100, startVelocity: 48, origin: { x: 0.5, y: 0.4 } })
    const id = setInterval(() => {
      fire({
        particleCount: 40,
        spread: 85,
        startVelocity: 32,
        origin: { x: 0.1 + Math.random() * 0.8, y: 0.3 },
      })
    }, 3500)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} className="relative">
      <Balloons count={12} />

      <WordReveal
        words={HEADING}
        className="text-4xl font-bold sm:text-5xl md:text-6xl"
        stagger={0.14}
      />

      <div className="mx-auto mt-6 h-[3px] w-56 overflow-hidden rounded-full bg-rose-900/60">
        <motion.div
          className="h-full w-full rounded-full bg-gradient-to-r from-rose-500 via-gold-400 to-rose-400"
          style={{ transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
        className="font-display mt-8 text-xl italic text-blush-100 sm:text-2xl"
      >
        শুভ জন্মদিন, শান্তা ❤️
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 1.3 }}
        className="font-bengali mx-auto mt-4 max-w-md text-base text-blush-200/80 sm:text-lg"
      >
        আজ এই দিনে আমার চাওয়ার তালিকায় শুধু একটা জিনিস-ই আছে— তুমি ভালো থাকো। অনেক বেশি ভালো থাকো। তোমার জীবনে যতটুকু সুখ প্রাপ্য, তার চেয়েও বেশি সুখ যেন তোমার হয়। 
      </motion.p>
    </div>
  )
}
