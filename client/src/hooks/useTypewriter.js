import { useEffect, useState } from 'react'

export default function useTypewriter(text, { speed = 95, startDelay = 600 } = {}) {
  const chars = Array.from(text)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(t)
  }, [started, startDelay])

  useEffect(() => {
    if (!started) return
    if (count >= chars.length) return
    const id = setInterval(() => setCount((c) => c + 1), speed)
    return () => clearInterval(id)
  }, [started, count, speed, chars.length])

  return {
    text: chars.slice(0, count).join(''),
    done: count >= chars.length,
  }
}
