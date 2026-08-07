import { motion } from 'framer-motion'
import { useMemo } from 'react'

const SHAPES = ['heart', 'spark', 'petal', 'dot']

function random(min, max) {
  return Math.random() * (max - min) + min
}

export default function FloatingParticles({ count = 18 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: random(0, 100),
        size: random(9, 24),
        duration: random(16, 30),
        delay: -random(0, 28),
        drift: random(-40, 40),
        sway: random(6, 16),
        opacity: random(0.12, 0.35),
        shape: SHAPES[i % SHAPES.length],
        color: ['#e63950', '#d4af37', '#c41e3a', '#f4c2c2'][i % 4],
      })),
    [count]
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-0 top-0 will-change-transform"
          style={{
            left: `${p.x}%`,
            color: p.color,
            fontSize: p.size,
            opacity: p.opacity,
          }}
          initial={{ y: '110vh' }}
          animate={{
            y: ['110vh', '-12vh'],
            x: [0, p.drift, -p.drift, p.sway, 0],
            rotate: p.shape === 'spark' ? [0, 90, 180] : undefined,
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay },
            x: { duration: p.duration * 0.9, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
            rotate: { duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay },
          }}
        >
          {p.shape === 'heart' && '♥'}
          {p.shape === 'spark' && '✦'}
          {p.shape === 'petal' && '❁'}
          {p.shape === 'dot' && '•'}
        </motion.span>
      ))}
    </div>
  )
}
