"use client";

import Image from "next/image";
import { SatietyBar } from "./SatietyBar";
import { toast } from "sonner";

export interface ShowcasePet {
  id: string;
  name: string;
  satiety: number;
  age: string;
  image: string;
  isAlive: boolean;
}

// Showcase pets - examples showing various states
export const SHOWCASE_PETS: ShowcasePet[] = [
  {
    id: "showcase-1",
    name: "Whiskers",
    satiety: 95,
    age: "2 days old",
    image: "/pets/cat-1.png",
    isAlive: true,
  },
  {
    id: "showcase-2",
    name: "Mochi",
    satiety: 60,
    age: "5 days old",
    image: "/pets/cat-2.png",
    isAlive: true,
  },
  {
    id: "showcase-3",
    name: "Boba",
    satiety: 15,
    age: "8 days old",
    image: "/pets/cat-3.png",
    isAlive: true,
  },
  {
    id: "showcase-4",
    name: "Luna",
    satiety: 5,
    age: "10 days old",
    image: "/pets/cat-4.png",
    isAlive: true,
  },
  {
    id: "showcase-5",
    name: "Shadow",
    satiety: 0,
    age: "14 days old",
    image: "/pets/cat-5.png",
    isAlive: false,
  },
];

interface ShowcaseCardProps {
  pet: ShowcasePet;
}

export function ShowcaseCard({ pet }: ShowcaseCardProps) {
  const getStatusLabel = () => {
    if (!pet.isAlive) return "☠️ PASSED AWAY";
    if (pet.satiety <= 10) return "⚠️ CRITICAL";
    if (pet.satiety <= 25) return "😰 HUNGRY";
    return null;
  };

  const statusLabel = getStatusLabel();

  const handleFeed = () => {
    toast.success(`Fed ${pet.name}! 🍙`);
  };

  const handleTransfer = () => {
    toast.info(`Transfer ${pet.name} coming soon! 📤`);
  };

  const handleBurn = () => {
    toast.success(`${pet.name} has been laid to rest. 🕯️`);
  };

  return (
    <div className={`pet-card showcase ${!pet.isAlive ? "dead" : ""}`}>
      <Image
        src={pet.image}
        alt={pet.name}
        className="pet-avatar"
        width={128}
        height={128}
      />
      <h3 className="pet-name">&quot;{pet.name}&quot;</h3>
      <p className="pet-age">{pet.age}</p>

      <div className="satiety-section">
        <SatietyBar value={pet.satiety} />
      </div>

      {statusLabel && (
        <div
          className={`status-label ${!pet.isAlive ? "dead" : pet.satiety <= 10 ? "critical" : "warning"}`}
        >
          {statusLabel}
        </div>
      )}

      <div className="actions">
        {pet.isAlive ? (
          <>
            <button className="btn btn-feed" onClick={handleFeed}>
              🍙 FEED
            </button>
            <button className="btn btn-transfer" onClick={handleTransfer}>
              📤 SEND
            </button>
          </>
        ) : (
          <button className="btn btn-burn" onClick={handleBurn}>
            🔥 BURN
          </button>
        )}
      </div>
    </div>
  );
}

export function ShowcaseGrid() {
  return (
    <div className="pet-grid">
      {SHOWCASE_PETS.map((pet) => (
        <ShowcaseCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
