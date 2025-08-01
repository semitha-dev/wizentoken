"use client"

import React, { useState } from "react"
import Navbar from "@/app/components/Navbar"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

type Player = {
  wallet: string
  wins: number
  games: number
}

const allTimeData: Player[] = [
  { wallet: "3b7X...9KpQ", wins: 25, games: 30 },
  { wallet: "F4dZ...02aR", wins: 18, games: 22 },
  { wallet: "J1cP...xLp9", wins: 15, games: 20 },
  { wallet: "M9uQ...7NfT", wins: 12, games: 18 },
  { wallet: "Kb8V...3XyL", wins: 10, games: 25 },
  { wallet: "Dp3R...5WmZ", wins: 8, games: 16 },
  { wallet: "L2sU...8GkN", wins: 6, games: 14 },
  { wallet: "T7yE...8GkN", wins: 4, games: 10 },
  { wallet: "R5hB...4QpM", wins: 2, games: 5 },
  { wallet: "Y8nL...6CjV", wins: 1, games: 3 },
]

const filters = ["This Month", "All-Time", "Past Champions"] as const
type Filter = typeof filters[number]

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<Filter>("This Month")

  // For now we always show allTimeData
  const data = [...allTimeData].sort((a, b) => b.wins - a.wins)
  const total = data.length
  const topCount = Math.max(1, Math.ceil(total * 0.05))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>

        {/* Dropdown filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-gray-300">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="bg-gray-700 text-gray-200 px-3 py-1 rounded"
          >
            {filters.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-4">Rank</th>
                <th className="py-2 px-4">Wallet</th>
                <th className="py-2 px-4">Games Won</th>
                <th className="py-2 px-4">Win %</th>
                <th className="py-2 px-4">Prize</th>
              </tr>
            </thead>

            <tbody>
              {data.map((p, idx) => {
                const winPct = ((p.wins / p.games) * 100).toFixed(1)
                const isTop = idx < topCount

                // Medal icons for top 3
                let rankDisplay: React.ReactNode = idx + 1
                if (idx === 0) rankDisplay = <>🥇 {1}</>
                if (idx === 1) rankDisplay = <>🥈 {2}</>
                if (idx === 2) rankDisplay = <>🥉 {3}</>

                // Prize for top 3
                let prize = ""
                if (idx === 0) prize = "500 WZN"
                else if (idx === 1) prize = "300 WZN"
                else if (idx === 2) prize = "100 WZN"

                return (
                  <tr
                    key={p.wallet}
                    className={`${isTop ? "bg-yellow-700 bg-opacity-30" : ""} hover:bg-gray-800`}
                  >
                    {/* Rank with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <td className="py-2 px-4 font-medium">
                          {rankDisplay}
                        </td>
                      </TooltipTrigger>
                      {isTop && (
                        <TooltipContent>
                          <span>Top 5% get rewards</span>
                        </TooltipContent>
                      )}
                    </Tooltip>

                    <td className="py-2 px-4 font-mono break-all">{p.wallet}</td>
                    <td className="py-2 px-4">{p.wins}</td>
                    <td className="py-2 px-4">{winPct}%</td>
                    <td className="py-2 px-4">{prize && <>🎖️ {prize}</>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="text-gray-400 text-sm">
          Showing <b>{filter}</b> (mock data). Top 5% are highlighted.
        </p>
      </main>
    </div>
  )
}
