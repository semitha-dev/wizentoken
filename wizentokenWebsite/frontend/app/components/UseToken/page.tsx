"use client";

import React from "react";

export default function UseTokensSection() {
  const steps = [
    { num: "1", title: "Play and earn", subtitle: "chips as rewards" },
    { num: "2", title: "Refine chips to", subtitle: "WZN Tokens" },
    { num: "3", title: "Use for cosmetics,", subtitle: "tournaments, or trading" },
  ];

  return (
    <section className="bg-blue-100 text-gray-900 py-16 px-4">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-12">How do I get and use tokens?</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-20">
          {steps.map(({ num, title, subtitle }) => (
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
        <p className="mt-16 text-base">We never sell tokens. You only earn them by playing.</p>
      </div>
    </section>
  );
}