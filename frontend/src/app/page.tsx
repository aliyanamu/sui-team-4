"use client";

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
  MOCHI_PETS_PACKAGE_ID,
} from "@/lib/contracts";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Home() {
  const account = useCurrentAccount();
  const { pets, isLoading, refetch } = usePets();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const handleFeed = async (petId: string) => {
    // Mock mode
    if (MOCHI_PETS_PACKAGE_ID === "0x0") {
      toast.success("Mock: Fed pet! 🍙");
      return;
    }

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
    // Mock mode
    if (MOCHI_PETS_PACKAGE_ID === "0x0") {
      toast.success(`Mock: Transferred pet to ${recipient.slice(0, 8)}...! 📤`);
      return;
    }

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
    // Mock mode
    if (MOCHI_PETS_PACKAGE_ID === "0x0") {
      toast.success("Mock: Burned dead pet. Rest in peace. 🕯️");
      return;
    }

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
          <h2 className="section-title">
            Your Pets {pets.length > 0 && `(${pets.length})`}
            {!account && <span className="demo-badge">Demo Mode</span>}
          </h2>

          {isLoading ? (
            <div className="loading-state">
              <Loader2 className="animate-spin" size={40} />
              <p>Loading your pets...</p>
            </div>
          ) : (
            <PetGrid
              pets={pets}
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

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          border-bottom: 3px solid var(--nb-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon {
          font-size: 2rem;
          background: var(--nb-secondary);
          padding: 0.25rem 0.5rem;
          border: 3px solid var(--nb-border);
        }
        .logo-text {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--nb-foreground);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .mint-section {
          margin-bottom: 3rem;
        }
        .collection-section {
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--nb-foreground);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .demo-badge {
          font-size: 0.75rem;
          font-weight: 800;
          background: var(--nb-secondary);
          color: black;
          padding: 0.35rem 0.75rem;
          border: 2px solid var(--nb-border);
          text-transform: uppercase;
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem 2rem;
          color: var(--nb-foreground);
          font-weight: 700;
        }
        .loading-state :global(.animate-spin) {
          animation: spin 1s linear infinite;
          color: var(--nb-foreground);
        }
        .footer {
          text-align: center;
          padding: 2rem;
          background: white;
          border-top: 3px solid var(--nb-border);
          font-weight: 700;
          color: var(--nb-foreground);
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
