// app/vote/page.tsx
"use client"

import { useState, useEffect } from "react"
import Navbar from "@/app/components/Navbar"

type Proposal = {
  id: string
  title: string
  description: string
  yesCount: number
  noCount: number
  status: "Upcoming" | "Active" | "Passed" | "Rejected"
}

export default function VotePage() {
  const initialProposals: Proposal[] = [
    {
      id: "p1",
      title: "Burn adjustment",
      description: "Reduce token burn rate from 2% to 1.5% to improve liquidity.",
      yesCount: 30,
      noCount: 5,
      status: "Passed",
    },
    {
      id: "p2",
      title: "DAO fund unlock condition",
      description: "Unlock 10,000 WZN from the vault when total staked > 50,000 WZN.",
      yesCount: 12,
      noCount: 3,
      status: "Active",
    },
    {
      id: "p3",
      title: "Allocate funds for community event",
      description: "Reserve 2,000 WZN for monthly community tournaments.",
      yesCount: 0,
      noCount: 0,
      status: "Upcoming",
    },
    {
      id: "p4",
      title: "Implement referral rewards",
      description: "Reward users with 50 WZN for each new referral.",
      yesCount: 7,
      noCount: 14,
      status: "Rejected",
    },
  ]

  const [proposals, setProposals] = useState<Proposal[]>([])
  const [voted, setVoted] = useState<Record<string, "yes" | "no">>({})

  useEffect(() => {
    setProposals(initialProposals)
    const stored = localStorage.getItem("dao_votes")
    if (stored) setVoted(JSON.parse(stored))
  }, [])

  const storeVoted = (newVoted: typeof voted) => {
    localStorage.setItem("dao_votes", JSON.stringify(newVoted))
    setVoted(newVoted)
  }

  const handleVote = (id: string, choice: "yes" | "no") => {
    if (voted[id]) return
    setProposals((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              yesCount: choice === "yes" ? p.yesCount + 1 : p.yesCount,
              noCount: choice === "no" ? p.noCount + 1 : p.noCount,
            }
          : p
      )
    )
    storeVoted({ ...voted, [id]: choice })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">📋 DAO Proposals</h1>

        {proposals.map((p) => {
          const totalVotes = p.yesCount + p.noCount
          const quorum = ((totalVotes / 100) * 100).toFixed(1)

          return (
            <div key={p.id} className="bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    p.status === "Upcoming"
                      ? "bg-blue-600 text-white"
                      : p.status === "Active"
                      ? "bg-yellow-500 text-black"
                      : p.status === "Passed"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-1 text-gray-300">{p.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleVote(p.id, "yes")}
                  disabled={!!voted[p.id]}
                  className={`px-4 py-2 rounded-full text-white transition ${
                    voted[p.id]
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Vote Yes ({p.yesCount})
                </button>
                <button
                  onClick={() => handleVote(p.id, "no")}
                  disabled={!!voted[p.id]}
                  className={`px-4 py-2 rounded-full text-white transition ${
                    voted[p.id]
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Vote No ({p.noCount})
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-400 space-y-1">
                <div>Quorum: {quorum}%</div>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
