"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { Toaster } from "sonner";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

// Configure networks using createNetworkConfig
const { networkConfig } = createNetworkConfig({
  devnet: {
    url: "https://fullnode.devnet.sui.io:443",
    network: "devnet",
  },
  testnet: {
    url: "https://fullnode.testnet.sui.io:443",
    network: "testnet",
  },
  mainnet: {
    url: "https://fullnode.mainnet.sui.io:443",
    network: "mainnet",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: "1rem",
                fontFamily: "inherit",
              },
            }}
          />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
