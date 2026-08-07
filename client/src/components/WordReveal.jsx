import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

export default function WordReveal({ words, className = '', stagger = 0.09, center = true }) {
  return (
    <motion.div
      className={`flex flex-wrap ${center ? 'justify-center' : ''} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.1 } },
      }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: EASE },
            },
          }}
          className={`mr-[0.3em] inline-block ${w.className ?? ''}`}
        >
          {w.text}
        </motion.span>
      ))}
    </motion.div>
  )
}
