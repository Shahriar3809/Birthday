import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import AdminWishes from './pages/AdminWishes.jsx'
import CountdownGate from './components/CountdownGate.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import BrandBadge from './components/BrandBadge.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import { getBirthdayTarget } from './data/birthday.js'

const EASE = [0.22, 1, 0.36, 1]

function Gate() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin-wishes')

  // Ticked once per second so the gate can flip open live at the target moment.
  const [now, setNow] = useState(() => new Date())
  // The countdown target. Start from the static data/birthday.js config, then
  // adopt the server-configured moment once /api/settings/birthday responds.
  const [target, setTarget] = useState(() => getBirthdayTarget(new Date()))
  const [targetReady, setTargetReady] = useState(false)
  const [hasUnlocked, setHasUnlocked] = useState(false)

  // Fetch the DB-driven birthday once. On failure (or nothing set) we keep the
  // static config — the gate must never break because the DB is unreachable.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let next = null
      try {
        const res = await fetch('/api/settings/birthday')
        if (res.ok) {
          const data = await res.json()
          if (data?.birthdayDate) next = new Date(data.birthdayDate)
        }
      } catch {
        // fall back to the static config below
      }
      if (cancelled) return
      setTarget(next ?? getBirthdayTarget(new Date()))
      setTargetReady(true)
      setHasUnlocked((next ?? getBirthdayTarget(new Date())) - new Date() <= 0)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (hasUnlocked) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [hasUnlocked])

  // Live unlock: the instant now >= target, flip the state (no refresh needed).
  useEffect(() => {
    if (targetReady && !hasUnlocked && target - now <= 0) {
      setHasUnlocked(true)
    }
  }, [now, hasUnlocked, target, targetReady])

  const showGate = targetReady && !hasUnlocked && !isAdminRoute

  // Lock body scroll while the gate is up so nothing behind it can scroll.
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    if (showGate) {
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
    }
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [showGate])

  // While the DB-driven target is still loading, render nothing on public
  // routes so birthday content can never leak even briefly; the admin route
  // is exempt (it is always reachable).
  if (!targetReady && !isAdminRoute) return null

  return (
    <AnimatePresence mode="wait">
      {showGate ? (
        <motion.div
          key="gate"
          className="fixed inset-0 z-50"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <CountdownGate target={target} now={now} />
        </motion.div>
      ) : (
        <motion.div
          key="site"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="min-h-svh"
        >
          {/* Content scale-in lives on an INNER wrapper. The fixed chrome
              below (progress bar, badge, music) must never sit under a
              transform: a `transform` on any ancestor makes `position:
              fixed` anchor to that ancestor instead of the viewport. Opacity
              alone does not create a containing block, so it is safe here. */}
          <motion.div
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="min-h-svh"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/love-story" element={<ComingSoon title="Our Story" />} />
              <Route path="/gallery" element={<ComingSoon title="Gallery" />} />
              <Route path="/wishes" element={<ComingSoon title="Wishes" />} />
              <Route path="/admin-wishes" element={<AdminWishes />} />
            </Routes>
          </motion.div>

          <ScrollProgress />
          <BrandBadge />
          <MusicToggle />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Gate />
    </BrowserRouter>
  )
}
