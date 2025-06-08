"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function TokenStatsSection() {
  // 1 WZN ≈ 1 / 10005.19693 USDC
  const placeholderPrice = 1 / 10005.196931255;
  const placeholderHolders = 6;

  const [price, setPrice] = useState<number | null>(placeholderPrice);
  const [holders, setHolders] = useState<number | null>(placeholderHolders);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // fetch logic disabled for now
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [price, holders]);

  return (
    <section className="container mx-auto px-6 py-12">
      <div
        ref={cardRef}
        className="bg-gray-800 rounded-xl p-8 shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold text-cyan-300 mb-4">
          WZN Token Stats
        </h2>

        <div className="mb-6">
          <p className="text-gray-400">1 WZN in USDC</p>
          <p className="text-3xl font-semibold">
            {price !== null ? `${price.toFixed(6)} USDC` : "Not Available"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Number of Holders</p>
          <p className="text-3xl font-semibold">
            {holders !== null ? holders : "Not Available"}
          </p>
        </div>
      </div>
    </section>
  );
}
