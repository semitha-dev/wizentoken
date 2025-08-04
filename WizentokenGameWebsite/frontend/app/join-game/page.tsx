"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Navbar from "@/app/components/Navbar"
import { Loader2, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function JoinGamePage() {
  const router = useRouter()
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [currentGame, setCurrentGame] = useState<any | null>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [gameStatus, setGameStatus] = useState("waiting")

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("id, username")
          .eq("id", session.user.id)
          .single()
        if (!error && data) setCurrentUser(data)
      }
    }
    getUser()
  }, [])

  // Restore currentGame from localStorage if page is refreshed
  useEffect(() => {
    const savedGameId = localStorage.getItem("currentGameId")
    if (savedGameId) {
      supabase
        .from("games")
        .select("*")
        .eq("id", savedGameId)
        .single()
        .then(({ data }) => {
          if (data) setCurrentGame(data)
        })
    }
  }, [])

  // Fetch waiting games
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("games")
        .select("id, name, status, created_at")
        .eq("status", "waiting")
        .order("created_at", { ascending: false })
      if (!error && data) setGames(data)
      setLoading(false)
    }
    fetchGames()
    const interval = setInterval(fetchGames, 5000)
    return () => clearInterval(interval)
  }, [])

  // Load lobby & subscribe to updates
  useEffect(() => {
    if (!currentGame) return

    const loadLobby = async () => {
      const { data: playersData } = await supabase
        .from("players")
        .select("id, user_id, users(username)")
        .eq("game_id", currentGame.id)
      setPlayers(playersData || [])

      const { data: gameData } = await supabase
        .from("games")
        .select("status")
        .eq("id", currentGame.id)
        .single()
      if (gameData) setGameStatus(gameData.status)
    }

    loadLobby()

    const channel = supabase
      .channel(`lobby-${currentGame.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `game_id=eq.${currentGame.id}` },
        loadLobby
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${currentGame.id}` },
        (payload) => {
          setGameStatus(payload.new.status)
          if (payload.new.status === "active") {
            router.push(`/gameplay?gameId=${currentGame.id}`)
          }
        }
      )
      .subscribe()

    // Polling fallback
    const pollInterval = setInterval(loadLobby, 3000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [currentGame, router])

  const handleJoinGame = async (game: any) => {
    if (!currentUser) {
      alert("🔒 Please log in first.")
      return
    }
    setJoining(true)

    const { error: insertErr } = await supabase
      .from("players")
      .insert([{ game_id: game.id, user_id: currentUser.id }])

    if (insertErr) {
      console.error("Error joining game:", insertErr)
      alert("Failed to join: " + insertErr.message)
      setJoining(false)
      return
    }

    setCurrentGame(game)
    localStorage.setItem("currentGameId", game.id)
    setJoining(false)
  }

  const handleLeaveGame = async () => {
    if (!currentGame || !currentUser) return

    await supabase
      .from("players")
      .delete()
      .match({ game_id: currentGame.id, user_id: currentUser.id })

    localStorage.removeItem("currentGameId")
    setPlayers([])
    setCurrentGame(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {!currentGame ? (
          <section>
            <h1 className="text-3xl font-bold text-center mb-8">🎮 Available Games</h1>
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin text-yellow-400" size={36} />
                <span className="ml-3 text-yellow-400">Loading...</span>
              </div>
            ) : games.length === 0 ? (
              <p className="text-center text-gray-400">No waiting games.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {games.map((g) => (
                  <div key={g.id} className="bg-gray-800 p-5 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users size={24} className="text-indigo-400" />
                      <h3 className="text-lg font-semibold">{g.name}</h3>
                    </div>
                    <p className="text-sm mb-2">Status: {g.status}</p>
                    <p className="text-xs mb-4">Joined: {players.length}/4</p>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                      onClick={() => handleJoinGame(g)}
                      disabled={joining}
                    >
                      {joining ? "Joining..." : "Join"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <h1 className="text-2xl font-bold text-center mb-6">Lobby: {currentGame.name}</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg mb-4">Players Joined ({players.length}/4)</h2>
              <ul className="space-y-2">
                {players.map((p) => (
                  <li key={p.id} className="bg-gray-700 px-4 py-2 rounded">
                    {p.users?.username}
                  </li>
                ))}
              </ul>
              {gameStatus === "waiting" && (
                <p className="mt-6 text-yellow-400 text-center font-semibold animate-pulse">
                  ⏳ Waiting for host…
                </p>
              )}
              {gameStatus === "active" && (
                <p className="mt-6 text-green-400 text-center font-semibold animate-pulse">
                  🚀 Game starting!
                </p>
              )}
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                  onClick={handleLeaveGame}
                >
                  Leave Game
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
