import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { UmtDonationBlink } from "../target/types/umt_donation_blink";
import { expect } from "chai";

describe("umt-donation-blink", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.UmtDonationBlink as Program<UmtDonationBlink>;

  it("Donation is successful!", async () => {
    // 1. Amount to donate (0.1 SOL in lamports)
    const amount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);
    
    // 2. Vault/Recipient wallet (Generate a random one for testing)
    const vault = anchor.web3.Keypair.generate().publicKey;

    // 3. Current balance of vault before donation
    const beforeBalance = await provider.connection.getBalance(vault);

    // 4. Call the donate function
    await program.methods
      .donate(amount)
      .accounts({
        donor: provider.wallet.publicKey,
        vault: vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // 5. Verify the balance after donation
    const afterBalance = await provider.connection.getBalance(vault);
    
    expect(afterBalance).to.equal(beforeBalance + amount.toNumber());
    console.log("Success! Vault received:", (afterBalance - beforeBalance) / anchor.web3.LAMPORTS_PER_SOL, "SOL");
  });
});
