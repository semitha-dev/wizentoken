"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Navbar from "@/app/components/Navbar"

export default function GameplayPage() {
  const params = useSearchParams()
  const gameId = params.get("gameId")
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [myPlayer, setMyPlayer] = useState<any>(null)    // this is players.id entry
  const [hand, setHand] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [moves, setMoves] = useState<any[]>([])
  const [game, setGame] = useState<any>(null)            // includes current_turn = players.id
  const [loading, setLoading] = useState(true)

  const API_BASE = "http://localhost:4000"

  useEffect(() => {
    async function init() {
      // 1) get session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push("/login")
        return
      }
      setUser(session.user)

      // 2) load this game's players
      const { data: p } = await supabase
        .from("players")
        .select("id, user_id, users(username)")
        .eq("game_id", gameId)
      setPlayers(p || [])

      // find your player row
      const me = p?.find((pl) => pl.user_id === session.user.id)
      if (!me) {
        alert("You are not part of this game.")
        router.push("/")
        return
      }
      setMyPlayer(me)

      // 3) **fetch your hand** & game using your **players.id** (not session.user.id)
      const res = await fetch(
        `${API_BASE}/game-state/${gameId}/${me.id}`
      )
      const data = await res.json()
      setHand(data.hand?.cards || [])
      setMoves(data.moves || [])
      setGame(data.game || {})
      setLoading(false)
    }

    init()
  }, [gameId, router])

  // subscribe to moves & current_turn updates
  useEffect(() => {
    if (!gameId) return
    const chan = supabase
      .channel(`game-${gameId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "moves", filter: `game_id=eq.${gameId}` },
        (payload) => setMoves((old: any[]) => [...old, payload.new])
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        (payload) => setGame((old: any) => ({ ...old, ...payload.new }))
      )
      .subscribe()
    return () => { supabase.removeChannel(chan) }
  }, [gameId])

  const playCard = async (card: any) => {
    // only when it's your players.id turn
    if (game.current_turn !== myPlayer.id) {
      alert("Not your turn!")
      return
    }
    const roundNumber = Math.floor(moves.length / 4) + 1
    const res = await fetch(`${API_BASE}/play-card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        playerId: myPlayer.id,
        card,
        roundNumber,
      }),
    })
    if (res.ok) {
      setHand((h) => h.filter((c) => !(c.suit === card.suit && c.rank === card.rank)))
    } else {
      const err = await res.json()
      alert(err.error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading…
      </div>
    )
  }

  // rotate so that index 0 is always you
  const idx = players.findIndex((p) => p.id === myPlayer.id)
  const rotated = idx >= 0 ? [...players.slice(idx), ...players.slice(0, idx)] : players
  const isMyTurn = game.current_turn === myPlayer.id

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <main className="relative flex-1 flex flex-col items-center justify-center">

        {/* Turn indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          {isMyTurn
            ? <span className="text-green-400 font-bold">✅ Your turn</span>
            : <span className="text-yellow-400 font-bold">⏳ Waiting</span>}
        </div>

        {/* Current trick */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold">Current Trick</h2>
            <div className="flex space-x-2">
              {moves.slice(-4).map((m, i) => (
                <div key={i} className="bg-gray-700 px-3 py-1 rounded">
                  {m.card.rank} {m.card.suit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opponents */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <PlayerCard player={rotated[1]} />
        </div>
        <div className="absolute left-8 top-1/2 -translate-y-1/2">
          <PlayerCard player={rotated[2]} />
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <PlayerCard player={rotated[3]} />
        </div>

        {/* Your hand */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {hand.map((card, i) => (
            <button
              key={i}
              onClick={() => playCard(card)}
              disabled={!isMyTurn}
              className={`px-3 py-1 rounded ${
                isMyTurn
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-600 cursor-not-allowed opacity-60"
              }`}
            >
              {card.rank} {card.suit}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

function PlayerCard({ player }: any) {
  if (!player) return null
  return (
    <div className="bg-gray-800 px-4 py-2 rounded">
      <strong>{player.users.username}</strong>
    </div>
  )
}
