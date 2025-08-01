// index.js
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

// --- In-memory “DB” ---
const dummyLeaderboard = [
  { wallet: '3b7X...9KpQ', wins: 25, games: 30 },
  { wallet: 'F4dZ...02aR', wins: 18, games: 22 },
  /* …more players… */
]

const dummyProposals = [
  { id: 'p1', title: 'Burn adjustment', status: 'Passed' },
  { id: 'p2', title: 'DAO fund unlock condition', status: 'Active' },
  { id: 'p3', title: 'Community event funding', status: 'Upcoming' },
]

const dummyAccess = {
  '3b7X...9KpQ': { burned: 120, quota: 5 },
  'F4dZ...02aR': { burned: 30, quota: 2 },
}

// --- Routes ---

// 1) Leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json(dummyLeaderboard)
})

// 2) DAO proposals
app.get('/api/proposals', (req, res) => {
  res.json(dummyProposals)
})

// 3) Access / burn history per wallet
app.get('/api/access/:wallet', (req, res) => {
  const { wallet } = req.params
  const record = dummyAccess[wallet] || { burned: 0, quota: 0 }
  res.json(record)
})

// 4) (Optional) a catch-all for testing
app.get('/api/ping', (req, res) => res.send('pong'))

// --- Start server ---
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Listening on http://localhost:${PORT}`))
