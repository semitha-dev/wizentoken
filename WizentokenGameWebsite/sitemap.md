# WZN Game Frontend

This repository contains the frontend application for the **WZN staking and multiplayer game platform**.

---

## Overview

The WZN frontend enables:

- WZN token staking and reward claiming  
- Multiplayer game session creation and participation (2P/4P)  
- Session-based vault logic and winnings distribution  
- Admin tools to end games and assign winners  
- Wallet integration and real-time Solana Devnet interactions  

---

## Tech Stack

- **Next.js (App Router)** for page routing and layout  
- **TypeScript** for type-safe logic  
- **TailwindCSS** for styling and responsiveness  
- **Solana Wallet Adapter** for wallet connection  
- **Anchor + IDL** for contract interaction  
- **Phantom / Solflare** for supported wallets  

---

## Structure

- `/app/` → Next.js App Router pages
  - `/` – Dashboard (stake + claim) 
  - `/select-mode` – Choose game mode (2P or 4P)
  - `/join-game` – Join or view active sessions
  - `/claim-winnings` – Winner reward claiming
  - `/admin/end-game` – Admin panel to end matches
  - `/how-to-play` – Guide and gameplay instructions

- `/components/` → Reusable components (wallet UI, modals, forms)

- `/lib/` → Anchor provider, utils, contract hooks

- `/styles/` → Tailwind global styles

- `/public/` → Static assets (logo, icons, etc.)

- `/docs/` → Sitemap and route specs

---

## Devnet Deployment

The app is wired to deployed contracts on Solana Devnet. Ensure your wallet is connected to Devnet and has test WZN tokens to interact with the platform.
