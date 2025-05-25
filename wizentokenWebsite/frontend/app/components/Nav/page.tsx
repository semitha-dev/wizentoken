"use client";

import React from "react";

export default function Header() {
  return (
    <header className="container mx-auto px-6 flex items-center justify-between py-8">
      <h1 className="text-2xl font-bold text-cyan-300">WZN Token</h1>
      <div className="flex space-x-4">
        <a
          href="https://discord.gg/7VRMu9r89c"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-6 py-2 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
            Join our Discord
          </button>
        </a>
        <button className="px-6 py-2 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
          Launch App
        </button>
      </div>
    </header>
  );
}
