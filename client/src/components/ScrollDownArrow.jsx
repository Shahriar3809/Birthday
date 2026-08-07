import { motion } from 'framer-motion'

export default function ScrollDownArrow({ target = '#next-section' }) {
  return (
    <motion.a
      href={target}
      aria-label="Scroll down to the next section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-rose-300/70 transition-colors hover:text-rose-200"
    >
      <span className="font-bengali text-[11px] tracking-[0.35em] uppercase">scroll</span>
      <motion.svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </motion.svg>
    </motion.a>
  )
}
