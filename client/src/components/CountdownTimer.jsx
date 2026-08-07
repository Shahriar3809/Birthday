import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

function TimeUnit({ value, label }) {
  return (
    <div className="relative flex w-14 flex-col items-center rounded-2xl border border-rose-300/25 bg-maroon-800/55 px-1 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:w-20 sm:py-4">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="font-mono text-2xl font-bold text-blush-100 tabular-nums sm:text-4xl"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="font-bengali mt-1 text-[10px] text-blush-300/75 sm:mt-1.5 sm:text-sm">{label}</span>
    </div>
  )
}

function Colon() {
  return (
    <motion.span
      className="font-mono mb-3 text-xl font-bold text-rose-400 sm:mb-5 sm:text-3xl"
      animate={{ opacity: [1, 0.35, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    >
      :
    </motion.span>
  )
}

export default function CountdownTimer({ target, now }) {
  const ms = Math.max(0, target - now)
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const dateLabel = new Intl.DateTimeFormat('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(target)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <h2 className="font-bengali text-3xl font-bold text-cream/95 sm:text-4xl md:text-5xl">
        তোমার জন্মদিনের অপেক্ষায়...
      </h2>

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

      <div className="relative mt-12 flex items-start justify-center gap-1 sm:gap-2.5">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,30,58,0.32) 0%, transparent 70%)' }}
        />
        <TimeUnit value={days} label="দিন" />
        <Colon />
        <TimeUnit value={hours} label="ঘণ্টা" />
        <Colon />
        <TimeUnit value={minutes} label="মিনিট" />
        <Colon />
        <TimeUnit value={seconds} label="সেকেন্ড" />
      </div>

      <p className="font-bengali mt-8 text-sm text-blush-300/75 sm:text-base">
        ঠিক এই দিনটা — {dateLabel}
      </p>
    </motion.div>
  )
}
