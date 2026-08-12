import Hero from '../components/Hero.jsx'
import BirthdayMessage from '../components/BirthdayMessage.jsx'
import Memories from '../components/Memories.jsx'
import Reasons from '../components/Reasons.jsx'
import Countdown from '../components/Countdown.jsx'
import Finale from '../components/Finale.jsx'
import VideoMessage from '../components/VideoMessage.jsx'

export default function Home({ revealed = true, onOpen }) {
  return (
    <main>
      <Hero onOpen={onOpen} />
      {revealed && (
        <>
          <BirthdayMessage />
          <Memories />
          <Reasons />
          <Countdown />
          <VideoMessage />
          <Finale />
        </>
      )}
    </main>
  )
}
