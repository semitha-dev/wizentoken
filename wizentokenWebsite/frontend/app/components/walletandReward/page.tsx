import React from "react";

const WalletAndRewardsSection = () => {
  const steps = [
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
  ];

  return (
    <>
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
            {steps.map(({ step, icon, title, subtitle }) => (
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
    </>
  );
};

export default WalletAndRewardsSection;
