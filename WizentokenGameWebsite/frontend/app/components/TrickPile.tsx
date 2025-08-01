// components/TrickPile.tsx
import React from 'react'
import Card from './Card'
import type { Card as LogicCard } from '@/app/lib/gamelogic'

type TrickCard = { player: number; card: LogicCard }

const offsets = ['translate-y-16', '-translate-x-16', '-translate-y-16', 'translate-x-16']

export default function TrickPile({ cards }: { cards: TrickCard[] }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {cards.map(({ player, card }, idx) => (
        <div key={idx} className={`absolute transition-transform duration-300 ${offsets[player]}`}>
          <Card faceUp rank={card.rank} suit={card.suit} />
        </div>
      ))}
    </div>
  )
}
