import { useEffect, useState } from 'react'
import FloatingParticles from './FloatingParticles.jsx'
import CountdownTimer from './CountdownTimer.jsx'
import Celebration from './Celebration.jsx'

// ============================================================
// ✏️ EDIT ME — Shanta's birthday.
// `month` is 0-indexed, so 7 = August. Uses the device's real
// local date — nothing is hardcoded for "today".
// ============================================================
const BIRTHDAY = { month: 7, day: 8 }

export default function Countdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const target = new Date(now.getFullYear(), BIRTHDAY.month, BIRTHDAY.day)
  const isBirthday = target - now <= 0

  return (
    <section
      id="countdown"
      className="relative overflow-hidden py-24 text-center sm:py-32"
      style={{ background: 'linear-gradient(180deg, #4a0e0e 0%, #6e1c1c 50%, #852525 100%)' }}
    >
      <FloatingParticles count={8} />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {isBirthday ? <Celebration /> : <CountdownTimer target={target} now={now} />}
      </div>
    </section>
  )
}
