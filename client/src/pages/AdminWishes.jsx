import { useState } from 'react'

export default function AdminWishes() {
  const [password, setPassword] = useState(sessionStorage.getItem('sb_admin_pass') || '')
  const [wishes, setWishes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const submit = (e) => {
    e.preventDefault()
    if (!password.trim()) return
    sessionStorage.setItem('sb_admin_pass', password.trim())
    loadWishes(password.trim())
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
    <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-rose-950 px-6 py-16">
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
                  if (saved) loadWishes(saved)
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

            <ul className="mt-6 space-y-4">
              {wishes.length === 0 && (
                <li className="font-bengali rounded-2xl border border-rose-300/20 bg-maroon-800/55 p-6 text-center text-blush-300/80">
                  এখনো কোনো wish আসেনি
                </li>
              )}
              {wishes.map((w) => (
                <li
                  key={w.id}
                  className="rounded-2xl border border-rose-300/20 bg-maroon-800/55 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-bengali text-sm font-semibold text-gold-400">
                      {w.name || 'Shanta'}
                    </span>
                    <span className="font-bengali text-xs text-blush-300/70">
                      {formatDate(w.submittedAt)}
                    </span>
                  </div>
                  <p className="font-bengali mt-2 text-cream/95">{w.message}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
