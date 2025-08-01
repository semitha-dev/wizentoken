// components/PlayerAvatar.tsx
import React from 'react'

type Props = {
  name: string
  position: 'top' | 'left' | 'right' | 'bottom'
  history: boolean[]
}

// Map each position to its Tailwind utility classes
const positionClasses: Record<Props['position'], string> = {
  top:    'absolute top-6 left-1/2 -translate-x-1/2',
  left:   'absolute left-6 top-1/2 -translate-y-1/2',
  right:  'absolute right-6 top-1/2 -translate-y-1/2',
  bottom: 'absolute bottom-20 left-1/2 -translate-x-1/2',
}

export default function PlayerAvatar({ name, position, history }: Props) {
  return (
    <div className={`${positionClasses[position]} text-center`}>
      <div className="w-12 h-12 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
        {name[0]}
      </div>
      <div className="mt-1 text-sm">{name}</div>
      <div className="flex justify-center space-x-1 mt-1">
        {history.map((won, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${won ? 'bg-green-500' : 'bg-red-500'}`}
          />
        ))}
      </div>
    </div>
  )
}
