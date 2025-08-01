// backend/my-stats-backend.js

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Dummy game records (wallet, won flag, and date)
const gameRecords = [
  { wallet: '3b7X...9KpQ', won: true,  date: '2025-07-05' },
  { wallet: '3b7X...9KpQ', won: false, date: '2025-07-06' },
  { wallet: '3b7X...9KpQ', won: true,  date: '2025-07-15' },
  { wallet: 'F4dZ...02aR', won: true,  date: '2025-07-10' },
  { wallet: 'F4dZ...02aR', won: true,  date: '2025-07-21' },
  { wallet: 'J1cP...xLp9', won: false, date: '2025-07-02' },
  { wallet: 'J1cP...xLp9', won: true,  date: '2025-07-18' },
  { wallet: 'M9uQ...7NfT', won: true,  date: '2025-06-30' }, // last month
  { wallet: 'Kb8V...3XyL', won: true,  date: '2025-07-08' },
  { wallet: 'Dp3R...5WmZ', won: false, date: '2025-07-12' },
  { wallet: 'L2sU...8GkN', won: true,  date: '2025-07-25' },
  { wallet: 'T7yE...1ZxC', won: false, date: '2025-07-03' },
  { wallet: 'R5hB...4QpM', won: false, date: '2025-07-14' },
  { wallet: 'Y8nL...6CjV', won: true,  date: '2025-07-22' },
];

// Dummy wallet balances
const balances = {
  '3b7X...9KpQ': 500,
  'F4dZ...02aR': 300,
  'J1cP...xLp9': 200,
  'M9uQ...7NfT': 150,
  'Kb8V...3XyL': 100,
  'Dp3R...5WmZ': 250,
  'L2sU...8GkN': 50,
  'T7yE...1ZxC': 75,
  'R5hB...4QpM': 25,
  'Y8nL...6CjV': 10,
};

// Check if a record is in July 2025
function isThisMonth(recordDate) {
  const d = new Date(recordDate);
  return d.getFullYear() === 2025 && d.getMonth() === 6; // July is month index 6
}

// GET /api/stats/:wallet
app.get('/api/stats/:wallet', (req, res) => {
  const { wallet } = req.params;

  // Aggregate all-time and monthly stats
  const all = { wins: 0, games: 0 };
  const month = { wins: 0, games: 0 };
  gameRecords.forEach(({ wallet: w, won, date }) => {
    if (w !== wallet) return;
    all.games += 1;
    if (won) all.wins += 1;
    if (isThisMonth(date)) {
      month.games += 1;
      if (won) month.wins += 1;
    }
  });
  const allWinRate = all.games ? all.wins / all.games : 0;
  const monthWinRate = month.games ? month.wins / month.games : 0;

  // Build monthly leaderboard to compute rank
  const stats = {};
  gameRecords.forEach(({ wallet: w, won, date }) => {
    if (!isThisMonth(date)) return;
    if (!stats[w]) stats[w] = { wallet: w, wins: 0, games: 0 };
    stats[w].games += 1;
    if (won) stats[w].wins += 1;
  });
  const leaderboard = Object.values(stats)
    .map((p) => ({ ...p, winRate: p.games ? p.wins / p.games : 0 }))
    .sort((a, b) => b.winRate - a.winRate);
  const rankIndex = leaderboard.findIndex((p) => p.wallet === wallet);
  const rank = rankIndex >= 0 ? rankIndex + 1 : null;

  res.json({
    wallet,
    balance: balances[wallet] ?? 0,
    allTime: { ...all, winRate: allWinRate },
    thisMonth: { ...month, winRate: monthWinRate },
    rank,
  });
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`🚀 Stats API running on port ${PORT}`));
