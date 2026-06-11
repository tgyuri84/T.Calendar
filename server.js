import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { google } from 'googleapis'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const port = Number(process.env.PORT || 3000)
const frontendUrl = process.env.FRONTEND_URL || ''
const corsOrigins = (process.env.CORS_ORIGIN || frontendUrl || '*')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)
const dbPath = process.env.DB_PATH || path.join(__dirname, 'hearth.db')
fs.mkdirSync(path.dirname(dbPath), { recursive: true })
const db = new DatabaseSync(dbPath)
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
}

loadEnv()
initDb()

function loadEnv() {
  const envPath = path.join(__dirname, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const index = trimmed.indexOf('=')
    if (index === -1) return
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (!process.env[key]) process.env[key] = value
  })
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS google_tokens (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  })
  res.end(body)
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin
  if (!origin) return
  const allowAny = corsOrigins.includes('*')
  const allowed = allowAny || corsOrigins.includes(origin)
  if (!allowed) return
  res.setHeader('Access-Control-Allow-Origin', allowAny ? '*' : origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')
}

function getFrontendRedirect() {
  if (!frontendUrl) return '/?google=connected'
  return `${frontendUrl.replace(/\/$/, '')}/?google=connected`
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 5_000_000) {
        req.destroy()
        reject(new Error('Request too large'))
      }
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${port}/auth/google/callback`
  if (!clientId || !clientSecret) return null
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  const row = db.prepare('SELECT value FROM google_tokens WHERE id = 1').get()
  if (row) client.setCredentials(JSON.parse(row.value))
  return client
}

function getGoogleStatus() {
  return Boolean(db.prepare('SELECT value FROM google_tokens WHERE id = 1').get())
}

function unfoldIcs(text) {
  return text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/)
}

function parseIcsDate(value = '') {
  const clean = value.replace(/^VALUE=DATE:/, '').replace(/^[^:]+:/, '')
  if (/^\d{8}$/.test(clean)) return { date: `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`, time: '' }
  const match = clean.match(/(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?/)
  if (!match) return { date: '', time: '' }
  return {
    date: `${match[1]}-${match[2]}-${match[3]}`,
    time: match[4] && match[5] ? `${match[4]}:${match[5]}` : ''
  }
}

function getIcsValue(line) {
  const index = line.indexOf(':')
  if (index === -1) return ''
  return line.slice(index + 1).replace(/\\,/g, ',').replace(/\\n/g, ' ').trim()
}

function parseIcsEvents(text, profileId) {
  const lines = unfoldIcs(text)
  const events = []
  let current = null
  lines.forEach(line => {
    if (line === 'BEGIN:VEVENT') current = {}
    else if (line === 'END:VEVENT' && current) {
      const start = parseIcsDate(current.dtstart || '')
      if (start.date) {
        events.push({
          id: `ical-${current.uid || crypto.randomUUID()}`,
          title: current.summary || 'URL naptár esemény',
          date: start.date,
          time: start.time,
          profileId,
          source: 'ical-url'
        })
      }
      current = null
    } else if (current && line.startsWith('UID')) current.uid = getIcsValue(line)
    else if (current && line.startsWith('SUMMARY')) current.summary = getIcsValue(line)
    else if (current && line.startsWith('DTSTART')) current.dtstart = line
  })
  return events.slice(0, 250)
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, googleConnected: getGoogleStatus() })
    return true
  }

  if (url.pathname === '/api/state' && req.method === 'GET') {
    const rows = db.prepare('SELECT key, value FROM app_state').all()
    const state = {}
    rows.forEach(row => {
      try {
        state[row.key] = JSON.parse(row.value)
      } catch {
        state[row.key] = null
      }
    })
    sendJson(res, 200, { ok: true, state })
    return true
  }

  if (url.pathname === '/api/state' && req.method === 'POST') {
    const parsed = JSON.parse(await readBody(req) || '{}')
    const state = parsed.state || {}
    const stmt = db.prepare('INSERT INTO app_state (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP')
    Object.entries(state).forEach(([key, value]) => stmt.run(key, JSON.stringify(value)))
    sendJson(res, 200, { ok: true })
    return true
  }

  if (url.pathname === '/api/google/status') {
    sendJson(res, 200, { ok: true, connected: getGoogleStatus(), configured: Boolean(getOAuthClient()) })
    return true
  }

  if (url.pathname === '/auth/google') {
    const client = getOAuthClient()
    if (!client) {
      sendJson(res, 400, { ok: false, error: 'Google OAuth nincs konfigurálva. Töltsd ki a .env fájlt.' })
      return true
    }
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar.readonly']
    })
    res.writeHead(302, { Location: authUrl })
    res.end()
    return true
  }

  if (url.pathname === '/auth/google/callback') {
    const client = getOAuthClient()
    if (!client) {
      sendJson(res, 400, { ok: false, error: 'Google OAuth nincs konfigurálva.' })
      return true
    }
    const code = url.searchParams.get('code')
    if (!code) {
      sendJson(res, 400, { ok: false, error: 'Hiányzó code paraméter.' })
      return true
    }
    const { tokens } = await client.getToken(code)
    db.prepare('INSERT INTO google_tokens (id, value, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP').run(JSON.stringify(tokens))
    res.writeHead(302, { Location: getFrontendRedirect() })
    res.end()
    return true
  }

  if (url.pathname === '/api/google/events') {
    const client = getOAuthClient()
    if (!client) {
      sendJson(res, 400, { ok: false, error: 'Google OAuth nincs konfigurálva.' })
      return true
    }
    if (!getGoogleStatus()) {
      sendJson(res, 401, { ok: false, error: 'Google Calendar nincs csatlakoztatva.' })
      return true
    }
    const calendar = google.calendar({ version: 'v3', auth: client })
    const timeMin = new Date()
    const timeMax = new Date()
    timeMax.setMonth(timeMax.getMonth() + 3)
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250
    })
    const events = (result.data.items || []).map(item => {
      const start = item.start?.dateTime || item.start?.date || ''
      const date = start.slice(0, 10)
      const time = item.start?.dateTime ? start.slice(11, 16) : ''
      return {
        id: `google-${item.id}`,
        title: item.summary || 'Google esemény',
        date,
        time,
        profileId: '',
        source: 'google'
      }
    }).filter(item => item.date)
    sendJson(res, 200, { ok: true, events })
    return true
  }

  if (url.pathname === '/api/calendar-url' && req.method === 'POST') {
    const parsed = JSON.parse(await readBody(req) || '{}')
    const calendarUrl = parsed.url || ''
    if (!/^https?:\/\//i.test(calendarUrl)) {
      sendJson(res, 400, { ok: false, error: 'Csak http/https naptár URL importálható.' })
      return true
    }
    const response = await fetch(calendarUrl, { headers: { Accept: 'text/calendar,text/plain,*/*' } })
    if (!response.ok) {
      sendJson(res, 400, { ok: false, error: 'A naptár URL nem érhető el.' })
      return true
    }
    const body = await response.text()
    const events = parseIcsEvents(body, parsed.profileId || '')
    sendJson(res, 200, { ok: true, events })
    return true
  }

  return false
}

function serveStatic(req, res, url) {
  const requestPath = url.pathname === '/' ? '/index.html' : url.pathname
  const safePath = path.normalize(requestPath).replace(/^([/\\])+/, '')
  const filePath = path.join(__dirname, safePath)
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' })
    res.end(content)
  })
}

const server = http.createServer(async (req, res) => {
  try {
    setCorsHeaders(req, res)
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }
    const url = new URL(req.url, `http://${req.headers.host}`)
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
      const handled = await handleApi(req, res, url)
      if (handled) return
    }
    serveStatic(req, res, url)
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message })
  }
})

server.listen(port, () => {
  console.log(`Hearth Display Home fut: http://localhost:${port}`)
})
