// /app/api/token-holders/route.ts
import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const TOKEN_MINT = new PublicKey("JBbUvhmBgNNrDYgdC5eZsJ8BDnraAKjRYC5PSSyUQXQs");
const RPC_ENDPOINT = "https://solana-mainnet.g.alchemy.com/v2/5AJASrKGYc_H_XarIOYGr2Z-HnRkY1IL";

export async function GET() {
  try {
    const conn = new Connection(RPC_ENDPOINT, "confirmed");

    const accounts = await conn.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: TOKEN_MINT.toBase58(),
          },
        },
      ],
    });

    const activeHolders = accounts.filter((acct) => {
      const tokenAmountInfo = (acct.account.data as any).parsed?.info?.tokenAmount;
      return tokenAmountInfo && tokenAmountInfo.uiAmount && tokenAmountInfo.uiAmount > 0;
    });

    return NextResponse.json({ holders: activeHolders.length });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch holders" }, { status: 500 });
  }
}
