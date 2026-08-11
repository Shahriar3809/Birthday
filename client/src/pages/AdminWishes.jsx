import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getBirthdayTarget } from '../data/birthday.js'

// Convert an ISO string to the local "YYYY-MM-DDTHH:mm" value a
// datetime-local input expects.
function toLocalInput(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminWishes() {
  const [password, setPassword] = useState(sessionStorage.getItem('sb_admin_pass') || '')
  const [wishes, setWishes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [storedBirthday, setStoredBirthday] = useState(null)
  const [birthdayInput, setBirthdayInput] = useState(() => toLocalInput(getBirthdayTarget(new Date()).toISOString()))
  const [birthdayLoading, setBirthdayLoading] = useState(false)
  const [birthdayMsg, setBirthdayMsg] = useState(null)

  const [confirmId, setConfirmId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteErrorId, setDeleteErrorId] = useState(null)

  const loadWishes = async (pass) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/wishes', {
        headers: { 'x-admin-password': pass },
      })
      if (res.status === 401) {
        sessionStorage.removeItem('sb_admin_pass')
        setError('ভুল পাসওয়ার্ড')
        setWishes(null)
        return
      }
      if (!res.ok) throw new Error('bad status')
      setWishes(await res.json())
    } catch {
      setError('লোড করা যায়নি')
    } finally {
      setLoading(false)
    }
  }

  const loadBirthday = async () => {
    setBirthdayLoading(true)
    try {
      const res = await fetch('/api/settings/birthday')
      if (res.ok) {
        const data = await res.json()
        if (data?.birthdayDate) {
          setStoredBirthday(data.birthdayDate)
          setBirthdayInput(toLocalInput(data.birthdayDate))
        }
      }
    } catch {
      // keep the default from data/birthday.js
    } finally {
      setBirthdayLoading(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!password.trim()) return
    sessionStorage.setItem('sb_admin_pass', password.trim())
    loadWishes(password.trim())
    loadBirthday()
  }

  // Soft-delete a wish: the server only sets isDeleted:true, so the document
  // stays in MongoDB but drops out of the admin list with a fade-out.
  const deleteWish = async (id) => {
    setDeletingId(id)
    setDeleteErrorId(null)
    try {
      const pass = sessionStorage.getItem('sb_admin_pass')
      const res = await fetch(`/api/admin/wishes/${id}/delete`, {
        method: 'PATCH',
        headers: { 'x-admin-password': pass },
      })
      if (res.status === 401) {
        sessionStorage.removeItem('sb_admin_pass')
        setWishes(null)
        return
      }
      if (!res.ok) throw new Error('bad status')
      setWishes((prev) => (prev || []).filter((w) => w.id !== id))
      setConfirmId(null)
    } catch {
      setDeleteErrorId(id)
    } finally {
      setDeletingId(null)
    }
  }

  const saveBirthday = async (e) => {
    e.preventDefault()
    if (!birthdayInput) return
    setBirthdayLoading(true)
    setBirthdayMsg(null)
    try {
      const pass = sessionStorage.getItem('sb_admin_pass')
      const res = await fetch('/api/admin/settings/birthday', {
        method: 'PUT',
        headers: { 'x-admin-password': pass, 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthdayDate: new Date(birthdayInput).toISOString() }),
      })
      if (res.status === 401) {
        sessionStorage.removeItem('sb_admin_pass')
        setWishes(null)
        return
      }
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      setStoredBirthday(data.birthdayDate)
      setBirthdayMsg({ type: 'success', text: 'সেভ হয়েছে ✓' })
    } catch {
      setBirthdayMsg({ type: 'error', text: 'সেভ করা যায়নি' })
    } finally {
      setBirthdayLoading(false)
    }
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('bn-BD', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  return (
    <div className="min-h-screen overflow-x-clip bg-gradient-to-b from-maroon-950 via-maroon-900 to-rose-950 px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="font-display text-center text-3xl text-blush-100">Wishes</h1>

        {!wishes ? (
          <form
            onSubmit={submit}
            className="mt-10 rounded-3xl border border-rose-300/20 bg-maroon-800/55 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          >
            <p className="font-bengali text-center text-lg text-blush-100/90">পাসওয়ার্ড দাও</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="font-mono mt-5 w-full rounded-2xl border border-rose-300/30 bg-maroon-900/60 px-4 py-3 text-cream/95 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25"
            />
            <button
              type="submit"
              disabled={!password.trim() || loading}
              className="font-bengali mt-5 w-full rounded-full bg-gradient-to-br from-rose-500 to-rose-700 px-8 py-3 text-lg font-semibold text-cream shadow-[0_12px_30px_rgba(196,30,58,0.45)] disabled:opacity-40"
            >
              {loading ? 'লোড হচ্ছে...' : 'দেখো'}
            </button>
            {error && (
              <p className="font-bengali mt-3 text-center text-sm text-rose-300">{error}</p>
            )}
          </form>
        ) : (
          <>
            <p className="font-bengali mt-6 text-center text-sm text-blush-300/70">
              মোট {wishes.length} টি wish · নতুনটা আগে
            </p>

            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => {
                  const saved = sessionStorage.getItem('sb_admin_pass')
                  if (saved) {
                    loadWishes(saved)
                    loadBirthday()
                  }
                }}
                disabled={loading}
                className="font-bengali rounded-full bg-gradient-to-br from-rose-500 to-rose-700 px-6 py-2 text-sm font-semibold text-cream shadow-[0_10px_25px_rgba(196,30,58,0.4)] disabled:opacity-40"
              >
                {loading ? 'রিফ্রেশ হচ্ছে...' : '↻ রিফ্রেশ'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setWishes(null)
                  setPassword('')
                  sessionStorage.removeItem('sb_admin_pass')
                }}
                className="font-bengali text-sm text-gold-400 underline-offset-4 hover:underline"
              >
                লগআউট
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-rose-300/20 bg-maroon-800/55 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] sm:p-8">
              <h2 className="font-bengali text-lg font-semibold text-blush-100 sm:text-xl">
                জন্মদিনের সময় সেট করো
              </h2>
              <p className="font-bengali mt-1 text-sm text-blush-300/75">
                {storedBirthday
                  ? `বর্তমানে সেট করা আছে: ${formatDate(storedBirthday)}`
                  : 'এখনো সেট করা হয়নি — ডিফল্ট সেটিং ব্যবহার হবে'}
              </p>
              <form onSubmit={saveBirthday} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="datetime-local"
                  value={birthdayInput}
                  onChange={(e) => setBirthdayInput(e.target.value)}
                  disabled={birthdayLoading}
                  className="w-full flex-1 rounded-2xl border border-rose-300/30 bg-maroon-900/60 px-4 py-2.5 text-cream/95 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25 [color-scheme:dark]"
                />
                <button
                  type="submit"
                  disabled={birthdayLoading || !birthdayInput}
                  className="font-bengali shrink-0 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 px-6 py-2.5 text-sm font-semibold text-cream shadow-[0_10px_25px_rgba(196,30,58,0.4)] disabled:opacity-40"
                >
                  {birthdayLoading ? 'সেভ হচ্ছে...' : 'সেভ করো'}
                </button>
              </form>
              <AnimatePresence>
                {birthdayMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`font-bengali mt-3 text-sm ${
                      birthdayMsg.type === 'success' ? 'text-gold-300' : 'text-rose-300'
                    }`}
                  >
                    {birthdayMsg.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <ul className="mt-6 space-y-4">
              {wishes.length === 0 && (
                <li className="font-bengali rounded-2xl border border-rose-300/20 bg-maroon-800/55 p-6 text-center text-blush-300/80">
                  এখনো কোনো wish আসেনি
                </li>
              )}
              <AnimatePresence>
                {wishes.map((w) => (
                  <motion.li
                    key={w.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border border-rose-300/20 bg-maroon-800/55 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bengali text-sm font-semibold text-gold-400">
                          {w.name || 'Shanta'}
                        </p>
                        <p className="font-bengali mt-1 text-xs text-blush-300/70">
                          {formatDate(w.submittedAt)}
                        </p>
                        {w.ipAddress && (
                          <p className="font-mono mt-0.5 text-[11px] text-blush-300/45">
                            IP · {w.ipAddress}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfirmId(confirmId === w.id ? null : w.id)}
                        disabled={deletingId === w.id}
                        aria-label="এই wish টা মুছে ফেলো"
                        title="মুছে ফেলো"
                        className="font-bengali shrink-0 rounded-full border border-rose-300/15 px-3 py-1.5 text-xs text-rose-300/60 transition-colors hover:border-rose-400/40 hover:text-rose-300 disabled:opacity-40"
                      >
                        🗑️ মুছে ফেলো
                      </button>
                    </div>

                    <p className="font-bengali mt-3 text-cream/95">{w.message}</p>

                    {confirmId === w.id && (
                      <div className="mt-3 rounded-xl border border-rose-300/20 bg-maroon-950/70 p-3">
                        <p className="font-bengali text-xs text-blush-300/85">
                          এই মেসেজটা মুছে ফেলতে চাও?
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => deleteWish(w.id)}
                            disabled={deletingId === w.id}
                            className="font-bengali rounded-full bg-gradient-to-br from-rose-500 to-rose-700 px-4 py-1.5 text-xs font-semibold text-cream disabled:opacity-40"
                          >
                            {deletingId === w.id ? 'মোছা হচ্ছে...' : 'হ্যাঁ'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            disabled={deletingId === w.id}
                            className="font-bengali rounded-full border border-rose-300/30 px-4 py-1.5 text-xs text-blush-300/80 disabled:opacity-40"
                          >
                            বাতিল
                          </button>
                          {deleteErrorId === w.id && (
                            <span className="font-bengali text-xs text-rose-300">
                              মোছা যায়নি
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
