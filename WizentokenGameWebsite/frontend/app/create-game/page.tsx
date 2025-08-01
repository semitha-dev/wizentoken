"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"

export default function CreateGamePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const playersParam = searchParams.get("players") ?? "2"
  const playersCount = parseInt(playersParam, 10)

  const handleConfirm = () => {
    router.push(`/gameplay?players=${playersCount}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8">
        <h1 className="text-3xl font-bold">
          Create a {playersCount}-Player Game
        </h1>
        <p className="text-gray-400">
          You are about to host a {playersCount}-player session. Click confirm to start the game.
        </p>
        <button
          onClick={handleConfirm}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition"
        >
          Confirm & Start
        </button>
      </main>
    </div>
  )
}