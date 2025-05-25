"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "./components/Nav/page";
import TokenStatsSection from "./components/TokenStatsSection/page";
import Hero from "./components/Hero/page";
import WhatIsWZN from "./components/WhatWzn/page";
import HowToGetWZN from "./components/HowToGetWzn/page";
import UseToken from "./components/UseToken/page";
import HowItWorks from "./components/HowItWorks/page";
import WalletAndRewards from "./components/walletandReward/page";
import TokenSalesStaking from "./components/TokenSalesStaking/page";
import FAQ from "./components/FAQ/page";
import LegalNoticeSection from "./components/LegalNoticeSection/page";



export default function Home() {
 

  return (
    <div className="bg-gray-900 text-white flex flex-col">
    <Nav/>
    <TokenStatsSection />
    <Hero />
    <WhatIsWZN />
    <HowToGetWZN />
    <UseToken />
    <HowItWorks />
    <WalletAndRewards />
    <TokenSalesStaking />
    <FAQ />
    <LegalNoticeSection />
    </div>
  );
}