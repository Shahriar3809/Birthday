import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import BrandBadge from './components/BrandBadge.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProgress />
      <BrandBadge />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/love-story" element={<ComingSoon title="Our Story" />} />
        <Route path="/gallery" element={<ComingSoon title="Gallery" />} />
        <Route path="/wishes" element={<ComingSoon title="Wishes" />} />
      </Routes>
      <MusicToggle />
    </BrowserRouter>
  )
}
