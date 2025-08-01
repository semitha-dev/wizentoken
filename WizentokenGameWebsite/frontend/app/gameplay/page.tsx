// app/gameplay/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import BidPanel from "@/app/components/BidPanel"
import PlayerAvatar from "@/app/components/PlayerAvatar"
import TrickPile from "@/app/components/TrickPile"
import Hand from "@/app/components/Hand"
import { useGame, Bid, CardType } from "@/app/hooks/useGame"
import type { Card as LogicCard } from "@/app/lib/gamelogic"

export default function GameplayPage() {
  const search = useSearchParams()
  const playersCount = parseInt(search.get("players") || "2", 10)

  // Local bid state
  const [localBid, setLocalBid] = useState<Bid>({ player: 0, mode: 'abondance', trump: '♠' })
  const trumpOptions: LogicCard['suit'][] = ['♠', '♥', '♦', '♣']

  // Manual score submission state
  const [lastSubmission, setLastSubmission] = useState<number | null>(null)
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  // Load last submission timestamp
  useEffect(() => {
    const ts = localStorage.getItem("last_score_submit")
    if (ts) setLastSubmission(parseInt(ts, 10))
  }, [])

  const canSubmit = !lastSubmission || Date.now() - lastSubmission > 5 * 60 * 1000

  const submitScoreManually = (won: boolean) => {
    if (!canSubmit && lastSubmission) {
      const remaining = Math.ceil((5 * 60 * 1000 - (Date.now() - lastSubmission)) / 1000)
      setAlertMsg(`Please wait ${remaining} seconds before submitting again.`)
      return
    }
    // Log to local leaderboard
    const lbRaw = localStorage.getItem("wzn_leaderboard") || "[]"
    const lb: Array<{ date: number; result: 'win' | 'loss' }> = JSON.parse(lbRaw)
    lb.push({ date: Date.now(), result: won ? 'win' : 'loss' })
    localStorage.setItem("wzn_leaderboard", JSON.stringify(lb))
    localStorage.setItem("last_score_submit", Date.now().toString())
    setLastSubmission(Date.now())
    setAlertMsg(won ? "Recorded as a win!" : "Recorded as a loss!")
  }

  // Game hook encapsulates all logic/state
  const {
    biddingComplete,
    bids,
    dealPreview,
    submitBid,
    hands,
    trickCards,
    turn,
    winnersHistory,
    playCard,
    names,
    declarerIdx,
    declarerBid,
    showSummary,
    summary,
    finishSummary
  } = useGame(playersCount, localBid)

  // Initial hand preview
  useEffect(() => {
    dealPreview()
  }, [dealPreview])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Bidding phase */}
      {!biddingComplete ? (
        <BidPanel
          localBid={localBid}
          trumpOptions={trumpOptions}
          onBidChange={(newBid: Bid) => setLocalBid(newBid)}
          onSubmit={submitBid}
          handPreview={hands[0] || []}
        />
      ) : (
        /* Main game phase */
        <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
          {/* Bids display */}
          <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded">
            {bids.map((b, i) => (
              <div key={i} className="text-sm">
                {names[b.player]}: {b.mode}{b.trump ? `(${b.trump})` : ''}
              </div>
            ))}
          </div>

          {/* Declarer info */}
          <div className="absolute top-4 left-4 bg-gray-800 p-2 rounded">
            <div>Declarer: {names[declarerIdx]}</div>
            <div>Contract: {declarerBid?.mode}{declarerBid?.trump ? `(${declarerBid.trump})` : ''}</div>
          </div>

          {/* Opponent avatars and scores */}
          {playersCount > 2 && (
            <PlayerAvatar position="top" name={names[2]} history={winnersHistory.map(w => w === 2)} />
          )}
          {playersCount > 1 && (
            <PlayerAvatar position="left" name={names[1]} history={winnersHistory.map(w => w === 1)} />
          )}
          {playersCount === 4 && (
            <PlayerAvatar position="right" name={names[3]} history={winnersHistory.map(w => w === 3)} />
          )}

          {/* Center trick pile */}
          <TrickPile cards={trickCards} />

          {/* Local hand with trick-history circles */}
          <div className="absolute bottom-20 w-full px-4">
            <PlayerAvatar position="bottom" name={names[0]} history={winnersHistory.map(w => w === 0)} />
          </div>
          <Hand cards={hands[0] || []} onPlay={(card: CardType) => playCard(0, card)} isTurn={turn === 0} />
        </div>
      )}

      {/* End-of-game summary modal with manual score submission */}
      {showSummary && summary && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-2xl text-center space-y-4">
            <h2 className="text-2xl font-bold">Game Over</h2>
            <p>Tricks Won: <strong>{hands[0]?.length}</strong></p>
            {alertMsg && <p className="text-yellow-400">{alertMsg}</p>}
            <div className="flex justify-center gap-4">
              <button
                disabled={!canSubmit}
                onClick={() => submitScoreManually(true)}
                className={`px-4 py-2 rounded-full ${canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}>
                I won
              </button>
              <button
                disabled={!canSubmit}
                onClick={() => submitScoreManually(false)}
                className={`px-4 py-2 rounded-full ${canSubmit ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'}`}>
                I lost
              </button>
            </div>
            <button
              onClick={finishSummary}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
