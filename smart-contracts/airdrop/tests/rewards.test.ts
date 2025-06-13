import * as anchor from "@project-serum/anchor";
import { Program, BN } from "@project-serum/anchor";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("rewards_program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RewardsProgram as Program;
  const authority = provider.wallet.publicKey;

  const [programStatePda, programStateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("program-state")],
    program.programId
  );

  let userAccountPda: PublicKey;

  before(async () => {
    [userAccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-reward"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes the program state", async () => {
    await program.methods
      .initialize()
      .accounts({
        programState: programStatePda,
        authority: authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.authority.toString()).to.equal(authority.toString());
    expect(programState.totalRewards.toString()).to.equal("0");
    expect(programState.apy).to.equal(400); 
  });

  it("Rewards a user for the first time", async () => {
    const rewardAmount = new BN(100_000_000); 

    await program.methods
      .reward(rewardAmount)
      .accounts({
        userReward: userAccountPda,
        programState: programStatePda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const userReward = await program.account.userReward.fetch(userAccountPda);
    const programState = await program.account.programState.fetch(programStatePda);

    expect(userReward.user.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(userReward.amount.toString()).to.equal(rewardAmount.toString());
    expect(userReward.lastRewardTimestamp.toNumber()).to.be.greaterThan(0);
    expect(programState.totalRewards.toString()).to.equal(rewardAmount.toString());
  });

  it("Rewards a user again with accrued rewards", async () => {
    const rewardAmount = new BN(50_000_000); 
    const initialUserReward = await program.account.userReward.fetch(userAccountPda);
    const initialTimestamp = initialUserReward.lastRewardTimestamp.toNumber();

    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    await program.methods
      .reward(rewardAmount)
      .accounts({
        userReward: userAccountPda,
        programState: programStatePda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const userReward = await program.account.userReward.fetch(userAccountPda);
    const programState = await program.account.programState.fetch(programStatePda);

    expect(userReward.amount.toNumber()).to.be.greaterThan(initialUserReward.amount.toNumber());
    expect(userReward.lastRewardTimestamp.toNumber()).to.be.greaterThan(initialTimestamp);
    expect(programState.totalRewards.toString()).to.equal(
      initialUserReward.amount.add(rewardAmount).toString()
    );
  });

  it("Views rewards for a user", async () => {
    const initialUserReward = await program.account.userReward.fetch(userAccountPda);
    const initialTimestamp = initialUserReward.lastRewardTimestamp.toNumber();

    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    const rewards = await program.methods
      .viewRewards()
      .accounts({
        userReward: userAccountPda,
        programState: programStatePda,
        user: provider.wallet.publicKey,
      })
      .view();

    expect(rewards.toNumber()).to.be.greaterThanOrEqual(0);
  });

  it("Fails to view rewards for non-existent user reward account", async () => {
    const newUser = Keypair.generate();
    const [newUserRewardPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-reward"), newUser.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .viewRewards()
        .accounts({
          userReward: newUserRewardPda,
          programState: programStatePda,
          user: newUser.publicKey,
        })
        .signers([newUser])
        .rpc();
      expect.fail("Should have thrown error for non-existent user reward account");
    } catch (err) {
      expect(err.toString()).to.include("AccountNotInitialized");
    }
  });
});
