"use client";

import { useState } from "react";
import { Pet } from "@/types";
import { PetCard } from "./PetCard";
import { EmptyState } from "./EmptyState";
import { TransferModal } from "./TransferModal";

interface PetGridProps {
  pets: Pet[];
  onFeed: (petId: string) => void;
  onTransfer: (petId: string, recipient: string) => void;
  onBurn: (petId: string) => void;
  isLoading?: boolean;
}

export function PetGrid({
  pets,
  onFeed,
  onTransfer,
  onBurn,
  isLoading,
}: PetGridProps) {
  const [transferPet, setTransferPet] = useState<Pet | null>(null);

  const handleTransferConfirm = (recipient: string) => {
    if (transferPet) {
      onTransfer(transferPet.id, recipient);
      setTransferPet(null);
    }
  };

  if (pets.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="pet-grid">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onFeed={() => onFeed(pet.id)}
            onTransfer={() => setTransferPet(pet)}
            onBurn={() => onBurn(pet.id)}
            isLoading={isLoading}
          />
        ))}
      </div>

      {transferPet && (
        <TransferModal
          petName={transferPet.name}
          isOpen={!!transferPet}
          onClose={() => setTransferPet(null)}
          onConfirm={handleTransferConfirm}
        />
      )}
    </>
  );
}
