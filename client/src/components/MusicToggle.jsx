import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ============================================================
// ✏️ EDIT ME — background music.
// Drop your song in client/public/media/ (e.g. song.mp3) and
// update the path below. Loop starts OFF (browsers block audio
// until the user interacts).
// ============================================================
const MUSIC_SRC = '/media/bg-music.wav'

export default function MusicToggle() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.4
      audio.loop = true
    }
  }, [])

  if (failed) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} preload="none" onError={() => setFailed(true)} />
      <motion.button
        type="button"
        onClick={toggle}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
        className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-rose-300/30 bg-maroon-800/60 text-rose-300 shadow-lg backdrop-blur-md"
      >
        {playing ? (
          <span className="flex h-5 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-rose-500"
                animate={{ height: ['25%', '95%', '40%', '70%', '25%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
              />
            ))}
          </span>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <path d="M9 7l12-2" />
            <path d="M6 21 21 3" strokeWidth="1.6" opacity="0.65" />
          </svg>
        )}
      </motion.button>
    </>
  )
}
