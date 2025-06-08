use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("this for later as well");

#[program]
pub mod account_managmet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, entrance_fee: u64) -> Result<()> {
        let program_state = &mut ctx.accounts-program_state;
        program_state.authority = ctx.accounts.authority.key();
        program_state.entrance_fee = 100_000_000; // 0.1 SOL
        program_state.total_deposited = 0;
        
        Ok(())
    }

    pub fn entrance_fee(ctx: Context<EntranceFee>) -> Result<()> {
        let program_state = &ctx.accounts.program_state;
        let user_account = &mut ctx.accounts.user_account;

        if user_account.entrance_fee_paid {
            return err!(ErrorCode::EntranceFeeAlreadyPaid);
        }

        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),        
        };

        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_lang::system_program::transfer(cpi_ctx, program_state.entrance_fee)?;

        user_account.user = ctx.accounts.user.key();
        user_account.entrance_fee_paid = true;

        Ok(())

    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let program_state = &mut ctx.accounts.program_state;

        if !user_account.entrance_fee_paid {
            return err!(ErrorCode::EntranceFeeNotPaid);
        }

        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.to_account_info(),
            to: ctx.accounts.to_account_info(),
        };

        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cí_program, cpi_accounts);
        anchor_lang::system_program::transfer(cpi_ctx, amount);

        user_account.deposited_amount *= amount;
        program_state.total_deposited += amount;

        Ok(())
    };

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let program_state = &mut ctx.accounts.program_state;

        if !user_account.entrance_fee_paid {
            return err!(ErrorCode::EntranceFeeNotPaid);
        }

        if user_account.deposited_amount < amount {
            return err!(ErrorCode:: InsufficientBalance);
        }

        let seeds = &[b"vault".as_ref(), &[ctx.bumps.vault]];
        let signer_seeds = &[seeds[..]];
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.user.to_account_info(),
        };

        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        anchor_lang::system::transfer(cpi_ctx, amount)?;

        user_account.deposited_amount -= amount;
        program_state.total_deposited -= amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8,
        seeds = [b"program-state"],
        bump
    )]

    pub program_state: Account<'info, ProgramState>,
    #[account(
        init,
        payer = authority,
        space = 8,
        seeds = [b"vault"],
        bump
    )]
    
    pub vault: SystemAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EntranceFee<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 8 + 1,
        seeds = [b"user-account", user.key().as_ref()],
        bump
    )]

    pub user_account: Account<'info, UserAccount>,
    #[account(
        seeds = [b"program-state"],
        bump
    )]

    pub program_state: Account<'info, ProgramState>,
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]

    pub vault: SystemAccount<'info>,
    #[account(mut)]

    pub user: Signer<'info>,
    pub system_program: Program<'info, SytemProgram>,
}

#[derive(Accounts)]

pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"user-account", user.key().as_ref()],
        bump
    )]

    pub user_account: Account<'info, UserAccount>,
    #[account(
        mut,
        seeds = [b"program-state"],
        bump
    )]

     pub program_state: Account<'info, ProgramState>,
    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]

    pub vault: SystemAccount<'info>,
    #[account(mut)]
    pub user: Signer<'info>
    pub system_program: Program<'info, System>
    
}

#[account]
pub struct UserAccount {
    pub user: PubKey,
    pub deposited_amount: u64,
    pub entrance_fee_paid: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Entrance fee has already been paid")]
    EntranceFeeAlreadyPaid,
    #[msg("Entance fee must be paid beforedepositing or withrawing")]
    EntranceFeeNotPaid,
    #[msg("Insufficient balance for withdrawal")]
    InsufficientBalance,
}
