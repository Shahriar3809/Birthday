import { motion } from 'framer-motion'
import PhotoFrame from './PhotoFrame.jsx'
import FloatingParticles from './FloatingParticles.jsx'
import ScrollDownArrow from './ScrollDownArrow.jsx'
import WordReveal from './WordReveal.jsx'

const EASE = [0.22, 1, 0.36, 1]

const HEADING = [
  { text: 'Happy', className: 'text-cream/95' },
  { text: 'Birthday', className: 'text-cream/95' },
  { text: 'Shanta', className: 'font-display italic text-rose-400' },
  { text: '❤️', className: '' },
]

// ============================================================
// ✏️ EDIT ME — personal message for Shanta.
// Rewrite the text below freely; each word reveals one by one.
// ============================================================
const PERSONAL_MESSAGE =
  'আজ তোমার জন্মদিন, শান্তা। তুমি আমার জীবনের সবচেয়ে সুন্দর অধ্যায় — এই বিশেষ দিনে শুধু একটা কথাই বলতে চাই। তুমি যতটা না জানো, তার চেয়ে অনেক বেশি ভালোবাসি তোমায়।'

const SIGNATURE = '— তোমার ভালোবাসা প্রত্যাশী'

export default function BirthdayMessage() {
  const paragraphWords = PERSONAL_MESSAGE.split(' ').map((w) => ({ text: w }))

  return (
    <section
      id="birthday-message"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:py-32"
      style={{ background: 'linear-gradient(180deg, #7a1f1f 0%, #5e1616 55%, #4a0e0e 100%)' }}
    >
      <FloatingParticles count={12} />

      <div className="relative z-10 flex max-w-4xl flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display mb-4 text-sm italic text-gold-400/90 sm:text-base"
        >
          a few words, straight from my heart
        </motion.p>

        <WordReveal
          words={HEADING}
          className="text-4xl font-bold sm:text-5xl md:text-6xl"
          stagger={0.12}
        />

        <div className="mt-12 flex flex-col items-center gap-12 md:mt-16 md:flex-row md:gap-16">
          <PhotoFrame className="h-52 w-52 shrink-0 sm:h-64 sm:w-64 md:h-72 md:w-72" />

          <div className="flex max-w-md flex-col items-center md:items-start md:text-left">
            <WordReveal
              words={paragraphWords}
              className="font-bengali text-lg leading-loose text-blush-200/85 sm:text-xl"
              stagger={0.03}
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, delay: 1.6, ease: 'easeOut' }}
              className="font-display mt-6 text-base italic text-gold-400 sm:text-lg"
            >
              {SIGNATURE}
            </motion.p>
          </div>
        </div>
      </div>

      <ScrollDownArrow target="#memories" />
    </section>
  )
}
