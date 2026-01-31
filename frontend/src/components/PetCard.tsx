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
  // Get pet face based on status
  const getPetFace = () => {
    if (!pet.isAlive) return "(✖_✖)";
    if (pet.satiety > 70) return "(◕‿◕)";
    if (pet.satiety > 40) return "(◕_◕)";
    if (pet.satiety > 20) return "(◕︿◕)";
    return "(⊙﹏⊙)";
  };

  // Calculate days old using static calculation
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

      {!pet.isAlive ? <div className="status-dead">☠️ DEAD</div> : null}

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

      <style jsx>{`
        .pet-card {
          background: white;
          border: 3px solid var(--nb-border);
          padding: 1.5rem;
          box-shadow: var(--nb-shadow-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition:
            transform 0.1s ease,
            box-shadow 0.1s ease;
        }
        .pet-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0px var(--nb-shadow);
        }
        .pet-card.dead {
          background: #f5f5f5;
          border-color: var(--nb-danger);
        }
        .pet-face {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
          font-family: monospace;
          background: var(--nb-secondary);
          padding: 0.5rem 1rem;
          border: 3px solid var(--nb-border);
        }
        .pet-name {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--nb-foreground);
          margin: 0.5rem 0 0 0;
          text-transform: uppercase;
        }
        .pet-age {
          font-size: 0.75rem;
          color: var(--nb-foreground);
          margin-top: 0.25rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .satiety-section {
          width: 100%;
          margin-bottom: 1rem;
        }
        .status-dead {
          font-size: 1rem;
          font-weight: 900;
          color: white;
          background: var(--nb-danger);
          margin-bottom: 1rem;
          padding: 0.5rem 1rem;
          border: 3px solid var(--nb-border);
          text-transform: uppercase;
        }
        .actions {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }
        .btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 3px solid var(--nb-border);
          font-weight: 800;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.1s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-feed {
          background: var(--nb-accent);
          color: black;
          box-shadow: var(--nb-shadow-sm);
        }
        .btn-feed:hover:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--nb-shadow);
        }
        .btn-feed:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: none;
        }
        .btn-transfer {
          background: var(--nb-primary);
          color: black;
          box-shadow: var(--nb-shadow-sm);
        }
        .btn-transfer:hover:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--nb-shadow);
        }
        .btn-transfer:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: none;
        }
        .btn-burn {
          background: var(--nb-danger);
          color: white;
          box-shadow: var(--nb-shadow-sm);
        }
        .btn-burn:hover:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--nb-shadow);
        }
        .btn-burn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
