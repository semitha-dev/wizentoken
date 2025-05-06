use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, Token, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use sha3::{Digest, Keccak256};         // for keccak hashing
use merkle_proof::verify_merkle_proof;  // your proof‐verification helper

declare_id!("YourProgramID1111111111111111111111111111111111");

#[program]
pub mod airdrop {
    use super::*;

    /// Initialize the Distributor PDA:
    /// - Stores admin, mint, bump, and the initial Merkle root.
    /// - Creates the PDA’s Associated Token Account so it can hold tokens.
    pub fn initialize_distributor(
        ctx: Context<InitializeDistributor>,
        merkle_root: [u8; 32],
    ) -> Result<()> {
        let dist = &mut ctx.accounts.distributor;
        dist.admin       = *ctx.accounts.admin.key;
        dist.token_mint  = *ctx.accounts.token_mint.to_account_info().key;
        dist.bump        = *ctx.bumps.get("distributor").unwrap();
        dist.merkle_root = merkle_root;
        Ok(())
    }

    /// Allows the admin to swap in a brand‑new Merkle root at any time.
    pub fn update_merkle_root(
        ctx: Context<UpdateRoot>,
        new_root: [u8; 32],
    ) -> Result<()> {
        ctx.accounts.distributor.merkle_root = new_root;
        Ok(())
    }

    /// A user claims `amount` by providing a Merkle `proof`.
    /// We:
    ///  1) Recompute leaf = keccak256(pubkey‖amount)
    ///  2) Verify proof vs stored root
    ///  3) Transfer tokens from distributor ATA → user ATA, signed by the PDA
    pub fn airdrop_batch(
        ctx: Context<AirdropBatch>,
        amount: u64,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        // 1) Build the leaf hash
        let mut data = ctx.accounts.recipient.key().to_bytes().to_vec();
        data.extend_from_slice(&amount.to_le_bytes());
        let leaf = Keccak256::digest(&data);

        // 2) Verify proof
        require!(
            verify_merkle_proof(&leaf.into(), &proof, &ctx.accounts.distributor.merkle_root),
            AirdropError::InvalidProof
        );

        // 3) Perform the transfer, signed by the Distributor PDA
        let seeds = &[
            b"distributor".as_ref(),
            ctx.accounts.distributor.admin.as_ref(),
            ctx.accounts.distributor.token_mint.as_ref(),
            &[ctx.accounts.distributor.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from:      ctx.accounts.distributor_ata.to_account_info(),
                    to:        ctx.accounts.recipient_ata.to_account_info(),
                    authority: ctx.accounts.distributor.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(merkle_root: [u8; 32])]
pub struct InitializeDistributor<'info> {
    /// The PDA holding our global config
    #[account(
        init,
        payer = admin,
        space  = 8 + 32 + 32 + 1 + 32,  // discriminator + admin + mint + bump + root
        seeds  = [b"distributor", admin.key().as_ref(), token_mint.key().as_ref()],
        bump,
    )]
    pub distributor: Account<'info, Distributor>,

    /// The token mint we’re airdropping (e.g. WZN)
    pub token_mint: Account<'info, Mint>,

    /// The PDA’s ATA so it can hold tokens
    #[account(
        init_if_needed,
        payer = admin,
        associated_token::mint     = token_mint,
        associated_token::authority = distributor,
    )]
    pub distributor_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program:        Program<'info, System>,
    pub token_program:         Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent:                  Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateRoot<'info> {
    /// Only the admin can change the root
    #[account(
        mut,
        seeds = [b"distributor", distributor.admin.as_ref(), distributor.token_mint.as_ref()],
        bump = distributor.bump,
        has_one = admin
    )]
    pub distributor: Account<'info, Distributor>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct AirdropBatch<'info> {
    /// The same Distributor PDA
    #[account(
        mut,
        seeds = [b"distributor", distributor.admin.as_ref(), distributor.token_mint.as_ref()],
        bump = distributor.bump,
    )]
    pub distributor: Account<'info, Distributor>,

    /// Where tokens are pulled from
    #[account(mut)]
    pub distributor_ata: Account<'info, TokenAccount>,

    /// The mint being distributed
    pub token_mint: Account<'info, Mint>,

    /// Must match distributor.admin for security
    pub admin: Signer<'info>,

    /// The end user claiming tokens
    /// No data needed, just their pubkey for hashing
    pub recipient: UncheckedAccount<'info>,

    /// Ensures the user has an ATA to receive tokens
    #[account(
        init_if_needed,
        payer = recipient,
        associated_token::mint     = token_mint,
        associated_token::authority = recipient,
    )]
    pub recipient_ata: Account<'info, TokenAccount>,

    pub system_program:        Program<'info, System>,
    pub token_program:         Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent:                  Sysvar<'info, Rent>,
}

#[account]
pub struct Distributor {
    pub admin:       Pubkey,
    pub token_mint:  Pubkey,
    pub bump:        u8,
    pub merkle_root: [u8; 32],
}

#[error_code]
pub enum AirdropError {
    #[msg("Merkle proof is invalid")]
    InvalidProof,
}
