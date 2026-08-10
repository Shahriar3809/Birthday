import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function WishForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const submit = async (e) => {
    e.preventDefault()
    if (!message.trim() || status === 'submitting') return
    setStatus('submitting')
    try {
      const res = await fetch('/api/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      })
      if (!res.ok) throw new Error('bad request')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setMessage('')
    setName('')
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="flex flex-col items-center rounded-3xl border border-rose-300/20 bg-maroon-800/55 px-8 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm"
          >
            <motion.span
              className="text-6xl"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1.2 }}
            >
              ❤️
            </motion.span>
            <p className="font-bengali mt-6 text-2xl font-semibold text-blush-100 sm:text-3xl">
              তোমার কথা আমি পেয়েছি।
            </p>
            <p className="font-bengali mt-2 text-sm text-blush-300/80 sm:text-base">
              তোমাকে অসংখ্য ধন্যবাদ। 
            </p>
            <button
              type="button"
              onClick={reset}
              className="font-bengali mt-8 text-sm text-gold-400 underline-offset-4 hover:underline"
            >
              আরেকটা লিখতে চাও
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-rose-300/20 bg-maroon-800/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8"
          >
            <p className="font-bengali text-center text-lg text-blush-100/90 sm:text-xl">
              আমাকে কিছু বলতে চাইলে এখানে লিখে পাঠাও।
            </p>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="তোমার নাম (ঐচ্ছিক)"
              className="font-bengali mt-5 w-full rounded-2xl border border-rose-300/30 bg-maroon-900/60 px-4 py-3 text-cream/95 placeholder-blush-300/40 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="এখানে লিখো..."
              className="font-bengali mt-4 w-full resize-none rounded-2xl border border-rose-300/30 bg-maroon-900/60 px-4 py-3 text-cream/95 placeholder-blush-300/40 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-xs text-blush-300/50 tabular-nums">
                {message.length}/2000
              </span>
              <motion.button
                type="submit"
                disabled={!message.trim() || status === 'submitting'}
                whileHover={{ scale: message.trim() && status !== 'submitting' ? 1.04 : 1 }}
                whileTap={{ scale: message.trim() && status !== 'submitting' ? 0.95 : 1 }}
                className="font-bengali rounded-full bg-gradient-to-br from-rose-500 via-rose-500 to-rose-700 px-8 py-3 text-lg font-semibold text-cream shadow-[0_12px_30px_rgba(196,30,58,0.45)] disabled:opacity-40 disabled:shadow-none"
              >
                {status === 'submitting' ? 'পাঠানো হচ্ছে...' : 'পাঠাও'}
              </motion.button>
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bengali mt-3 text-center text-sm text-rose-300"
                >
                  পাঠানো যায়নি — আবার চেষ্টা করো।
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
