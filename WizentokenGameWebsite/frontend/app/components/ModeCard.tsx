// components/ModeCard.tsx
"use client"

import Link from "next/link"
import type { ComponentType, SVGProps } from "react"

type ModeCardProps = {
  href: string
  title: string
  description: string
  gradient: string             // e.g. "from-indigo-600 to-pink-500"
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export default function ModeCard({
  href,
  title,
  description,
  gradient,
  Icon,
}: ModeCardProps) {
  return (
    <Link
      href={href}
      className={`block bg-gradient-to-r ${gradient} p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {Icon && <Icon className="w-12 h-12 text-white" />}
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-indigo-100/80">{description}</p>
      </div>
    </Link>
  )
}
