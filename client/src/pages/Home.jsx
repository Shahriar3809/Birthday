import Hero from '../components/Hero.jsx'
import BirthdayMessage from '../components/BirthdayMessage.jsx'
import Memories from '../components/Memories.jsx'
import Reasons from '../components/Reasons.jsx'
import Countdown from '../components/Countdown.jsx'
import Finale from '../components/Finale.jsx'
import VideoMessage from '../components/VideoMessage.jsx'

export default function Home() {
  return (
    <main>
      <Hero />
      <BirthdayMessage />
      <Memories />
      <Reasons />
      <Countdown />
      <VideoMessage />
      <Finale />
      
    </main>
  )
}
