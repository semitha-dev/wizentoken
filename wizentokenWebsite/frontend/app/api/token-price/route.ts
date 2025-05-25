// /app/api/token-price/route.ts
import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';

export async function GET() {
  const TOKEN_MINT = new PublicKey("JBbUvhmBgNNrDYgdC5eZsJ8BDnraAKjRYC5PSSyUQXQs");
  const amount = 1e9; // 1 token in base units
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=${TOKEN_MINT.toBase58()}&outputMint=So11111111111111111111111111111111111111112&amount=${amount}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "WZN-TokenStats-Server/1.0"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Jupiter API error status ${response.status}` }, { status: 500 });
    }

    const json = await response.json();
    const outAmount = json?.data?.[0]?.outAmount;

    if (!outAmount) {
      return NextResponse.json({ error: "No outAmount from Jupiter API" }, { status: 500 });
    }

    const solAmount = Number(outAmount) / 1e9;

    return NextResponse.json({ price: solAmount });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch from Jupiter API" }, { status: 500 });
  }
}
