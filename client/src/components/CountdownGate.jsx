import { motion } from 'framer-motion'
import FloatingParticles from './FloatingParticles.jsx'
import CountdownTimer from './CountdownTimer.jsx'

const EASE = [0.22, 1, 0.36, 1]

export default function CountdownGate({ target, now }) {
  return (
    <div
      className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-6 py-10 text-center"
      style={{ background: 'linear-gradient(180deg, #38080c 0%, #4a0e0e 45%, #7a1f1f 100%)' }}
    >
      {/* Ambient glows */}
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
        className="absolute top-1/3 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(230,57,80,0.28) 0%, transparent 65%)' }}
      />

      <FloatingParticles count={16} />

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <CountdownTimer target={target} now={now} large />
        </motion.div>
      </div>
    </div>
  )
}
