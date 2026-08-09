import { useEffect, useState } from 'react'
import FloatingParticles from './FloatingParticles.jsx'
import CountdownTimer from './CountdownTimer.jsx'
import Celebration from './Celebration.jsx'
import { getBirthdayTarget, isBirthdayReached } from '../data/birthday.js'

export default function Countdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const target = getBirthdayTarget(now)
  const isBirthday = isBirthdayReached(now)

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
