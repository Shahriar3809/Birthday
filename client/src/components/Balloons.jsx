import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#c41e3a', '#e63950', '#d4af37', '#7e1226', '#f4c2c2', '#a81a34']

export default function Balloons({ count = 10 }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (i / count) * 100 + (Math.random() * 6 - 3),
        color: COLORS[i % COLORS.length],
        size: 0.7 + Math.random() * 0.5,
        duration: 9 + Math.random() * 7,
        delay: -Math.random() * 14,
      })),
    [count]
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-[-140px]"
          style={{ left: `${b.x}%`, scale: b.size }}
        >
          <motion.svg
            width="56"
            height="88"
            viewBox="0 0 56 88"
            animate={{ y: [0, -900], x: [0, 16, -12, 10, 0] }}
            transition={{
              y: { duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay },
              x: {
                duration: b.duration * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: b.delay,
              },
            }}
          >
            <ellipse cx="28" cy="30" rx="22" ry="26" fill={b.color} />
            <path d="M28 56 l-8 14 h16 z" fill={b.color} />
            <path
              d="M28 70 q7 10 3 18"
              stroke="rgba(120,80,60,0.5)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx="20"
              cy="23"
              rx="6"
              ry="9"
              fill="rgba(255,255,255,0.45)"
              transform="rotate(-20 20 23)"
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  )
}
