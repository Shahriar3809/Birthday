import express from 'express'
import cors from 'cors'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import dotenv from 'dotenv'

// Read .env from the project root regardless of the process working directory
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

const app = express()
const PORT = process.env.PORT || 5000

const SERVER_ROOT = fileURLToPath(new URL('..', import.meta.url))
const PROJECT_ROOT = fileURLToPath(new URL('../..', import.meta.url))
const CLIENT_DIST = path.join(PROJECT_ROOT, 'client', 'dist')
const WISHES_FILE = path.join(SERVER_ROOT, 'wishes.json')

app.use(cors({ origin: true }))
app.use(express.json())

// In production, serve the built React app as static files.
// In development the Vite dev server (port 5173) proxies /api here instead.
app.use(express.static(CLIENT_DIST))

async function readWishes() {
  try {
    return JSON.parse(await fs.readFile(WISHES_FILE, 'utf8'))
  } catch {
    return []
  }
}

async function writeWishes(wishes) {
  await fs.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf8')
}

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from the shanta-birthday server',
    from: 'a very excited person',
  })
})

app.get('/api/wish', async (req, res) => {
  res.json(await readWishes())
})

app.post('/api/wish', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    return res.status(400).json({ error: 'Wish cannot be empty' })
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Wish is too long' })
  }

  const wish = {
    id: randomUUID(),
    message,
    createdAt: new Date().toISOString(),
  }

  const wishes = await readWishes()
  wishes.push(wish)
  await writeWishes(wishes)

  res.status(201).json({ success: true, wish })
})

// Any unknown /api route returns JSON 404 (not the SPA fallback)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// SPA fallback — client-side routes (/love-story, /gallery, ...) load index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`shanta-birthday server running on http://localhost:${PORT}`)
})
