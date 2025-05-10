"use client";
import React, { useEffect, useState } from "react";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function useFixedCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days:   "00",
    hours:  "00",
    minutes:"00",
    seconds:"00",
  });

  useEffect(() => {
    // ← your fixed target date here:
    const target = new Date("2025-06-05T12:00:00Z");

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff / 3_600_000) % 24);
      const m = Math.floor((diff / 60_000) % 60);
      const s = Math.floor((diff / 1_000) % 60);

      setTimeLeft({
        days:    String(d).padStart(2, "0"),
        hours:   String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}



export default function Home() {
  const [openIndex, setOpenIndex] = useState<number|null>(null);
  const { days, hours, minutes, seconds } = useFixedCountdown();


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
    <div className="bg-gray-900 text-white flex flex-col">
      {/* NAV */}
      <header className="container mx-auto px-6 flex items-center justify-between py-8">
  <h1 className="text-2xl font-bold text-cyan-300">WZN Token</h1>
  <div className="flex space-x-4">
    <a
      href="https://discord.gg/7VRMu9r89c"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className="px-6 py-2 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
        Join our discord
      </button>
    </a>
    <button className="px-6 py-2 bg-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
      Launch app
    </button>
  </div>
</header>

      {/* HERO */}
<main className="flex-grow container mx-auto px-6 text-center">
  <p className="uppercase text-sm text-gray-300 tracking-wide">
    The countdown to the first secret tournament has begun
  </p>
  <h2 className="mt-2 text-6xl font-extrabold text-cyan-300">
    WZN WORLD TOURNAMENT
  </h2>
  <p className="mt-2 text-lg text-gray-400">
    Powering the future of gaming – One player at a time
  </p>

  {/* COUNTDOWN */}
  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
    {[
      { label: "Days",    value: days },
      { label: "Hours",   value: hours },
      { label: "Minutes", value: minutes },
      { label: "Seconds", value: seconds },
    ].map(({ label, value }) => (
      <div
        key={label}
        className="bg-gray-800 rounded-lg py-6 px-4 flex flex-col items-center"
      >
        <span className="text-5xl font-bold">{value}</span>
        <span className="mt-2 text-sm text-cyan-300">{label}</span>
      </div>
    ))}
  </div>

  {/* VISIT GAME BUTTON */}
  <a
    href="http://www.wznworldtournament.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 rounded-full px-12 py-4 text-lg font-medium transition mb-14"
  >
    Visit the Game
  </a>
</main>


     
        

      {/* WHAT IS WZN TOKEN */}
      <section className="bg-indigo-900">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">What is WZN Token?</h2>
          <p className="text-lg text-gray-200 mb-2">
            A game of strategy, timing, and a little luck.
          </p>
          <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Behind <strong>WZN Token</strong> is a tightly crafted four-player
            card experience — a game that rewards reading your opponents,
            mastering patterns, and making bold calls. Whether you're in it
            for a friendly match or climbing into tournament play, it's
            designed to bring out your best game sense.
          </p>
        </div>
        <div className="border-t border-cyan-500" />
      </section>

      {/* HOW TO GET WZN TOKEN */}
      <section className="container mx-auto px-6 md:px-0 py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-3">
          How to get WZN Token?
        </h2>
        <p className="text-lg text-gray-200 mb-12">
          <strong className="text-white">WZN Tokens</strong> are not sold by
          us. You can earn them by:
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Discord */}
          <div className="flex flex-col items-center max-w-xs">
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
          </div>

          {/* or */}
          <div>
            <span className="text-gray-400 text-2xl font-semibold">or</span>
          </div>

          {/* Coins */}
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <img
                src="/icons/coins.svg"
                alt="Coins icon"
                className="w-10 h-10"
              />
            </div>
            <p className="text-cyan-100 text-base font-medium leading-snug text-center">
              Supporting our<br />project early
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-100 text-gray-900 py-16 px-4">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-12">
          How do I get and use tokens?
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-20">
          {[
            {
              num: "1",
              title: "Play and earn",
              subtitle: "chips as rewards"
            },
            {
              num: "2",
              title: "Refine chips to",
              subtitle: "WZN Tokens"
            },
            {
              num: "3",
              title: "Use for cosmetics,",
              subtitle: "tournaments, or trading"
            }
          ].map(({ num, title, subtitle }) => (
            <div key={num} className="flex flex-col items-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-indigo-900 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {num}
              </div>
              <div className="text-lg font-medium">
                <p>{title}</p>
                <p className={num === "2" ? "font-bold" : ""}>{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-16 text-base">
          We never sell tokens. You only earn them by playing.
        </p>
      </div>
    </section>
     {/* HOW DOES THE WZN TOKEN WORK */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            How does the WZN token work?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            A useful token, not a mystery.
          </p>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                icon: "/icons/token-supply.svg",
                text: "WZN Token has a maximum supply of 100 million tokens, with controlled, gradual inflation over time.",
              },
              {
                icon: "/icons/distribution.svg",
                text: "Its distribution is fair: no private sales, no whales. Every player has the same opportunity to grow and participate in the ecosystem.",
              },
            ].map(({ icon, text }, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg p-6 flex items-start"
              >
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <img src={icon} alt="" className="w-6 h-6" />
                </div>
                <p className="text-left text-base text-gray-200">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NO ICO OR SALE */}
      <section className="bg-blue-200 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-8">
            Why no ICO or Sale?
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
            We believe in creating real player-driven value. Token are <span className="font-bold">distributed fairly</span> through
            <span className="font-bold"> gameplay and community contribution</span> - not sold like a typical investment.
          </p>
        </div>
      </section>

      {/* SET UP YOUR WALLET */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-16">
            Set up your wallet
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {[
              {
                step: "STEP 1",
                icon: "/icons/wallet.svg",
                title: "Install a wallet",
                subtitle: "(e.g. Phantom)"
              },
              {
                step: "STEP 2",
                icon: "/icons/sol.svg",
                title: "Buy SOL",
                subtitle: ""
              },
              {
                step: "STEP 3",
                icon: "/icons/user.svg",
                title: "Active your",
                subtitle: "game account"
              },
              {
                step: "STEP 4",
                icon: "/icons/check.svg",
                title: "Done!",
                subtitle: ""
              }
            ].map(({ step, icon, title, subtitle }) => (
              <div key={step} className="flex flex-col items-center mb-12 md:mb-0">
                <p className="text-cyan-100 font-bold mb-4">{step}</p>
                <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mb-4">
                  <img src={icon} alt={title} className="w-12 h-12" />
                </div>
                <div className="text-lg font-medium">
                  <p className="text-cyan-100">{title}</p>
                  {subtitle && <p className="text-cyan-100">{subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* GAME TOKEN REWARDS */}
<section className="bg-sky-200 py-16">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-8">
      Game token rewards
    </h2>

    <div className="inline-block bg-gray-100 p-8 rounded-lg">
      <div className="border-2 border-indigo-900 rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-indigo-900 mb-4">
          For players
        </h3>
        <p className="text-base text-indigo-900 mb-4">
          Earn <strong>WZN Tokens</strong> by playing
        </p>
        <div className="my-4">
          <img
            src="/icons/medal.svg"
            alt="Medal icon"
            className="w-12 h-12 mx-auto"
          />
        </div>
        <p className="text-base text-indigo-900">
          Rewards can last up to <strong>8 years</strong>
        </p>
      </div>
    </div>

    <p className="mt-8 text-gray-900 font-bold">
      In the future, it might be replaced by watching ads.
    </p>
  </div>
</section>
{/* FAQ Section */}
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
            {/* Question bar */}
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
                  /* minus icon */
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
                  /* plus icon */
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

            {/* Answer panel */}
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
      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            © 2025 WZN Token. All rights reserved.
          </p>
        </div>
      </footer>




     
    </div>
  );
}