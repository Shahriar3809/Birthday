import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

const lidVariants = {
  closed: { y: 0, rotate: 0, opacity: 1 },
  open: {
    y: -190,
    rotate: -30,
    opacity: 0,
    transition: {
      y: { duration: 0.75, ease: EASE },
      rotate: { duration: 0.75, ease: EASE },
      opacity: { delay: 0.5, duration: 0.35 },
    },
  },
}

const bowVariants = {
  closed: { opacity: 1, scale: 1 },
  open: { opacity: 0, scale: 1, transition: { duration: 0.2 } },
}

const loopVariants = {
  closed: { x: 0, y: 0, rotate: 0, opacity: 1 },
  open: {
    x: 40,
    y: 26,
    rotate: 35,
    opacity: 0,
    transition: { duration: 0.55, ease: 'easeIn' },
  },
}

const loopRightVariants = {
  closed: { x: 0, y: 0, rotate: 0, opacity: 1 },
  open: {
    x: -40,
    y: 26,
    rotate: -35,
    opacity: 0,
    transition: { duration: 0.55, ease: 'easeIn' },
  },
}

const tailVariants = {
  closed: { y: 0, rotate: 0, opacity: 1 },
  open: {
    y: 46,
    rotate: 6,
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeIn' },
  },
}

const glowVariants = {
  closed: { opacity: 0, scale: 0.35 },
  open: {
    opacity: [0, 1, 0.9],
    scale: [0.35, 1.2, 1.05],
    transition: { duration: 1.1, times: [0, 0.6, 1], ease: 'easeOut' },
  },
}

const sparkVariants = {
  closed: { opacity: 0, scale: 0.3, y: 6 },
  open: {
    opacity: [0, 1, 0],
    scale: [0.3, 1.2, 0.6],
    y: [6, -16, -30],
    transition: { duration: 1.3, ease: 'easeOut', delay: 0.15 },
  },
}

export default function GiftBox({ opened = false, className = '' }) {
  const state = opened ? 'open' : 'closed'

  return (
    <motion.svg
      viewBox="0 0 320 360"
      className={className}
      role="img"
      aria-label="A birthday gift box"
      initial={{ y: -90, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.35 }}
    >
      <defs>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c41e3a" />
          <stop offset="100%" stopColor="#7e1226" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e63950" />
          <stop offset="100%" stopColor="#a81a34" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3c565" />
          <stop offset="100%" stopColor="#b8912c" />
        </linearGradient>
        <linearGradient id="bowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#97752a" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffe9bd" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#e63950" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e63950" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="haloGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.g
        initial={{ opacity: 0 }}
        animate={opened ? { opacity: 0 } : { opacity: [0, 0.9, 0.55] }}
        transition={opened ? { duration: 0.6 } : { duration: 2.6, repeat: Infinity, times: [0, 0.5, 1] }}
      >
        <ellipse cx="160" cy="180" rx="130" ry="46" fill="url(#haloGrad)" />
      </motion.g>

      <g opacity="0.08">
        <ellipse cx="160" cy="350" rx="105" ry="16" fill="#6b4a2b" />
      </g>

      <motion.g animate={state}>
        <motion.g variants={glowVariants}>
          <ellipse cx="160" cy="200" rx="76" ry="38" fill="url(#glowGrad)" />
        </motion.g>

        <rect x="70" y="185" width="180" height="150" rx="12" fill="url(#boxGrad)" />
        <rect x="70" y="185" width="180" height="26" rx="12" fill="#ffffff" opacity="0.25" />
        <path d="M70 255 L70 335 Q70 347 82 347 L238 347 Q250 347 250 335 L250 255 Z" fill="#000000" opacity="0.08" />

        <rect x="148" y="185" width="24" height="150" fill="url(#ribbonGrad)" />
        <rect x="70" y="212" width="180" height="22" fill="url(#ribbonGrad)" />
        <rect x="70" y="212" width="180" height="9" fill="#ffffff" opacity="0.22" />

        <motion.g variants={sparkVariants}>
          <g fill="#ffe9bd">
            <path d="M150 196 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" />
            <path d="M176 214 l2.6 6 6 2.6 -6 2.6 -2.6 6 -2.6 -6 -6 -2.6 6 -2.6 z" opacity="0.85" />
            <path d="M142 224 l2.2 5 5 2.2 -5 2.2 -2.2 5 -2.2 -5 -5 -2.2 5 -2.2 z" opacity="0.6" />
          </g>
        </motion.g>

        <motion.g variants={lidVariants}>
          <rect x="56" y="118" width="208" height="72" rx="12" fill="url(#lidGrad)" />
          <rect x="56" y="118" width="208" height="22" rx="11" fill="#ffffff" opacity="0.28" />
          <rect x="148" y="118" width="24" height="72" fill="url(#ribbonGrad)" />
          <rect x="56" y="146" width="208" height="20" fill="url(#ribbonGrad)" />
          <rect x="56" y="146" width="208" height="8" fill="#ffffff" opacity="0.22" />

          <motion.g variants={bowVariants} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <motion.g variants={loopVariants} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <path d="M160 128 C140 96 96 104 96 128 C96 150 138 154 160 128 Z" fill="url(#bowGrad)" />
              <path d="M150 132 C140 114 122 116 116 128" stroke="#f7dcae" strokeWidth="4" fill="none" strokeLinecap="round" />
            </motion.g>
            <motion.g variants={loopRightVariants} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <path d="M160 128 C180 96 224 104 224 128 C224 150 182 154 160 128 Z" fill="url(#bowGrad)" />
              <path d="M170 132 C180 114 198 116 204 128" stroke="#f7dcae" strokeWidth="4" fill="none" strokeLinecap="round" />
            </motion.g>
            <motion.g variants={tailVariants} style={{ transformBox: 'fill-box', transformOrigin: 'top' }}>
              <path d="M150 132 C148 152 146 162 138 178 C156 170 158 158 160 138 Z" fill="url(#bowGrad)" />
              <path d="M170 132 C172 152 174 162 182 178 C164 170 162 158 160 138 Z" fill="url(#bowGrad)" />
            </motion.g>
            <circle cx="160" cy="130" r="10" fill="#6e0f23" />
            <circle cx="156" cy="126" r="3" fill="#f3d9ab" />
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.svg>
  )
}
