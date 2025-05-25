"use client";

import React from "react";

export default function HowItWorks() {
  const features = [
    {
      icon: "/icons/token-supply.svg",
      text: "WZN Token has a maximum supply of 100 million tokens, with controlled, gradual inflation over time.",
    },
    {
      icon: "/icons/distribution.svg",
      text: "Its distribution is fair: no private sales, no whales. Every player has the same opportunity to grow and participate in the ecosystem.",
    },
  ];

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">How does the WZN token work?</h2>
        <p className="text-lg text-gray-400 mb-8">A useful token, not a mystery.</p>
        <div className="space-y-4 max-w-2xl mx-auto">
          {features.map(({ icon, text }, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-6 flex items-start">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <img src={icon} alt="" className="w-6 h-6" />
              </div>
              <p className="text-left text-base text-gray-200">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
