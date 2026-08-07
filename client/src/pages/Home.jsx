import Hero from '../components/Hero.jsx'
import BirthdayMessage from '../components/BirthdayMessage.jsx'
import Memories from '../components/Memories.jsx'
import Reasons from '../components/Reasons.jsx'
import Countdown from '../components/Countdown.jsx'
import Finale from '../components/Finale.jsx'

export default function Home() {
  return (
    <main>
      <Hero />
      <BirthdayMessage />
      <Memories />
      <Reasons />
      <Countdown />
      <Finale />
    </main>
  )
}
