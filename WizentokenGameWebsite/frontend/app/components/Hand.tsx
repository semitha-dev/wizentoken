// components/Hand.tsx
import React from 'react'
import type { Card as LogicCard } from '@/app/lib/gamelogic'
import Card from './Card'

type CardType = { rank: LogicCard['rank']; suit: LogicCard['suit'] }

interface HandProps {
  cards: CardType[]
  onPlay: (card: CardType) => void
  isTurn: boolean
}

export default function Hand({ cards, onPlay, isTurn }: HandProps) {
  return (
    <div className="absolute bottom-4 left-0 w-full px-4 overflow-x-auto">
      <div className="flex justify-center space-x-2">
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => isTurn && onPlay(c)}
            className={isTurn ? 'cursor-pointer' : 'opacity-50'}
          >
            <Card faceUp rank={c.rank} suit={c.suit} />
          </div>
        ))}
      </div>
    </div>
  )
}
