// components/BidPanel.tsx
"use client"
import React from 'react'
import type { Card as LogicCard } from '@/app/lib/gamelogic'
import CardComponent from './Card'

type Suit = LogicCard['suit']
type CardType = { rank: LogicCard['rank']; suit: LogicCard['suit'] }
export type Bid = { player: number; mode: 'abondance' | 'misere'; trump?: Suit }

interface Props {
  localBid: Bid
  trumpOptions: Suit[]
  onBidChange: (newBid: Bid) => void
  onSubmit: () => void
  handPreview: CardType[]
}

export default function BidPanel({
  localBid,
  trumpOptions,
  onBidChange,
  onSubmit,
  handPreview,
}: Props) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Place Your Bid</h2>

      {/* Mode Selection */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="mode"
            value="abondance"
            checked={localBid.mode === 'abondance'}
            onChange={() => onBidChange({ ...localBid, mode: 'abondance' })}
          />
          Abondance
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="mode"
            value="misere"
            checked={localBid.mode === 'misere'}
            onChange={() => onBidChange({ player: 0, mode: 'misere' })}
          />
          Misère
        </label>
      </div>

      {/* Trump Selection */}
      {localBid.mode === 'abondance' && (
        <div className="flex items-center gap-3">
          <span>Choose Trump:</span>
          {trumpOptions.map((s) => (
            <button
              key={s}
              onClick={() => onBidChange({ ...localBid, trump: s })}
              className={`px-3 py-1 rounded ${
                localBid.trump === s ? 'bg-indigo-600 text-white' : 'bg-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Hand Preview */}
      <div className="overflow-x-auto px-2">
        <div className="flex space-x-2 py-2">
          {handPreview.map((card, i) => (
            <CardComponent
              key={i}
              faceUp
              rank={card.rank}
              suit={card.suit}
            />
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onSubmit}
        className="mt-4 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-full"
      >
        Confirm Bid
      </button>
    </div>
  )
}
