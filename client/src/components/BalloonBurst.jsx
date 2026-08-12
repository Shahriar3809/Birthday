import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

// Decorative one-shot celebration: colorful balloons float up from the bottom
// of the viewport and pop near the top with a tiny particle burst. It runs for
// ~2.5s then calls onComplete so the parent unmounts it — nothing is left
// sitting in the DOM afterwards. `fixed inset-0 overflow-hidden` keeps every
// balloon clipped to the viewport, so it can never cause horizontal overflow.
const COLORS = ['#c41e3a', '#e63950', '#d4af37', '#f4c2c2', '#fff5f0', '#7e1226']
const EASE = [0.22, 1, 0.36, 1]

function PopParticles({ color, delay }) {
  return (
    <div aria-hidden className="absolute top-0 left-1/2">
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const dist = 26 + (i % 3) * 12
        return (
          <motion.span
            key={i}
            className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full"
            style={{ background: color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.55, delay, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

export default function BalloonBurst({ count = 12, onComplete }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 4 + Math.random() * 92,
        size: 0.7 + Math.random() * 0.5,
        rise: 1.1 + Math.random() * 0.5,
        delay: Math.random() * 0.35,
        sway: -30 + Math.random() * 60,
        color: COLORS[i % COLORS.length],
      })),
    [count]
  )

  // Unmount once the slowest balloon has flown AND popped (rise + delay +
  // pop particles + a little margin).
  useEffect(() => {
    const maxFlight = Math.max(...balloons.map((b) => b.delay + b.rise))
    const timer = window.setTimeout(() => onComplete?.(), (maxFlight + 0.7) * 1000)
    return () => window.clearTimeout(timer)
  }, [balloons, onComplete])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[65] overflow-hidden">
      {balloons.map((b) => {
        const popDelay = b.delay + b.rise * 0.82
        return (
          <motion.div
            key={b.id}
            className="absolute bottom-0 will-change-transform"
            style={{ left: `${b.left}%` }}
            initial={{ y: '0vh', opacity: 0, scale: 1 }}
            animate={{
              y: '-92vh',
              opacity: [0, 1, 1, 1, 0],
              scale: [1, 1, 1, 1.3, 0.15],
              x: [0, b.sway, b.sway * 0.4, 0],
            }}
            transition={{
              y: { duration: b.rise, delay: b.delay, ease: 'easeInOut' },
              opacity: { duration: b.rise, delay: b.delay, times: [0, 0.06, 0.72, 0.88, 1], ease: 'linear' },
              scale: { duration: b.rise, delay: b.delay, times: [0, 0.7, 0.88, 0.96, 1], ease: 'easeInOut' },
              x: { duration: b.rise, delay: b.delay, ease: EASE },
            }}
          >
            <div className="relative" style={{ transform: `scale(${b.size})` }}>
              <svg width="46" height="64" viewBox="0 0 46 64">
                <ellipse cx="23" cy="24" rx="20" ry="24" fill={b.color} />
                <path d="M23 48 l-6 9 h12 z" fill={b.color} />
                <path
                  d="M23 57 q5 7 2 12"
                  stroke="rgba(120,80,60,0.45)"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="16"
                  cy="18"
                  rx="5.5"
                  ry="8"
                  fill="rgba(255,255,255,0.45)"
                  transform="rotate(-18 16 18)"
                />
              </svg>
              <PopParticles color={b.color} delay={popDelay} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
