use anchor_lang::prelude::*;

declare_id!("8tv6i46Ug2jfHuZixnZaSyFFa4XkxvqtVasKFX7vm6oW");

#[program]
pub mod airdrop {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
