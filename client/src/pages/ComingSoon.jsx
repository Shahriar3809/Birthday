import { motion } from 'framer-motion'
import FloatingParticles from '../components/FloatingParticles.jsx'

export default function ComingSoon({ title }) {
  return (
    <main
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
      style={{ background: 'linear-gradient(180deg, #3f0d0d 0%, #4a0e0e 55%, #6e1c1c 100%)' }}
    >
      <FloatingParticles count={8} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <p className="font-display mb-3 text-sm italic text-gold-400/90">
          {title.toLowerCase()}
        </p>
        <h1 className="font-bengali text-4xl font-bold text-cream/95 sm:text-5xl">
          {title}
        </h1>
        <p className="font-bengali mt-4 text-blush-300/70">
          খুব শীঘ্রই এখানে ম্যাজিক হবে...
        </p>
      </motion.div>
    </main>
  )
}
