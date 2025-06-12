use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("this for later");

#[program]
pub mod rewards_program {
    use super::*;

    // Initialize the rewards program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.authority = ctx.accounts.authority.key();
        program_state.total_rewards = 0;
        program_state.apy = 400; // 4% APY (in basis points, 100 = 1%)
        Ok(())
    }

    // Reward tokens (no transfer, just record the amount)
    // We should do a TypeScript Script to generate a JSON
    // To track the pre-rewards and reawards
    pub fn reward(ctx: Context<Reward>, amount: u64) -> Result<()> {
        let user_reward = &mut ctx.accounts.user_reward;
        let program_state = &mut ctx.accounts.program_state;
        let clock = Clock::get()?;

        if user_reward.amount == 0 {
            user_reward.user = ctx.accounts.user.key();
            user_reward.amount = amount;
            user_reward.last_reward_timestamp = clock.unix_timestamp;
            program_state.total_rewards += amount;
        } else {
            let rewards = calculate_rewards(
                user_reward.amount,
                user_reward.last_reward_timestamp,
                clock.unix_timestamp,
                program_state.apy,
            );
            user_reward.amount += amount + rewards;
            user_reward.last_reward_timestamp = clock.unix_timestamp;
            program_state.total_rewards += amount;
        }

        Ok(())
    }

    pub fn view_rewards(ctx: Context<ViewRewards>) -> Result<u64> {
        let user_reward = &ctx.accounts.user_reward;
        let program_state = &ctx.accounts.program_state;
        let clock = Clock::get()?;

        let rewards = calculate_rewards(
            user_reward.amount,
            user_reward.last_reward_timestamp,
            clock.unix_timestamp,
            program_state.apy,
        );

        Ok(rewards)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 4,
        seeds = [b"program-state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Reward<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 8 + 8,
        seeds = [b"user-reward", user.key().as_ref()],
        bump
    )]
    pub user_reward: Account<'info, UserReward>,
    #[account(
        mut,
        seeds = [b"program-state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ViewRewards<'info> {
    #[account(
        seeds = [b"user-reward", user.key().as_ref()],
        bump
    )]
    pub user_reward: Account<'info, UserReward>,
    #[account(
        seeds = [b"program-state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,
    pub user: Signer<'info>,
}

#[account]
pub struct ProgramState {
    pub authority: Pubkey,    
    pub total_rewards: u64,    
    pub apy: u32,             
}

#[account]
pub struct UserReward {
    pub user: Pubkey,         
    pub amount: u64,          
    pub last_reward_timestamp: i64, 
}


fn calculate_rewards(amount: u64, last_timestamp: i64, current_timestamp: i64, apy: u32) -> u64 {
    if amount == 0 || last_timestamp >= current_timestamp {
        return 0;
    }

    let time_diff = (current_timestamp - last_timestamp) as f64; 
    let rate = apy as f64 / 10000.0 / 365.0 / 24.0 / 3600.0; 
    let principal = amount as f64;
    let reward = principal * (rate * time_diff).exp() - principal;

    reward as u64
}
