"use client";

import React from "react";

export default function HowToGetWZN() {
  return (
    <section className="container mx-auto px-6 md:px-0 py-16 text-center">
      <h2 className="text-4xl font-bold text-white mb-3">
        How to get WZN Token?
      </h2>
      <p className="text-lg text-gray-200 mb-12">
        <strong className="text-white">WZN Tokens</strong> are not sold by us. You can earn them by:
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Discord */}
        <a
          href="https://discord.com/invite/7VRMu9r89c"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center max-w-xs"
        >
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
            <img
              src="/icons/discord.svg"
              alt="Discord icon"
              className="w-10 h-10"
            />
          </div>
          <p className="text-cyan-100 text-base font-medium leading-snug text-center">
            Participating in Discord<br />community events
          </p>
        </a>

        {/* or */}
        <div>
          <span className="text-gray-400 text-2xl font-semibold">or</span>
        </div>

        {/* Playing our Games */}
        <a
          href="http://www.wznworldtournament.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center max-w-xs"
        >
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
            <img
              src="/icons/coins.svg"
              alt="Games icon"
              className="w-10 h-10"
            />
          </div>
          <p className="text-cyan-100 text-base font-medium leading-snug text-center">
            Playing our<br />Games
          </p>
        </a>

        {/* or */}
        <div>
          <span className="text-gray-400 text-2xl font-semibold">or</span>
        </div>

        {/* Trading */}
        <a
          href="https://jup.ag/tokens/JBbUvhmBgNNrDYgdC5eZsJ8BDnraAKjRYC5PSSyUQXQs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center max-w-xs"
        >
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
            <img
              src="/icons/trade.svg"
              alt="Trade icon"
              className="w-10 h-10"
            />
          </div>
          <p className="text-cyan-100 text-base font-medium leading-snug text-center">
            Trading on<br />Jupiter
          </p>
        </a>
      </div>
    </section>
  );
}