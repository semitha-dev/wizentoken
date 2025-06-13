import * as anchor from "@project-serum/anchor";
import { Program, BN } from "@project-serum/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("account_management", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AccountManagement as Program;
  const authority = provider.wallet.publicKey;

  const [programStatePda, programStateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("program-state")],
    program.programId
  );

  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    program.programId
  );

  let userAccountPda: PublicKey;

  before(async () => {
    [userAccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-account"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes the program state", async () => {
    const entranceFee = new BN(100_000_000); 

    await program.methods
      .initialize(entranceFee)
      .accounts({
        programState: programStatePda,
        vault: vaultPda,
        authority: authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.authority.toString()).to.equal(authority.toString());
    expect(programState.entranceFee.toString()).to.equal(entranceFee.toString());
    expect(programState.totalDeposited.toString()).to.equal("0");
  });

  it("Pays entrance fee successfully", async () => {
    await program.methods
      .entranceFee()
      .accounts({
        userAccount: userAccountPda,
        programState: programStatePda,
        vault: vaultPda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const userAccount = await program.account.userAccount.fetch(userAccountPda);
    expect(userAccount.user.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(userAccount.entranceFeePaid).to.be.true;
    expect(userAccount.depositedAmount.toString()).to.equal("0");
  });

  it("Fails to pay entrance fee twice", async () => {
    try {
      await program.methods
        .entranceFee()
        .accounts({
          userAccount: userAccountPda,
          programState: programStatePda,
          vault: vaultPda,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have thrown EntranceFeeAlreadyPaid error");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("EntranceFeeAlreadyPaid");
    }
  });

  it("Deposits funds successfully", async () => {
    const depositAmount = new BN(500_000_000); 

    await program.methods
      .deposit(depositAmount)
      .accounts({
        userAccount: userAccountPda,
        programState: programStatePda,
        vault: vaultPda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const userAccount = await program.account.userAccount.fetch(userAccountPda);
    const programState = await program.account.programState.fetch(programStatePda);
    expect(userAccount.depositedAmount.toString()).to.equal(depositAmount.toString());
    expect(programState.totalDeposited.toString()).to.equal(depositAmount.toString());
  });

  it("Fails to deposit without paying entrance fee", async () => {
    const newUser = anchor.web3.Keypair.generate();
    const [newUserAccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-account"), newUser.publicKey.toBuffer()],
      program.programId
    );

    const signature = await provider.connection.requestAirdrop(newUser.publicKey, 1_000_000_000);
    await provider.connection.confirmTransaction(signature);

    try {
      await program.methods
        .deposit(new BN(100_000_000))
        .accounts({
          userAccount: newUserAccountPda,
          programState: programStatePda,
          vault: vaultPda,
          user: newUser.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([newUser])
        .rpc();
      expect.fail("Should have thrown EntranceFeeNotPaid error");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("EntranceFeeNotPaid");
    }
  });

  it("Withdraws funds successfully", async () => {
    const withdrawAmount = new BN(200_000_000); 

    await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        userAccount: userAccountPda,
        programState: programStatePda,
        vault: vaultPda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const userAccount = await program.account.userAccount.fetch(userAccountPda);
    const programState = await program.account.programState.fetch(programStatePda);
    expect(userAccount.depositedAmount.toString()).to.equal("300000000"); 
    expect(programState.totalDeposited.toString()).to.equal("300000000");
  });

  it("Fails to withdraw more than deposited", async () => {
    const withdrawAmount = new BN(1_000_000_000); 

    try {
      await program.methods
        .withdraw(withdrawAmount)
        .accounts({
          userAccount: userAccountPda,
          programState: programStatePda,
          vault: vaultPda,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have thrown InsufficientBalance error");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("InsufficientBalance");
    }
  });

  it("Fails to withdraw without paying entrance fee", async () => {
    const newUser = anchor.web3.Keypair.generate();
    const [newUserAccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-account"), newUser.publicKey.toBuffer()],
      program.programId
    );

    const signature = await provider.connection.requestAirdrop(newUser.publicKey, 1_000_000_000);
    await provider.connection.confirmTransaction(signature);

    try {
      await program.methods
        .withdraw(new BN(100_000_000))
        .accounts({
          userAccount: newUserAccountPda,
          programState: programStatePda,
          vault: vaultPda,
          user: newUser.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([newUser])
        .rpc();
      expect.fail("Should have thrown EntranceFeeNotPaid error");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("EntranceFeeNotPaid");
    }
  });
});
