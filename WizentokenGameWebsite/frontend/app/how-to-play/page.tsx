// app/how-to-play/page.tsx
"use client"

import React from 'react'
import Navbar from '@/app/components/Navbar'

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center">📖 How to Play WZN Game</h1>

        {/* General Gameplay */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">General Gameplay Overview</h2>
          <p className="text-gray-300">
            WZN is a trick-taking card game for 2 to 4 players using a standard 52-card deck. Each round consists of 13 tricks. Players must follow suit if possible; otherwise they may play a trump or discard another card. The highest trump wins the trick, or if no trump was played, the highest card of the led suit wins. The winner of each trick leads the next.
          </p>
        </section>

        {/* Bidding & Modes */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Bidding & Game Mode Selection</h2>
          <p className="text-gray-300">
            Before play begins, players bid to choose the game mode. Each may pass or declare one of the available modes. The highest priority mode declared will be played. If no higher bid is made, "Geen Dames" (No Queens) runs by default.
          </p>
          <h3 className="text-xl font-semibold mt-4">Game Mode Priority (High → Low)</h3>
          <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
            <li>Trul (requires holding 3 Aces)</li>
            <li>Open Misère (Solo Slim)</li>
            <li>Misère / Pico</li>
            <li>Abondance (to 9 tricks) with trump / without trump</li>
            <li>Alleen Gaan (Go Alone)</li>
            <li>Vraag & Meegaan (Ask & Join)</li>
            <li>Geen Dames (No Queens)</li>
          </ul>
        </section>

        {/* Game Modes Details */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Game Modes</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Vraag & Meegaan (Ask & Join)</h3>
              <p className="text-gray-300">
                Team game: declarer partners with the holder of the trump ace. Goal: win at least 8 tricks. Trump determined by last card dealt.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Alleen Gaan (Go Alone)</h3>
              <p className="text-gray-300">
                Solo game: goal to win at least 5 tricks alone. Trump is last card dealt. Successful = +5 points, failure = -5.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Abondance (Naar 9 Gaan)</h3>
              <p className="text-gray-300">
                Solo game to 9 tricks. Declarer chooses trump (overrides last-card). Score: +5 for success, -5 for failure.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Misère</h3>
              <p className="text-gray-300">
                No tricks goal. Solo, no trump. Win zero tricks for +15; any trick = -15.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Open Misère (Solo Slim)</h3>
              <p className="text-gray-300">
                Misère with hands shown open. Goal zero tricks. Success = +30; failure = -30.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Pico</h3>
              <p className="text-gray-300">
                Solo goal to win exactly one trick. Success = +15; failure = -15.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Geen Dames (No Queens)</h3>
              <p className="text-gray-300">
                All play. Avoid capturing Queens. -3 per Queen taken; points shared among no-Queen takers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Trul</h3>
              <p className="text-gray-300">
                Special: requires 3 Aces. 4th Ace is trump. Team game with partner of trump Ace. Goal 8 tricks; points doubled or quadrupled if under tafel.
              </p>
            </div>
          </div>
        </section>

        {/* Trick-Taking & Scoring */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Trick-Taking Rules & Scoring</h2>
          <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
            <li>Follow suit if able; otherwise play trump or discard.</li>
            <li>Highest trump wins trick; if no trump, highest of led suit wins.</li>
            <li>Winner leads next trick.</li>
            <li>Collect slagen (tricks) in view; after 13, stack and afleggen reshuffles deck.</li>
          </ul>
        </section>

        {/* Special Notes */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Special Notes</h2>
          <p className="text-gray-300">
            Use visual trick stacks in UI for clarity. Consider adding leaderboards, Discord integration, and yearly tournaments. Players identified by wallet but can use display names in social settings.
          </p>
        </section>
      </main>
    </div>
  )
}
