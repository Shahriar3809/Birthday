import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import GiftBox from './GiftBox.jsx'
import FloatingParticles from './FloatingParticles.jsx'
import useTypewriter from '../hooks/useTypewriter.js'

const HEADLINE = 'আজকে একটা স্পেশাল দিন... 🎁'

const PALETTE = ['#c41e3a', '#e63950', '#d4af37', '#f4c2c2', '#fff5f0', '#e84a5f']

export default function Hero() {
  const [status, setStatus] = useState('closed')
  const { text, done } = useTypewriter(HEADLINE)
  const opened = status !== 'closed'
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const fireConfetti = () => {
    const burst = {
      particleCount: 90,
      spread: 75,
      startVelocity: 42,
      ticks: 220,
      gravity: 0.85,
      colors: PALETTE,
      scalar: 1.05,
      origin: { x: 0.5, y: 0.52 },
      zIndex: 60,
    }
    confetti({ ...burst, angle: 60 })
    confetti({ ...burst, angle: 120 })
    timers.current.push(
      setTimeout(
        () =>
          confetti({
            particleCount: 60,
            spread: 100,
            startVelocity: 30,
            ticks: 260,
            gravity: 0.7,
            colors: PALETTE,
            origin: { x: 0.5, y: 0.42 },
            zIndex: 60,
          }),
        380
      )
    )
  }

  const handleOpen = () => {
    if (opened) return
    setStatus('opening')
    timers.current.push(setTimeout(fireConfetti, 480))
    timers.current.push(
      setTimeout(() => {
        setStatus('opened')
        document.getElementById('birthday-message')?.scrollIntoView({ behavior: 'smooth' })
      }, 1500)
    )
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          'linear-gradient(180deg, #3f0d0d 0%, #4a0e0e 45%, #7a1f1f 100%)',
      }}
    >
      <div
        aria-hidden
        className="absolute -top-24 -right-20 h-72 w-72 rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle at 35% 35%, rgba(212,175,55,0.28) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 -left-24 h-80 w-80 rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle at 60% 40%, rgba(196,30,58,0.3) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(230,57,80,0.28) 0%, transparent 65%)' }}
      />

      <FloatingParticles count={18} />

      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          className="min-h-[2.5em] font-bengali text-[1.6rem] leading-snug font-medium text-cream/95 sm:text-4xl"
        >
          {text}
          <motion.span
            className="ml-1 inline-block text-rose-400"
            animate={done ? { opacity: 0 } : { opacity: [1, 0, 1] }}
            transition={done ? { duration: 0.5 } : { duration: 1, repeat: Infinity }}
          >
            |
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-display mt-3 text-sm italic text-gold-400/90 sm:text-base"
        >
          A little magic, made just for you
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="my-6"
        >
          <GiftBox opened={opened} className="h-56 w-56 drop-shadow-[0_18px_30px_rgba(196,30,58,0.35)] sm:h-72 sm:w-72 md:h-80 md:w-80" />
        </motion.div>

        <motion.button
          type="button"
          onClick={handleOpen}
          initial={{ opacity: 0, y: 16 }}
          animate={opened ? { opacity: 0, y: -12, pointerEvents: 'none' } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: opened ? 0 : 1.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="group relative overflow-hidden rounded-full bg-gradient-to-br from-rose-500 via-rose-500 to-rose-700 px-10 py-4 font-bengali text-xl font-semibold text-cream shadow-[0_16px_40px_rgba(196,30,58,0.45)] sm:text-2xl"
        >
          খুলে দেখো
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 0.6 : 0 }}
          transition={{ duration: 1, delay: done ? 0.4 : 0 }}
          className="font-bengali mt-5 text-xs text-blush-300/70 sm:text-sm"
        >
          চাপলেই খুলবে...
        </motion.p>
      </div>
    </section>
  )
}
