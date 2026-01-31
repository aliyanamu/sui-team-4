"use client";

import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";

/**
 * Hook wrapper for wallet functionality
 */
export function useWallet() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const isConnected = !!account;
  const address = account?.address ?? null;

  // Truncate address for display
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return {
    isConnected,
    address,
    truncatedAddress,
    disconnect,
  };
}
