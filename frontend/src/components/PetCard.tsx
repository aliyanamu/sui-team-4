"use client";

import { Pet } from "@/types";
import { SatietyBar } from "./SatietyBar";

interface PetCardProps {
  pet: Pet;
  onFeed: () => void;
  onTransfer: () => void;
  onBurn: () => void;
  isLoading?: boolean;
}

export function PetCard({
  pet,
  onFeed,
  onTransfer,
  onBurn,
  isLoading,
}: PetCardProps) {
  const getPetFace = () => {
    if (!pet.isAlive) return "(✖_✖)";
    if (pet.satiety > 70) return "(◕‿◕)";
    if (pet.satiety > 40) return "(◕_◕)";
    if (pet.satiety > 20) return "(◕︿◕)";
    return "(⊙﹏⊙)";
  };

  const MS_PER_DAY = 86_400_000;
  const days = Math.floor((1738300800000 - pet.bornAt) / MS_PER_DAY);
  const daysOldText =
    days <= 0 ? "Just born" : days === 1 ? "1 day old" : `${days} days old`;

  return (
    <div className={`pet-card ${!pet.isAlive ? "dead" : ""}`}>
      <div className="pet-face">{getPetFace()}</div>
      <h3 className="pet-name">&quot;{pet.name}&quot;</h3>
      <p className="pet-age">{daysOldText}</p>

      <div className="satiety-section">
        <SatietyBar value={pet.satiety} />
      </div>

      {!pet.isAlive && <div className="status-dead">☠️ DEAD</div>}

      <div className="actions">
        {pet.isAlive ? (
          <>
            <button
              className="btn btn-feed"
              onClick={onFeed}
              disabled={isLoading}
            >
              🍙 FEED
            </button>
            <button
              className="btn btn-transfer"
              onClick={onTransfer}
              disabled={isLoading}
            >
              📤 SEND
            </button>
          </>
        ) : (
          <button
            className="btn btn-burn"
            onClick={onBurn}
            disabled={isLoading}
          >
            🔥 BURN
          </button>
        )}
      </div>
    </div>
  );
}
