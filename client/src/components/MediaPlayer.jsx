import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

function formatTime(t) {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function MediaPlayer({ type = 'audio', src, title }) {
  const mediaRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  const toggle = () => {
    const el = mediaRef.current
    if (!el || failed) return
    if (playing) {
      el.pause()
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0

  if (failed) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-rose-300/20 bg-maroon-800/55 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-7">
        <p className="font-bengali mb-5 text-center text-base text-blush-100/90 sm:text-lg">
          {title}
        </p>
        <p className="font-bengali text-center text-sm text-blush-300/70">
          মিডিয়া ফাইলটি পাওয়া যায়নি 😔
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-rose-300/20 bg-maroon-800/55 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-7">
      <p className="font-bengali mb-5 text-center text-base text-blush-100/90 sm:text-lg">
        {title}
      </p>

      <div className="flex items-center gap-5">
        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-500 to-rose-700 text-cream shadow-[0_12px_30px_rgba(196,30,58,0.5)] sm:h-20 sm:w-20"
        >
          {playing ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1.2" />
              <rect x="14" y="5" width="4" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
              <path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </motion.button>

        <div className="min-w-0 flex-1">
          {/* Fixed 24px-tall area: waveform + hint text share the SAME box in
              both states (absolutely positioned, opacity-toggled, never
              mounted/unmounted) so the row height and the time label never
              shift on play/pause. */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative h-6 min-w-0 flex-1">
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 flex items-end gap-[3px] transition-opacity duration-200 ${
                  playing ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="w-[4px] rounded-full bg-rose-400"
                    animate={playing ? { height: ['30%', '95%', '45%', '80%', '30%'] } : { height: '35%' }}
                    transition={{
                      duration: 1.1,
                      repeat: playing ? Infinity : 0,
                      ease: 'easeInOut',
                      delay: i * 0.12,
                    }}
                  />
                ))}
              </span>
              <span
                className={`pointer-events-none absolute inset-0 flex items-center overflow-hidden text-ellipsis whitespace-nowrap font-bengali text-sm text-blush-300/60 transition-opacity duration-200 ${
                  playing ? 'opacity-0' : 'opacity-100'
                }`}
              >
                চাপ দাও, শুনতে পাবে
              </span>
            </div>

            <span className="shrink-0 font-mono text-xs text-blush-300/50 tabular-nums">
              {formatTime(time)} / {formatTime(duration)}
            </span>
          </div>

          <div
            className="mt-3 h-2 cursor-pointer overflow-hidden rounded-full bg-rose-900/50"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
              const el = mediaRef.current
              if (el && Number.isFinite(el.duration)) {
                el.currentTime = ratio * el.duration
                setTime(ratio * el.duration)
              }
            }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-gold-400 to-rose-400"
              style={{ width: `${progress}%` }}
              animate={{ opacity: ready ? 1 : 0.5 }}
            />
          </div>
        </div>
      </div>

      {type === 'video' ? (
        <video
          ref={mediaRef}
          src={src}
          controls
          playsInline
          className="mt-5 w-full rounded-2xl bg-maroon-900/60"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration)
            setReady(true)
          }}
          onEnded={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      ) : (
        <audio
          ref={mediaRef}
          src={src}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration)
            setReady(true)
          }}
          onEnded={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
