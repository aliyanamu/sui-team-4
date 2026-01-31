"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { buildMintTransaction } from "@/lib/contracts";
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
    </form>
  );
}
