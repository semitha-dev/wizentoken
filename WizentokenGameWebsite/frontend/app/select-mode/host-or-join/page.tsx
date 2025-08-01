"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"

export default function HostOrJoinPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const players = searchParams.get("players") ?? "2"

  const handleHost = () => {
    router.push(`/create-game?players=${players}`)
  }

  const handleJoin = () => {
    router.push(`/join-game?players=${players}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-center">
        <h1 className="text-3xl font-bold">{players}-Player Mode</h1>
        <div className="flex justify-center gap-8 mt-8">
          <button
            onClick={handleHost}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg shadow-lg transition"
          >
            Host Game
          </button>
          <button
            onClick={handleJoin}
            className="bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg shadow-lg transition"
          >
            Join Game
          </button>
        </div>
      </main>
    </div>
  )
}
