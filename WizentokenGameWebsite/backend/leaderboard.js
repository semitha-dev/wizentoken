// backend/leaderboard-backend.js

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Dummy game records with wallet, win flag, and date
const gameRecords = [
  { wallet: '3b7X...9KpQ', won: true,  date: '2025-07-05' },
  { wallet: '3b7X...9KpQ', won: false, date: '2025-07-06' },
  { wallet: '3b7X...9KpQ', won: true,  date: '2025-07-15' },
  { wallet: 'F4dZ...02aR', won: true,  date: '2025-07-10' },
  { wallet: 'F4dZ...02aR', won: true,  date: '2025-07-21' },
  { wallet: 'J1cP...xLp9', won: false, date: '2025-07-02' },
  { wallet: 'J1cP...xLp9', won: true,  date: '2025-07-18' },
  { wallet: 'M9uQ...7NfT', won: true,  date: '2025-06-30' }, // Last month
  { wallet: 'Kb8V...3XyL', won: true,  date: '2025-07-08' },
  { wallet: 'Dp3R...5WmZ', won: false, date: '2025-07-12' },
  { wallet: 'L2sU...8GkN', won: true,  date: '2025-07-25' },
  { wallet: 'T7yE...1ZxC', won: false, date: '2025-07-03' },
  { wallet: 'R5hB...4QpM', won: false, date: '2025-07-14' },
  { wallet: 'Y8nL...6CjV', won: true,  date: '2025-07-22' },
];

// Utility: filter by current month (July 2025)
function isThisMonth(recordDate) {
  const date = new Date(recordDate);
  return date.getFullYear() === 2025 && date.getMonth() === 6; // month is 0-indexed
}

// GET /api/leaderboard?sort=[wins|winRate]
app.get('/api/leaderboard', (req, res) => {
  const sortKey = req.query.sort === 'winRate' ? 'winRate' : 'wins';

  // Aggregate stats per wallet for this month
  const stats = {};
  gameRecords.forEach(({ wallet, won, date }) => {
    if (!isThisMonth(date)) return;
    if (!stats[wallet]) stats[wallet] = { wallet, wins: 0, games: 0 };
    stats[wallet].games += 1;
    if (won) stats[wallet].wins += 1;
  });

  // Convert to array and compute winRate
  const leaderboard = Object.values(stats).map((p) => ({
    wallet: p.wallet,
    wins: p.wins,
    games: p.games,
    winRate: p.games > 0 ? p.wins / p.games : 0,
  }));

  // Sort
  leaderboard.sort((a, b) => {
    if (sortKey === 'winRate') return b.winRate - a.winRate;
    return b.wins - a.wins;
  });

  res.json({
    description: 'Only games this month are counted',
    data: leaderboard,
  });
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
    console.log(`🚀 Leaderboard server running on http://localhost:${PORT}`)
);