import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import FloatingParticles from './FloatingParticles.jsx'

const EASE = [0.22, 1, 0.36, 1]

// ============================================================
// ✏️ EDIT ME — the video message.
// Drop your real video in client/public/media/ and update the
// path below. Until then, a short royalty-free sample plays
// (video-message.mp4) so the section can be previewed.
// ============================================================
const VIDEO_SRC = '/media/shanta.mp4'

// ============================================================
// ✏️ EDIT ME — heading + subtitle.
// ============================================================
const HEADING = 'এই গানটি তোমাকে উৎসর্গ করলাম.. 🎬'
const SUBTEXT = 'চোখ বন্ধ করো, কানে হেডফোন লাগিয়ে শুনো...'

function formatTime(t) {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function VideoMessage() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [failed, setFailed] = useState(false)

  const toggle = () => {
    const el = videoRef.current
    if (!el || failed) return
    if (playing) {
      el.pause()
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  // Properly toggles the real video's muted state (and keeps the icon in sync).
  // No autoplay is used here, so the video is NOT muted by default — sound
  // plays from the first tap; this button is just an extra control.
  const toggleMute = () => {
    const el = videoRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0

  if (failed) {
    return (
      <section
        id="video-message"
        className="relative py-24 text-center sm:py-32"
        style={{ background: 'linear-gradient(180deg, #852525 0%, #5e1616 50%, #852525 100%)' }}
      >
        <div className="relative z-10 mx-auto w-full max-w-xl px-6">
          <div className="rounded-3xl border border-rose-300/20 bg-maroon-800/55 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <p className="font-bengali text-lg text-blush-100/90 sm:text-xl">{HEADING}</p>
            <p className="font-bengali mt-3 text-sm text-blush-300/70">
              ভিডিও ফাইলটি পাওয়া যায়নি 😔
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    // Background chained to neighbors: Countdown ends at #852525 and Finale
    // starts at #852525, so this section starts AND ends at the same color to
    // avoid seams. Mid stop #5e1616 is Finale's mid stop.
    <section
      id="video-message"
      className="relative py-24 text-center sm:py-32"
      style={{ background: 'linear-gradient(180deg, #852525 0%, #5e1616 50%, #852525 100%)' }}
    >
      {/* Decoration layer — overflow is clipped ONLY here, never on the content */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingParticles count={10} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display mb-8 text-sm italic text-gold-400/90 sm:text-base"
        >
          for you...
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-bengali text-3xl font-bold text-cream/95 sm:text-4xl md:text-5xl"
        >
          {HEADING}
        </motion.h2>

        <div className="mx-auto mt-5 h-[3px] w-56 overflow-hidden rounded-full bg-rose-900/60">
          <motion.div
            className="h-full w-full rounded-full bg-gradient-to-r from-rose-500 via-gold-400 to-rose-400"
            style={{ transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          />
        </div>

        <p className="font-bengali mt-5 text-sm text-blush-300/75 sm:text-base">{SUBTEXT}</p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-10 w-full max-w-2xl"
        >
          <div className="rounded-[2rem] bg-gradient-to-br from-gold-400/70 via-rose-400/50 to-gold-400/70 p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="overflow-hidden rounded-[1.65rem] bg-maroon-950">
              <div className="relative">
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  playsInline
                  preload="metadata"
                  onClick={toggle}
                  className="aspect-video w-full object-contain"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
                  onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setPlaying(false)}
                  onError={() => setFailed(true)}
                />

                {!playing && (
                  <motion.button
                    type="button"
                    onClick={toggle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label="Play video message"
                    className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-gradient-to-b from-black/45 via-black/15 to-black/45"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-500 to-rose-700 text-cream shadow-[0_12px_30px_rgba(196,30,58,0.55)] ring-2 ring-gold-400/40 sm:h-20 sm:w-20">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                        <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
                      </svg>
                    </span>
                  </motion.button>
                )}
              </div>

              <div className="flex items-center gap-4 px-4 py-3 sm:px-5 sm:py-4">
                <motion.button
                  type="button"
                  onClick={toggle}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={playing ? 'Pause video' : 'Play video'}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-500 to-rose-700 text-cream shadow-[0_10px_25px_rgba(196,30,58,0.45)]"
                >
                  {playing ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="5" width="4" height="14" rx="1.2" />
                      <rect x="14" y="5" width="4" height="14" rx="1.2" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                      <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
                    </svg>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={toggleMute}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                  title={muted ? 'শব্দ চালু' : 'শব্দ বন্ধ'}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    muted
                      ? 'border-rose-400/40 bg-rose-900/40 text-rose-400'
                      : 'border-rose-300/30 bg-maroon-900/60 text-blush-300/80'
                  }`}
                >
                  {muted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                      <line x1="22" y1="9" x2="16" y2="15" />
                      <line x1="16" y1="9" x2="22" y2="15" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  )}
                </motion.button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-end justify-between">
                    {playing ? (
                      <span className="flex h-6 items-end gap-[3px]" aria-hidden>
                        {[0, 1, 2, 3].map((i) => (
                          <motion.span
                            key={i}
                            className="w-[4px] rounded-full bg-rose-400"
                            animate={{ height: ['30%', '95%', '45%', '80%', '30%'] }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
                          />
                        ))}
                      </span>
                    ) : (
                      <span className="font-bengali text-sm text-blush-300/60">চাপ দাও, দেখতে পাবে</span>
                    )}
                    <span className="font-mono text-xs text-blush-300/50 tabular-nums">
                      {formatTime(time)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div
                    className="mt-3 h-2 cursor-pointer overflow-hidden rounded-full bg-rose-900/50"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
                      const el = videoRef.current
                      if (el && Number.isFinite(el.duration)) {
                        el.currentTime = ratio * el.duration
                        setTime(ratio * el.duration)
                      }
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 via-gold-400 to-rose-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
