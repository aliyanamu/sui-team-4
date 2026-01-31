// Pet types for MochiPets Phase 1

export interface Pet {
  id: string;
  name: string;
  satiety: number; // 0-100
  bornAt: number; // timestamp in ms
  lastFed: number; // timestamp in ms
  isAlive: boolean;
}

export interface PetCardProps {
  pet: Pet;
  onFeed: (petId: string) => void;
  onTransfer: (petId: string) => void;
  onBurn: (petId: string) => void;
}

export interface PetGridProps {
  pets: Pet[];
  onFeed: (petId: string) => void;
  onTransfer: (petId: string, recipient: string) => void;
  onBurn: (petId: string) => void;
}

export interface TransferModalProps {
  petId: string;
  petName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipient: string) => void;
}

export interface SatietyBarProps {
  value: number; // 0-100
  showLabel?: boolean;
}

// Constants
export const MINT_PRICE_SUI = 0.1;
export const MAX_SATIETY = 100;
export const SATIETY_DECAY_PER_DAY = 10;
export const FEED_AMOUNT = 30;
export const MS_PER_DAY = 86_400_000;
