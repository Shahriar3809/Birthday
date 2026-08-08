import { motion } from 'framer-motion'

const CARD_STYLES = [
  { front: 'from-rose-600 to-rose-800', icon: 'text-blush-200' },
  { front: 'from-maroon-700 to-maroon-900', icon: 'text-gold-400' },
  { front: 'from-rose-700 to-maroon-900', icon: 'text-blush-300' },
  { front: 'from-rose-500 to-rose-700', icon: 'text-cream' },
]

export default function ReasonCard({ reason, index, active, onFlip }) {
  const style = CARD_STYLES[index % CARD_STYLES.length]
  const number = String(index + 1).padStart(2, '0')

  return (
    <motion.button
      type="button"
      onClick={() => onFlip(index)}
      variants={{
        hidden: { opacity: 0, scale: 0.7, y: 24 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 260, damping: 18 },
        },
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.95 }}
      className="group w-full cursor-pointer text-left [perspective:1200px]"
      aria-pressed={active}
      aria-label={`Reason ${index + 1}: ${reason.text}`}
    >
      <motion.div
        className="relative aspect-[3/4] w-full [transform-style:preserve-3d]"
        animate={{ rotateY: active ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${style.front} shadow-md ring-1 ring-rose-300/30 [backface-visibility:hidden]`}
        >
          <span className="absolute top-4 left-5 font-display text-sm text-gold-300/70">{number}</span>
          <span className={`text-5xl transition-transform duration-500 group-hover:scale-110 sm:text-6xl ${style.icon}`}>
            {reason.icon}
          </span>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-br from-maroon-900 to-maroon-950 px-3 shadow-md ring-1 ring-rose-300/25 [transform:rotateY(180deg)] [backface-visibility:hidden] sm:px-5"
        >
          <p className="font-bengali text-center text-sm leading-relaxed text-blush-200/90 sm:text-base">
            {reason.text}
          </p>
        </div>
      </motion.div>
    </motion.button>
  )
}
