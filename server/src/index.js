import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Read .env from the project root regardless of the process working directory
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

const SERVER_ROOT = fileURLToPath(new URL('..', import.meta.url))
const PROJECT_ROOT = fileURLToPath(new URL('../..', import.meta.url))
const CLIENT_DIST = path.join(PROJECT_ROOT, 'client', 'dist')

app.use(cors({ origin: true }))
app.use(express.json())

// In production, serve the built React app as static files.
// In development the Vite dev server (port 5173) proxies /api here instead.
app.use(express.static(CLIENT_DIST))

// ============================================================
// MongoDB (Atlas) connection
// ============================================================
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection failed:', err.message))
} else {
  console.warn('MONGODB_URI not set — /api/wish endpoints will return 503')
}

const Wish = mongoose.model(
  'Wish',
  new mongoose.Schema({
    name: { type: String, default: 'Shanta', trim: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    submittedAt: { type: Date, default: Date.now },
  }),
)

function serializeWish(doc) {
  return {
    id: String(doc._id),
    name: doc.name || 'Shanta',
    message: doc.message,
    submittedAt: doc.submittedAt.toISOString(),
  }
}

function isDbConnected() {
  return mongoose.connection.readyState === 1
}

// ============================================================
// API
// ============================================================
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the shanta-birthday server', from: 'a very excited person' })
})

app.get('/api/wish', async (req, res) => {
  if (!isDbConnected()) return res.status(503).json({ error: 'Database not connected' })
  const wishes = await Wish.find().sort({ submittedAt: -1 }).lean()
  res.json(wishes.map(serializeWish))
})

app.post('/api/wish', async (req, res) => {
  if (!isDbConnected()) return res.status(503).json({ error: 'Database not connected' })

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  const name = typeof req.body?.name === 'string' && req.body.name.trim() ? req.body.name.trim() : 'Shanta'

  if (!message) return res.status(400).json({ error: 'Wish cannot be empty' })
  if (message.length > 2000) return res.status(400).json({ error: 'Wish is too long' })

  try {
    const wish = await Wish.create({ name, message })
    res.status(201).json({ success: true, wish: serializeWish(wish) })
  } catch (err) {
    console.error('Failed to save wish:', err)
    res.status(500).json({ error: 'Could not save wish' })
  }
})

// Admin: list wishes (password from env). Simple header auth — good enough here.
app.get('/api/admin/wishes', async (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return res.status(503).json({ error: 'ADMIN_PASSWORD not configured' })

  if (req.get('x-admin-password') !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (!isDbConnected()) return res.status(503).json({ error: 'Database not connected' })

  const wishes = await Wish.find().sort({ submittedAt: -1 }).lean()
  res.json(wishes.map(serializeWish))
})

// Any unknown /api route returns JSON 404 (not the SPA fallback)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// SPA fallback — client-side routes (/love-story, /gallery, /admin-wishes, ...) load index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`shanta-birthday server running on http://localhost:${PORT}`)
})
