import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import MusicToggle from './components/MusicToggle.jsx'

const sections = [
  { path: '/', label: 'Home', end: true },
  { path: '/love-story', label: 'Our Story' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/wishes', label: 'Wishes' },
]

export default function App() {
  return (
    <BrowserRouter>
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-[#3f0d0d] py-5 text-xs tracking-wide sm:gap-x-6 sm:py-6 sm:text-sm">
        {sections.map((s) => (
          <NavLink
            key={s.path}
            to={s.path}
            end={s.end}
            className={({ isActive }) =>
              isActive
                ? 'font-semibold text-rose-400'
                : 'text-blush-200/60 transition-colors hover:text-rose-300'
            }
          >
            {s.label}
          </NavLink>
        ))}
      </nav>
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
