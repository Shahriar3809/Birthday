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

// ============================================================
// Settings — singleton document for app-wide configuration
// (currently just the birthday moment). key:'singleton' keeps
// at most one document; app falls back to the static config
// in the client if none exists yet.
// ============================================================
const Settings = mongoose.model(
  'Settings',
  new mongoose.Schema({
    key: { type: String, default: 'singleton', unique: true },
    birthdayDate: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  }),
)

function isDbConnected() {
  return mongoose.connection.readyState === 1
}

// Shared admin guard — password from env, passed via x-admin-password header.
function isAdminRequest(req) {
  const adminPassword = process.env.ADMIN_PASSWORD
  return !!adminPassword && req.get('x-admin-password') === adminPassword
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
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'ADMIN_PASSWORD not configured' })
  if (!isAdminRequest(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (!isDbConnected()) return res.status(503).json({ error: 'Database not connected' })

  const wishes = await Wish.find().sort({ submittedAt: -1 }).lean()
  res.json(wishes.map(serializeWish))
})

// Public: read the server-configured birthday moment (ISO string or null).
// Client falls back to its static data/birthday.js config when this is null/unreachable.
app.get('/api/settings/birthday', async (req, res) => {
  if (!isDbConnected()) return res.status(503).json({ error: 'Database not connected' })

  const settings = await Settings.findOne({ key: 'singleton' }).lean()
  res.json({ birthdayDate: settings?.birthdayDate ? settings.birthdayDate.toISOString() : null })
})

// Admin: set the birthday moment (an ISO date-time string).
app.put('/api/admin/settings/birthday', async (req, res) => {
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'ADMIN_PASSWORD not configured' })
  if (!isAdminRequest(req)) return res.status(401).json({ error: 'Unauthorized' })
  if (!isDbConnected()) return res.status(503).json({ error: 'Database not connected' })

  const raw = req.body?.birthdayDate
  const date = new Date(raw)
  if (!raw || Number.isNaN(date.getTime())) {
    return res.status(400).json({ error: 'birthdayDate must be a valid date string' })
  }

  try {
    await Settings.findOneAndUpdate(
      { key: 'singleton' },
      { key: 'singleton', birthdayDate: date, updatedAt: new Date() },
      { upsert: true },
    )
    res.json({ birthdayDate: date.toISOString() })
  } catch (err) {
    console.error('Failed to save settings:', err)
    res.status(500).json({ error: 'Could not save settings' })
  }
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
