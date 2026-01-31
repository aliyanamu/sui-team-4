"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { buildMintTransaction, MOCHI_PETS_PACKAGE_ID } from "@/lib/contracts";
import { MINT_PRICE_SUI } from "@/types";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

interface MintFormProps {
  onSuccess?: () => void;
}

export function MintForm({ onSuccess }: MintFormProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a name for your pet");
      return;
    }

    // Check if contract is deployed
    if (MOCHI_PETS_PACKAGE_ID === "0x0") {
      toast.success(`Mock: Would mint pet named "${name}"! 🎉`);
      setName("");
      onSuccess?.();
      return;
    }

    setIsLoading(true);

    try {
      const tx = buildMintTransaction(name.trim());

      await signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            await suiClient.waitForTransaction({
              digest: result.digest,
            });
            toast.success(`Successfully minted "${name}"! 🎉`);
            setName("");
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Mint error:", error);
            toast.error("Failed to mint pet. Please try again.");
          },
        },
      );
    } catch (error) {
      console.error("Mint error:", error);
      toast.error("Failed to mint pet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mint-form" onSubmit={handleMint}>
      <div className="form-content">
        <div className="icon-box">
          <Sparkles size={24} strokeWidth={3} />
        </div>
        <input
          type="text"
          placeholder="NAME YOUR PET..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          maxLength={32}
        />
        <button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>MINT ({MINT_PRICE_SUI} SUI)</>
          )}
        </button>
      </div>

      <style jsx>{`
        .mint-form {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
        }
        .form-content {
          display: flex;
          align-items: stretch;
          gap: 0;
          background: white;
          border: 3px solid var(--nb-border);
          box-shadow: var(--nb-shadow-lg);
        }
        .form-content :global(.icon-box) {
          background: var(--nb-secondary);
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 3px solid var(--nb-border);
        }
        .form-content input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          font-weight: 700;
          background: transparent;
          min-width: 0;
          padding: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-content input::placeholder {
          color: #666;
        }
        .form-content button {
          background: var(--nb-accent);
          color: black;
          border: none;
          border-left: 3px solid var(--nb-border);
          padding: 1rem 1.5rem;
          font-weight: 900;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.1s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-content button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-content button:not(:disabled):hover {
          background: #8ce8a8;
        }
        .form-content button:not(:disabled):active {
          background: #7dd798;
        }
        .form-content :global(.animate-spin) {
          animation: spin 1s linear infinite;
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
    </form>
  );
}
