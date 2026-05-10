use anchor_lang::prelude::*;

// Deployment ke baad Solana Playground aapko ek naya ID dega, 
// usay yahan replace kar dena.
declare_id!("11111111111111111111111111111111");

#[program]
pub mod umt_donation_blink {
    use super::*;

    /// Donate function jo SOL transfer karti hai donor se vault mein
    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.donor.key(),
            &ctx.accounts.vault.key(),
            amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.donor.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;

        msg!("UMT Lahore: Donation of {} lamports successful!", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>, // Jo paise bhej raha hai

    /// CHECK: Ye recipient ka wallet address hai (UMT Treasury)
    #[account(mut)]
    pub vault: AccountInfo<'info>, 

    pub system_program: Program<'info, System>,
}
