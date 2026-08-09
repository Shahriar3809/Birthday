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
import { getBirthdayTarget, isBirthdayReached } from './data/birthday.js'

const EASE = [0.22, 1, 0.36, 1]

function Gate() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin-wishes')

  // Ticked once per second. Initialized to "now" so that:
  //  - if the birthday has already started on first load, hasUnlocked
  //    starts true and the gate NEVER renders (no brief flash);
  //  - otherwise the gate shows and the interval flips it live at the target moment.
  const [now, setNow] = useState(() => new Date())
  const [hasUnlocked, setHasUnlocked] = useState(() => isBirthdayReached(new Date()))

  useEffect(() => {
    if (hasUnlocked) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [hasUnlocked])

  // Live unlock: the instant now >= target, flip the state (no refresh needed).
  useEffect(() => {
    if (!hasUnlocked && isBirthdayReached(now)) {
      setHasUnlocked(true)
    }
  }, [now, hasUnlocked])

  const showGate = !hasUnlocked && !isAdminRoute

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

  const target = getBirthdayTarget(now)

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
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="min-h-svh"
        >
          <ScrollProgress />
          <BrandBadge />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/love-story" element={<ComingSoon title="Our Story" />} />
            <Route path="/gallery" element={<ComingSoon title="Gallery" />} />
            <Route path="/wishes" element={<ComingSoon title="Wishes" />} />
            <Route path="/admin-wishes" element={<AdminWishes />} />
          </Routes>
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
