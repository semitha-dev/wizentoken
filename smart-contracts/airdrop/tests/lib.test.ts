import * as anchor from "@project-serum/anchor";
import { Program, BN } from "@project-serum/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { expect } from "chai";
import { keccak_256 } from "js-sha3";
import { MerkleTree } from "merkletreejs";

describe("airdrop", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Airdrop as Program;
  const admin = provider.wallet.publicKey;

  // Create a token mint and distributor ATA
  const tokenMint = Keypair.generate();
  const recipient = Keypair.generate();
  let distributorPda: PublicKey;
  let distributorAta: PublicKey;
  let recipientAta: PublicKey;
  let merkleTree: MerkleTree;
  let merkleRoot: Buffer;
  let validProof: Buffer[];
  let validAmount: BN;

  before(async () => {
    [distributorPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("distributor"), admin.toBuffer(), tokenMint.publicKey.toBuffer()],
      program.programId
    );

    await program.provider.connection.requestAirdrop(admin, 2_000_000_000);
    await program.provider.connection.requestAirdrop(recipient.publicKey, 2_000_000_000);
    await createTokenMint();

    distributorAta = getAssociatedTokenAddressSync(tokenMint.publicKey, distributorPda, true);
    recipientAta = getAssociatedTokenAddressSync(tokenMint.publicKey, recipient.publicKey);

    const leaves = [
      generateLeaf(recipient.publicKey, new BN(100_000_000)),
      generateLeaf(Keypair.generate().publicKey, new BN(200_000_000)), 
    ];
    merkleTree = new MerkleTree(leaves, keccak_256, { sortPairs: true });
    merkleRoot = merkleTree.getRoot();
    validProof = merkleTree.getProof(leaves[0]).map((p) => Buffer.from(p.data));
    validAmount = new BN(100_000_000);
  });

  async function createTokenMint() {
    await program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: admin,
          newAccountPubkey: tokenMint.publicKey,
          space: 82, 
          lamports: await program.provider.connection.getMinimumBalanceForRentExemption(82),
          programId: TOKEN_PROGRAM_ID,
        }),
        anchor.web3.SPL_TOKEN.instruction.initializeMint({
          mint: tokenMint.publicKey,
          decimals: 9,
          mintAuthority: admin,
          freezeAuthority: null,
        })
      ),
      [tokenMint]
    );

    await program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        anchor.web3.SPL_ASSOCIATED_TOKEN_ACCOUNT.instruction.createAssociatedTokenAccount({
          payer: admin,
          associatedToken: distributorAta,
          owner: distributorPda,
          mint: tokenMint.publicKey,
        }),
        anchor.web3.SPL_TOKEN.instruction.mintTo({
          mint: tokenMint.publicKey,
          destination: distributorAta,
          authority: admin,
          amount: 1_000_000_000,
        })
      ),
      [admin]
    );
  }

  function generateLeaf(pubkey: PublicKey, amount: BN): Buffer {
    const data = Buffer.concat([pubkey.toBuffer(), Buffer.from(amount.toArray("le", 8))]);
    return Buffer.from(keccak_256.digest(data));
  }

  it("Initializes the distributor", async () => {
    await program.methods
      .initializeDistributor([...merkleRoot])
      .accounts({
        distributor: distributorPda,
        tokenMint: tokenMint.publicKey,
        distributorAta: distributorAta,
        admin: admin,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const distributor = await program.account.distributor.fetch(distributorPda);
    expect(distributor.admin.toString()).to.equal(admin.toString());
    expect(distributor.tokenMint.toString()).to.equal(tokenMint.publicKey.toString());
    expect(distributor.merkleRoot).to.deep.equal([...merkleRoot]);
  });

  it("Updates the Merkle root", async () => {
    const newRoot = Buffer.alloc(32, 1); 
    await program.methods
      .updateMerkleRoot([...newRoot])
      .accounts({
        distributor: distributorPda,
        admin: admin,
      })
      .rpc();

    const distributor = await program.account.distributor.fetch(distributorPda);
    expect(distributor.merkleRoot).to.deep.equal([...newRoot]);
  });

  it("Fails to update Merkle root by non-admin", async () => {
    const nonAdmin = Keypair.generate();
    await program.provider.connection.requestAirdrop(nonAdmin.publicKey, 1_000_000_000);

    try {
      await program.methods
        .updateMerkleRoot([...Buffer.alloc(32, 2)])
        .accounts({
          distributor: distributorPda,
          admin: nonAdmin.publicKey,
        })
        .signers([nonAdmin])
        .rpc();
      expect.fail("Should have thrown admin mismatch error");
    } catch (err) {
      expect(err.toString()).to.include("ConstraintHasOne");
    }
  });

  it("Claims airdrop successfully", async () => {
    await program.methods
      .updateMerkleRoot([...merkleRoot])
      .accounts({
        distributor: distributorPda,
        admin: admin,
      })
      .rpc();

    const initialRecipientBalance = (await program.provider.connection.getTokenAccountBalance(recipientAta)).value.uiAmount;

    await program.methods
      .airdropBatch(validAmount, validProof.map(p => [...p]))
      .accounts({
        distributor: distributorPda,
        distributorAta: distributorAta,
        tokenMint: tokenMint.publicKey,
        admin: admin,
        recipient: recipient.publicKey,
        recipientAta: recipientAta,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([recipient])
      .rpc();

    const finalRecipientBalance = (await program.provider.connection.getTokenAccountBalance(recipientAta)).value.uiAmount;
    expect(finalRecipientBalance).to.equal(initialRecipientBalance + 0.1); 
  });

  it("Fails to claim with invalid proof", async () => {
    const invalidProof = [Buffer.alloc(32, 3), Buffer.alloc(32, 4)]; 

    try {
      await program.methods
        .airdropBatch(validAmount, invalidProof.map(p => [...p]))
        .accounts({
          distributor: distributorPda,
          distributorAta: distributorAta,
          tokenMint: tokenMint.publicKey,
          admin: admin,
          recipient: recipient.publicKey,
          recipientAta: recipientAta,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([recipient])
        .rpc();
      expect.fail("Should have thrown InvalidProof error");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("InvalidProof");
    }
  });

  it("Fails to claim with incorrect amount", async () => {
    const invalidAmount = new BN(200_000_000); 

    try {
      await program.methods
        .airdropBatch(invalidAmount, validProof.map(p => [...p]))
        .accounts({
          distributor: distributorPda,
          distributorAta: distributorAta,
          tokenMint: tokenMint.publicKey,
          admin: admin,
          recipient: recipient.publicKey,
          recipientAta: recipientAta,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([recipient])
        .rpc();
      expect.fail("Should have thrown InvalidProof error");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("InvalidProof");
    }
  });
});
