"use client";

import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { WalletButton } from "@/components/WalletButton";
import { MintForm } from "@/components/MintForm";
import { PetGrid } from "@/components/PetGrid";
import { usePets } from "@/hooks/usePets";
import {
  buildFeedTransaction,
  buildBurnTransaction,
  buildTransferTransaction,
} from "@/lib/contracts";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

export default function Home() {
  const account = useCurrentAccount();
  const { pets, isLoading, refetch } = usePets();
  const [searchQuery, setSearchQuery] = useState("");
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const handleFeed = async (petId: string) => {
    try {
      const tx = buildFeedTransaction(petId);
      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            await suiClient.waitForTransaction({ digest: result.digest });
            toast.success("Pet fed successfully! 🍙");
            refetch();
          },
          onError: (error) => {
            console.error("Feed error:", error);
            toast.error("Failed to feed pet");
          },
        },
      );
    } catch (error) {
      console.error("Feed error:", error);
      toast.error("Failed to feed pet");
    }
  };

  const handleTransfer = async (petId: string, recipient: string) => {
    try {
      const tx = buildTransferTransaction(petId, recipient);
      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            await suiClient.waitForTransaction({ digest: result.digest });
            toast.success("Pet transferred successfully! 📤");
            refetch();
          },
          onError: (error) => {
            console.error("Transfer error:", error);
            toast.error("Failed to transfer pet");
          },
        },
      );
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Failed to transfer pet");
    }
  };

  const handleBurn = async (petId: string) => {
    try {
      const tx = buildBurnTransaction(petId);
      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            await suiClient.waitForTransaction({ digest: result.digest });
            toast.success("Pet has been laid to rest. 🕯️");
            refetch();
          },
          onError: (error) => {
            console.error("Burn error:", error);
            toast.error("Failed to burn pet");
          },
        },
      );
    } catch (error) {
      console.error("Burn error:", error);
      toast.error("Failed to burn pet");
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🍡</span>
          <span className="logo-text">MochiPets</span>
        </div>
        <WalletButton />
      </header>

      <main className="main-content">
        {/* Hero Mint Section */}
        <section className="mint-section">
          <MintForm onSuccess={refetch} />
        </section>

        {/* Pet Collection - Always show with mock data for dev */}
        <section className="collection-section">
          <div className="collection-header">
            <h2 className="section-title">
              Your Pets {pets.length > 0 && `(${pets.length})`}
              {!account && <span className="demo-badge">Demo Mode</span>}
            </h2>
            <div className="search-bar">
              <div className="icon-box">
                <Search size={18} className="search-icon" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <Loader2 className="animate-spin" size={40} />
              <p>Loading your pets...</p>
            </div>
          ) : (
            <PetGrid
              pets={pets.filter((pet) =>
                pet.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )}
              onFeed={handleFeed}
              onTransfer={handleTransfer}
              onBurn={handleBurn}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built with 💖 on SUI Network</p>
      </footer>
    </div>
  );
}
