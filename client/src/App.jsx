import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import AdminWishes from './pages/AdminWishes.jsx'
import CountdownGate from './components/CountdownGate.jsx'
import BalloonBurst from './components/BalloonBurst.jsx'
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

  // Two-step reveal: after the countdown gate unlocks, only the hero (gift
  // box) is shown. Tapping "খুলে দেখো" plays the opening + balloon burst;
  // once the burst completes, `siteRevealed` mounts the rest of the page,
  // unlocks scrolling, and auto-scrolls down to the birthday message.
  const [siteRevealed, setSiteRevealed] = useState(false)
  const [balloonBurst, setBalloonBurst] = useState(false)

  const handleOpen = () => {
    if (siteRevealed) return
    setBalloonBurst(true)
  }

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

  // Lock body scroll while the gate is up, and again during the hero-only
  // stage after it dismisses, so nothing hidden behind the hero can scroll.
  // Unlocked once "খুলে দেখো" completes and the full page is mounted.
  const lockScroll = showGate || (!siteRevealed && !isAdminRoute)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    if (lockScroll) {
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
    }
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [lockScroll])

  // After the celebration finishes and the rest of the sections are mounted,
  // smooth-scroll down to the birthday message so the user isn't left staring
  // at the hero. This effect runs only once `siteRevealed` flips true — the
  // scroll-lock effect above has already restored `overflow` by then, and the
  // short delay lets layout settle (fonts/images) so the target's final
  // position is correct. No-op on routes where the section isn't mounted.
  useEffect(() => {
    if (!siteRevealed) return
    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return
      document.getElementById('birthday-message')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [siteRevealed])

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
              below (progress bar, corner badges) must never sit under a
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
              <Route path="/" element={<Home revealed={siteRevealed} onOpen={handleOpen} />} />
              <Route path="/love-story" element={<ComingSoon title="Our Story" />} />
              <Route path="/gallery" element={<ComingSoon title="Gallery" />} />
              <Route path="/wishes" element={<ComingSoon title="Wishes" />} />
              <Route path="/admin-wishes" element={<AdminWishes />} />
            </Routes>
          </motion.div>

          <ScrollProgress />
          <BrandBadge label="Shanta ❤" corner="left" />
          <BrandBadge label="Shahriar ❤" corner="right" />
          {balloonBurst && (
            <BalloonBurst
              onComplete={() => {
                setBalloonBurst(false)
                setSiteRevealed(true)
              }}
            />
          )}
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
