// app/select-mode/page.tsx
"use client"

import React, { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import ModeCard from "@/app/components/ModeCard"
import Navbar from "@/app/components/Navbar"
import { Users } from "lucide-react"
import Image from "next/image"

const gameModes = [
  { name: "Vraag & Meegaan", icon: "/icons/ask.png", desc: "Team-based. Declarer teams up with trump ace holder. Win 8+ tricks." },
  { name: "Alleen Gaan", icon: "/icons/solo.png", desc: "Solo. Win 5+ tricks. Trump is last dealt card." },
  { name: "Abondance", icon: "/icons/abondance.png", desc: "Solo. Choose your trump suit. Win 9 tricks." },
  { name: "Misère", icon: "/icons/misere.png", desc: "No trump. Win zero tricks to succeed." },
  { name: "Open Misère", icon: "/icons/open_misere.png", desc: "Reveal your hand. Win zero tricks with open cards." },
  { name: "Pico", icon: "/icons/pico.png", desc: "Win exactly one trick. No trump." },
  { name: "Geen Dames", icon: "/icons/no_queen.png", desc: "Avoid taking queens. -3 pts per queen." },
  { name: "Troel", icon: "/icons/troel.png", desc: "3 aces triggers Troel. Partner joins. Win 8 tricks." },
]

export default function SelectModePage() {
  const { connected } = useWallet()
  const [waitingMode, setWaitingMode] = useState<string | null>(null)

  const handleSelectMode = (name: string) => {
    if (!connected) return
    setWaitingMode(name)
    setTimeout(() => {
      alert(`${name} mode starting (mocked)`)
      setWaitingMode(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Player Count Section */}
        <section>
          <h1 className="text-3xl font-bold text-center mb-8">Choose Player Count</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* 2 Players Card */}
            <div className={`${!connected ? "opacity-50 pointer-events-none" : ""}`}>  
              <ModeCard
                href={connected ? "/select-mode/host-or-join?players=2" : "#"}
                title="2 Players"
                description="2P: Classic Head-to-Head"
                gradient="from-indigo-600 to-pink-500"
                Icon={Users}
              />
            </div>
            {/* 4 Players Card */}
            <div className={`${!connected ? "opacity-50 pointer-events-none" : ""}`}>  
              <ModeCard
                href={connected ? "/select-mode/host-or-join?players=4" : "#"}
                title="4 Players"
                description="4P: Ranked Multiplayer Room"
                gradient="from-purple-500 to-pink-500"
                Icon={Users}
              />
            </div>
          </div>
          {!connected && (
            <p className="text-center text-yellow-400 mt-4">
              🔒 Connect your wallet to choose a player count
            </p>
          )}
        </section>

        {/* Game Mode Options Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">🎯 Game Mode Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gameModes.map((mode) => (
              <button
                key={mode.name}
                onClick={() => handleSelectMode(mode.name)}
                disabled={!connected}
                className={
                  `relative bg-gray-800 text-left border border-gray-700 rounded-xl p-4 flex flex-col items-center transition transform ` +
                  `${connected ? "hover:shadow-lg hover:scale-105 hover:bg-gray-700" : "opacity-60 cursor-not-allowed"}`
                }
              >
                <Image
                  src={mode.icon}
                  alt={mode.name}
                  width={60}
                  height={60}
                  className="mb-3 group-hover:animate-pulse"
                />
                <h3 className="text-lg font-semibold mb-1">{mode.name}</h3>
                <p className="text-sm text-gray-300">{mode.desc}</p>
              </button>
            ))}
          </div>

          {waitingMode && (
            <div className="mt-8 text-center text-yellow-400 animate-pulse border border-yellow-600 bg-yellow-900 bg-opacity-10 p-4 rounded-lg">
              ⏳ Waiting for other players to join <strong>{waitingMode}</strong>...
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
