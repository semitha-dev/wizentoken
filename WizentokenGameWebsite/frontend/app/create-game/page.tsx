"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import { supabase } from "@/lib/supabaseClient"

export default function CreateGamePage() {
  const router = useRouter()
  const API_BASE = "http://localhost:4000" // backend base URL

  const [gameName, setGameName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [gameId, setGameId] = useState<string | null>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any | null>(null)

  // Get current user + profile
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("id, username, wallet")
          .eq("id", session.user.id)
          .single()
        if (!error && data) setCurrentUser(data)
      }
    }
    getUser()
  }, [])

  // Restore from localStorage
  useEffect(() => {
    const savedGameId = localStorage.getItem("gameId")
    const savedGameName = localStorage.getItem("gameName")
    if (savedGameId && savedGameName) {
      setGameId(savedGameId)
      setGameName(savedGameName)
    }
  }, [])

  // Subscribe to players in current game
  useEffect(() => {
    if (!gameId) return
    let mounted = true

    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("id, user_id, users(username, wallet)")
        .eq("game_id", gameId)
      if (!error && mounted) setPlayers(data || [])
    }
    fetchPlayers()

    const channel = supabase
      .channel(`players-for-${gameId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `game_id=eq.${gameId}` },
        fetchPlayers
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [gameId])

  const handleCreateGame = async () => {
    if (!gameName || !password || !currentUser) {
      setError("Game name and password are required")
      return
    }
    setLoading(true)
    setError(null)

    // 1) create game with status "waiting"
    const { data: g, error: ge } = await supabase
      .from("games")
      .insert([{ name: gameName, password, current_player: 1, status: "waiting" }])
      .select()
      .single()

    if (ge || !g?.id) {
      setError(ge?.message || "Could not create game")
      setLoading(false)
      return
    }

    localStorage.setItem("gameId", g.id)
    localStorage.setItem("gameName", gameName)
    setGameId(g.id)

    // 2) add host as player
    const { data: p, error: pe } = await supabase
      .from("players")
      .insert([{ game_id: g.id, user_id: currentUser.id }])
      .select("id, user_id, users(username, wallet)")
      .single()

    if (pe || !p) setError(pe?.message || "Could not add host as player")
    else setPlayers((prev) => [...prev, p])

    setLoading(false)
  }

  // Host sets game status and calls backend
  const handleStartGame = async () => {
    if (!gameId) return
    setLoading(true)

    try {
      // 1) Flip status in Supabase (triggers realtime for joiners)
      const { error } = await supabase
        .from("games")
        .update({ status: "active" })
        .eq("id", gameId)

      if (error) {
        alert("Failed to update game status: " + error.message)
        setLoading(false)
        return
      }

      // 2) Call backend to deal cards and set trump
      const res = await fetch(`${API_BASE}/start-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert("Backend failed to start game: " + err.error)
        setLoading(false)
        return
      }

      const data = await res.json()
      console.log("Game started:", data)

      router.push(`/gameplay?gameId=${gameId}`)
    } catch (err) {
      console.error("Error starting game:", err)
      alert("Unexpected error starting game")
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveLobby = async () => {
    if (!gameId) return
    const { error: delErr } = await supabase.from("games").delete().eq("id", gameId)

    if (delErr) {
      console.error("Error deleting game:", delErr)
      alert("Failed to delete game: " + delErr.message)
      return
    }

    localStorage.removeItem("gameId")
    localStorage.removeItem("gameName")
    setGameId(null)
    setGameName("")
    setPlayers([])
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8">
        {!gameId ? (
          <>
            <h1 className="text-3xl font-bold">Create a Game</h1>
            {!currentUser ? (
              <p className="text-red-400">🔒 Please log in to create a game.</p>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Game Name"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                />
                <p className="text-green-400">
                  Logged in as: <strong>{currentUser.username}</strong>
                </p>
              </div>
            )}
            {error && <p className="text-red-400">{error}</p>}
            <button
              onClick={handleCreateGame}
              disabled={!currentUser || loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Confirm & Create"}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Game Lobby: {gameName}</h1>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg mb-2">Players Joined ({players.length}/4)</h2>
              <ul className="space-y-2">
                {players.map((p) => (
                  <li key={p.id} className="bg-gray-700 px-3 py-2 rounded">
                    <p><strong>{p.users?.username}</strong></p>
                    <p className="text-sm text-gray-300">{p.users?.wallet || "No wallet linked"}</p>
                  </li>
                ))}
              </ul>
            </div>
            {players.length === 4 && (
              <button
                onClick={handleStartGame}
                disabled={loading}
                className="mt-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Starting..." : "Confirm & Start"}
              </button>
            )}
            <button
              onClick={handleLeaveLobby}
              className="mt-4 text-red-500 underline"
            >
              Leave Lobby (Delete Game)
            </button>
          </>
        )}
      </main>
    </div>
  )
}
