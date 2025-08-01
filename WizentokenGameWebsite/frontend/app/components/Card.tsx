// components/Card.tsx
"use client"

import type { ComponentType, SVGProps } from "react"

type CardProps = {
  rank: string  // "A", "2", ..., "10", "J", "Q", "K"
  suit: '♠' | '♥' | '♦' | '♣'
  faceUp?: boolean
}

export default function Card({ rank, suit, faceUp = true }: CardProps) {
  const isRed = suit === '♥' || suit === '♦'
  return (
    <div
      className={`w-12 h-16 flex-shrink-0 rounded-lg border-2 border-gray-500 
        ${faceUp ? 'bg-white' : 'bg-gray-700'} 
        flex items-center justify-center`}
    >
      {faceUp ? (
        <span className={`text-lg font-semibold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {rank}{suit}
        </span>
      ) : null}
    </div>
  )
}
