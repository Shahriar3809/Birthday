import { motion } from 'framer-motion'
import FloatingParticles from './FloatingParticles.jsx'
import MediaPlayer from './MediaPlayer.jsx'
import WishForm from './WishForm.jsx'
import WordReveal from './WordReveal.jsx'

const EASE = [0.22, 1, 0.36, 1]

// ============================================================
// ✏️ EDIT ME — Shanta's media message.
// Drop your file in client/public/media/ and update `src`.
// For a short video, set type to 'video' and point at your mp4.
// ============================================================
const MEDIA = {
  type: 'audio',
  src: '/media/voice-note.wav',
  title: 'শান্তা, আবারও জন্মদিনের শুভেচ্ছা',
}

// ============================================================
// ✏️ EDIT ME — the closing line.
// ============================================================
const CLOSING_LINE =
  'তুমি আমার জীবনের সবচেয়ে সুন্দর অধ্যায়-। আমার নিজের ভুলেই সেই সুন্দর অধ্যায়টা হারিয়ে ফেলেছি। হয়তো তোমাকে হারানোর কষ্টটা আমার প্রাপ্যই ছিল। তবুও আজ তোমার জন্মদিনে কোনো দাবি নেই, শুধু চাই— অনেক বেশি ভালো থাকো তুমি। আমার একমাত্র চাওয়া- শুধুই তুমি। আমি এখনো তোমার অপেক্ষায়....'

const SHINE_WIDTH = 'w-1/4'

export default function Finale() {
  const closingWords = CLOSING_LINE.split(' ').map((w) => ({ text: w }))

  return (
    <section
      id="finale"
      className="relative overflow-x-clip py-24 text-center sm:py-32"
      style={{ background: 'linear-gradient(180deg, #852525 0%, #5e1616 55%, #440d10 100%)' }}
    >
      {/* Decoration layer — overflow is clipped ONLY here, never on the content */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingParticles count={10} />
      </div>

      {/* Root clips horizontal overflow-x only: the -inset-8 glow below (and
          any decorative bleed) must never extend the document past the
          viewport on narrow screens. Vertical content is never clipped. */}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display mb-8 text-sm italic text-gold-400/90 sm:text-base"
        >
          and finally...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="w-full"
        >
          <MediaPlayer type={MEDIA.type} src={MEDIA.src} title={MEDIA.title} />
        </motion.div>

        <motion.span
          className="mt-14 inline-block text-4xl sm:text-5xl"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 1.4 }}
        >
          ❤️
        </motion.span>

        <div className="relative mt-6 inline-block">
          <motion.div
            aria-hidden
            className="absolute -inset-8 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(196,30,58,0.45) 0%, rgba(212,175,55,0.12) 55%, transparent 75%)' }}
            animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.06, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative overflow-hidden rounded-xl">
            <h2 className="bg-gradient-to-r from-rose-400  via-gold-400 to-rose-300 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl md:text-6xl">
              Happy Birthday Shanta ❤️
            </h2>
            <motion.div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 left-0 ${SHINE_WIDTH} rotate-12 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-screen`}
              initial={{ x: '-120%' }}
              animate={{ x: '520%' }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.1 }}
            />
          </div>
        </div>

        <div className="mt-8 max-w-xl">
          <WordReveal
            words={closingWords}
            className="font-bengali text-lg mt-7 leading-loose text-blush-200/85 sm:text-xl"
            stagger={0.045}
          />
        </div>

        <div className="mt-16 w-full">
          <WishForm />
        </div>

        <p className="font-display mt-20 text-sm italic text-gold-400/80 sm:text-base">
          Made with ❤️ by Shahriar — Just for You
        </p>
      </div>
    </section>
  )
}
