 "use client"
import { useState } from "react";

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number|null>(null);

  const faqs = [
    {
      question: '1. What is the Wizen Token (WZN) and what is it used for?',
      answer: `WZN is a Solana-based utility token designed to power a collection of skill-based and competitive games, starting with an online version of the traditional Belgian card game Wiezen.
Players use WZN to enter tournaments, win prizes, and participate in token-based game modes. WZN is also used for staking, community rewards, and unlocking cosmetic features in-game.`,
    },
    {
      question: '2. Is WZN play-to-earn or pay-to-win?',
      answer: `Neither. WZN supports a “compete-to-earn” model.
Players don’t need to invest money to enjoy the game — but those who hold WZN can enter competitive formats, participate in leaderboards, or stake tokens for benefits. Fair matchmaking and gameplay come first; WZN adds optional depth.`,
    },
    {
      question: '3. Can I play without owning WZN?',
      answer: `Yes!  
All games in the Wizen ecosystem will support free-to-play modes but might require holding some WZN tokens, letting players enjoy core features without buying WZN. However, owning more tokens gives access to advanced game modes, rewards, and tournament entries.`,
    },
    {
      question: '4. What makes Wiezen different from other card-based crypto games?',
      answer: `Wizen recreates the real-life experience of playing Wiezen, a beloved Flemish card game, and combines it with modern game systems like dynamic rewards, ranked leaderboards, and social reputation.
Unlike RNG-heavy games, Wiezen is highly skill-based — making it ideal for meaningful token-based competition.`,
    },
    {
      question: '5. How is the WZN supply structured? Who receives tokens?',
      answer: `WZN has a fixed total supply of 100 million tokens, distributed as follows:
• 60% → Players (onboarding, rewards, and long-term distribution)  
• 16% → Team and developers (vested over 4 years)  
• 8%  → Future team, CEX listings  
• 8%  → Founder & legal reserves  
• 5%  → Servers and operations  
• 3%  → DAO treasury  

This structure ensures fair access for players while supporting long-term sustainability.`,
    },
    {
      question: '6. Will WZN be available on exchanges, and is it tradable now?',
      answer: `Yes. WZN launched on Solana and is currently tradeable on Jupiter and Raydium via decentralized liquidity pools.
As the ecosystem grows, WZN may list on centralized exchanges (CEXs). Trading is open — but the project avoids overhype to protect long-term holders and actual players.`,
    },
  ];

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          FAQ´s
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="flex flex-col">
                <div
                  onClick={() =>
                    setOpenIndex(isOpen ? null : idx)
                  }
                  className={`flex items-center justify-between cursor-pointer 
                             bg-[#B1E3FE] px-6 py-4 
                             ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    {isOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 12H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="bg-[#B1E3FE] rounded-b-lg px-6 py-4 text-left text-gray-900">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
