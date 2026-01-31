import { Transaction } from "@mysten/sui/transactions";

// Package ID - Replace with deployed contract address
export const MOCHI_PETS_PACKAGE_ID = "0x0"; // TODO: Update after deployment

// Object type for MochiPet
export const MOCHI_PET_TYPE = `${MOCHI_PETS_PACKAGE_ID}::pet::MochiPet`;

// Clock object ID (shared on SUI)
export const CLOCK_OBJECT_ID = "0x6";

// Mint price in MIST (1 SUI = 1_000_000_000 MIST)
export const MINT_PRICE_MIST = 100_000_000; // 0.1 SUI

/**
 * Build a mint transaction for a new pet
 */
export function buildMintTransaction(name: string): Transaction {
  const tx = new Transaction();

  // Split the mint price from gas
  const [coin] = tx.splitCoins(tx.gas, [MINT_PRICE_MIST]);

  tx.moveCall({
    target: `${MOCHI_PETS_PACKAGE_ID}::pet::mint`,
    arguments: [coin, tx.pure.string(name), tx.object(CLOCK_OBJECT_ID)],
  });

  return tx;
}

/**
 * Build a feed transaction for a pet
 */
export function buildFeedTransaction(petId: string): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${MOCHI_PETS_PACKAGE_ID}::pet::feed`,
    arguments: [tx.object(petId), tx.object(CLOCK_OBJECT_ID)],
  });

  return tx;
}

/**
 * Build a transfer transaction to send a pet to another wallet
 */
export function buildTransferTransaction(
  petId: string,
  recipient: string,
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${MOCHI_PETS_PACKAGE_ID}::pet::transfer_pet`,
    arguments: [
      tx.object(petId),
      tx.pure.address(recipient),
      tx.object(CLOCK_OBJECT_ID),
    ],
  });

  return tx;
}

/**
 * Build a burn transaction for a dead pet
 */
export function buildBurnTransaction(petId: string): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${MOCHI_PETS_PACKAGE_ID}::pet::check_and_burn`,
    arguments: [tx.object(petId), tx.object(CLOCK_OBJECT_ID)],
  });

  return tx;
}
