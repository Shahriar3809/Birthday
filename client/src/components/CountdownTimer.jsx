import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

function TimeUnit({ value, label, large }) {
  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl border border-rose-300/25 bg-maroon-800/55 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm ${
        large ? 'w-14 px-1 py-4 sm:w-24 sm:py-6 md:w-28' : 'w-14 px-1 py-3 sm:w-20 sm:py-4'
      }`}
    >
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`font-mono font-bold text-blush-100 tabular-nums ${
          large ? 'text-3xl sm:text-5xl md:text-6xl' : 'text-2xl sm:text-4xl'
        }`}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span
        className={`font-bengali mt-1 text-[10px] text-blush-300/75 sm:mt-1.5 ${
          large ? 'sm:text-base' : 'sm:text-sm'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function Colon({ large }) {
  return (
    <motion.span
      className={`font-mono font-bold text-rose-400 ${
        large ? 'mb-4 text-2xl sm:mb-8 sm:text-5xl' : 'mb-3 text-xl sm:mb-5 sm:text-3xl'
      }`}
      animate={{ opacity: [1, 0.35, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    >
      :
    </motion.span>
  )
}

export default function CountdownTimer({ target, now, large = false }) {
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <h2
        className={`font-bengali font-bold text-cream/95 ${
          large ? 'text-3xl sm:text-5xl md:text-6xl' : 'text-3xl sm:text-4xl md:text-5xl'
        }`}
      >
        তোমার একটা স্পেশাল দিনের অপেক্ষায়...
      </h2>

      <div className="mx-auto mt-5 h-[3px] w-56 overflow-hidden rounded-full bg-rose-900/60">
        <motion.div
          className="h-full w-full rounded-full bg-gradient-to-r from-rose-500 via-gold-400 to-rose-400"
          style={{ transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        />
      </div>

      <div
        className={`relative mt-12 flex items-start justify-center ${
          large ? 'gap-1.5 sm:gap-3' : 'gap-1 sm:gap-2.5'
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,30,58,0.32) 0%, transparent 70%)' }}
        />
        <TimeUnit value={days} label="দিন" large={large} />
        <Colon large={large} />
        <TimeUnit value={hours} label="ঘণ্টা" large={large} />
        <Colon large={large} />
        <TimeUnit value={minutes} label="মিনিট" large={large} />
        <Colon large={large} />
        <TimeUnit value={seconds} label="সেকেন্ড" large={large} />
      </div>

      <p className={`font-bengali mt-8 text-blush-300/75 ${large ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
        ঠিক এই দিনটা — {dateLabel}
      </p>
    </motion.div>
  )
}
