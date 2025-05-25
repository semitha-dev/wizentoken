"use client";
import React from "react";

const LegalNoticeSection: React.FC = () => {
  return (
    <>
      {/* NO INVESTMENT PROMISES */}
      <section className="bg-gray-800 py-16 px-6">
        <div className="container mx-auto max-w-2xl text-left space-y-6">
          <h2 className="text-2xl font-bold text-white">No Investment Promises</h2>
          <p className="text-gray-300">
            WZN tokens are not securities and do not represent ownership in the project or financial investment. By purchasing tokens, you are participating in a community-driven ecosystem that supports the development of the platform. There are no promises of returns or profits, and token holders should not expect financial gains from purchasing or holding WZN tokens.
          </p>
          <p className="text-gray-300">
            WZN is a utility token and is not designed as an investment. Tokens are distributed through liquidity provisioning and are used to access community-driven events and in-game experiences. There are no guarantees or promises of financial returns associated with holding or purchasing WZN tokens. Please consult with a financial advisor before engaging in any transaction involving cryptocurrency. By purchasing WZN tokens, you acknowledge that you understand and accept the terms outlined here.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 WZN Token. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default LegalNoticeSection;
