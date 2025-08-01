// app/providers.tsx
"use client"

import { ReactNode } from "react"
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from "@solana/wallet-adapter-wallets"

const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com"

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter()
]

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
