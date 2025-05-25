// components/TokenSalesStaking.tsx
import React from "react";

const TokenSalesStaking = () => {
  return (
    <section className="bg-gray-800 py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl font-extrabold text-white">
            Token Sales &amp; Staking Model
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            To ensure sufficient liquidity, the team will sell additional WZN tokens directly to players. This supports our staking-driven ecosystem and funds ongoing development.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Feature 1 - Token Sales */}
          <div className="flex items-start bg-gray-700 border border-gray-600 rounded-xl p-6 space-x-4">
            <div className="text-cyan-300 text-4xl">💰</div>
            <div>
              <h3 className="text-xl font-semibold text-white">Token Sales</h3>
              <p className="text-gray-300">
                Players can purchase WZN tokens to access weekly play limits and premium tournaments.
              </p>
            </div>
          </div>

          {/* Feature 2 - Staking Access */}
          <div className="flex items-start bg-gray-700 border border-gray-600 rounded-xl p-6 space-x-4">
            <div className="text-cyan-300 text-4xl">📊</div>
            <div>
              <h3 className="text-xl font-semibold text-white">Staking Access</h3>
              <p className="text-gray-300">
                Stake your tokens to increase your weekly play allowance and unlock premium game tiers.
              </p>
            </div>
          </div>

          {/* Feature 3 - Reward Unlocks */}
          <div className="flex items-start bg-gray-700 border border-gray-600 rounded-xl p-6 space-x-4">
            <div className="text-cyan-300 text-4xl">🎁</div>
            <div>
              <h3 className="text-xl font-semibold text-white">Reward Unlocks</h3>
              <p className="text-gray-300">
                Earn in-game rewards and exclusive cosmetics by staking WZN.
              </p>
            </div>
          </div>

          {/* Feature 4 - Sustainable Growth */}
          <div className="flex items-start bg-gray-700 border border-gray-600 rounded-xl p-6 space-x-4">
            <div className="text-cyan-300 text-4xl">📈</div>
            <div>
              <h3 className="text-xl font-semibold text-white">Sustainable Growth</h3>
              <p className="text-gray-300">
                This model drives engagement, fair competition, and long-term liquidity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenSalesStaking;
