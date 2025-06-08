"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function useFixedCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff / 3_600_000) % 24);
      const m = Math.floor((diff / 60_000) % 60);
      const s = Math.floor((diff / 1_000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function Hero() {
  const { days, hours, minutes, seconds } = useFixedCountdown(
    "2025-06-22T12:00:00Z"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".intro-text", { opacity: 0, y: -20, duration: 0.6 });
      gsap.from(".headline", { opacity: 0, scale: 0.8, duration: 0.6, delay: 0.2 });
      gsap.from(".subtext", { opacity: 0, duration: 0.6, delay: 0.4 });
      gsap.from(".card", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.6,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const cards = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <main ref={containerRef} className="flex-grow container mx-auto px-6 text-center">
      <p className="intro-text uppercase text-sm text-gray-300 tracking-wide">
        The countdown to the first secret tournament has begun
      </p>
      <h2 className="headline mt-2 text-6xl font-extrabold text-cyan-300">
        WZN WORLD TOURNAMENT
      </h2>
      <p className="subtext mt-2 text-lg text-gray-400">
        Powering the future of gaming – One player at a time
      </p>

      {/* COUNTDOWN */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
        {cards.map(({ label, value }) => (
          <div
            key={label}
            className="card bg-gray-800 rounded-lg py-6 px-4 flex flex-col items-center"
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
        className="visit-button mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 rounded-full px-12 py-4 text-lg font-medium transition mb-14"
      >
        Visit the Game
      </a>
    </main>
  );
}
