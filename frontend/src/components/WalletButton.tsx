"use client";

import { ConnectButton } from "@mysten/dapp-kit";

export function WalletButton() {
  return (
    <div className="wallet-button-wrapper">
      <ConnectButton connectText="Connect Wallet" />
      <style jsx>{`
        .wallet-button-wrapper :global(button) {
          background: var(--nb-primary);
          color: black;
          padding: 0.75rem 1.5rem;
          border: 3px solid var(--nb-border);
          border-radius: 0;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.1s ease;
          box-shadow: var(--nb-shadow-md);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .wallet-button-wrapper :global(button:hover) {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px var(--nb-shadow);
        }
        .wallet-button-wrapper :global(button:active) {
          transform: translate(4px, 4px);
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
