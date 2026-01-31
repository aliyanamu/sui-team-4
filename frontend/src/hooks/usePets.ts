"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { Pet, MAX_SATIETY, SATIETY_DECAY_PER_DAY, MS_PER_DAY } from "@/types";
import { MOCHI_PET_TYPE } from "@/lib/contracts";

// Mock pets for development (until contract is deployed)
// Using fixed timestamps to avoid hydration mismatch
const MOCK_BORN_TIME_FLUFFY = 1706400000000; // Fixed timestamp
const MOCK_BORN_TIME_MOCHI = 1706000000000;
const MOCK_BORN_TIME_BOBA = 1705200000000;

const MOCK_PETS: Pet[] = [
  {
    id: "0x123abc",
    name: "Fluffy",
    satiety: 85,
    bornAt: MOCK_BORN_TIME_FLUFFY,
    lastFed: MOCK_BORN_TIME_FLUFFY + 2 * MS_PER_DAY,
    isAlive: true,
  },
  {
    id: "0x456def",
    name: "Mochi",
    satiety: 45,
    bornAt: MOCK_BORN_TIME_MOCHI,
    lastFed: MOCK_BORN_TIME_MOCHI + 5 * MS_PER_DAY,
    isAlive: true,
  },
  {
    id: "0x789ghi",
    name: "Boba",
    satiety: 0,
    bornAt: MOCK_BORN_TIME_BOBA,
    lastFed: MOCK_BORN_TIME_BOBA,
    isAlive: false,
  },
];

/**
 * Calculate current satiety based on time decay
 */
function calculateCurrentSatiety(
  lastSatiety: number,
  lastFedAt: number,
): number {
  const now = Date.now();
  const timePassed = now - lastFedAt;
  const daysPassed = Math.floor(timePassed / MS_PER_DAY);
  const decay = daysPassed * SATIETY_DECAY_PER_DAY;

  return Math.max(0, lastSatiety - decay);
}

/**
 * Hook to fetch all pets owned by the connected wallet
 */
export function usePets() {
  const account = useCurrentAccount();

  // Fetch owned objects of type MochiPet
  const { data, isLoading, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address ?? "",
      filter: {
        StructType: MOCHI_PET_TYPE,
      },
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!account?.address,
    },
  );

  // Transform on-chain data to Pet objects
  const pets = useMemo<Pet[]>(() => {
    // Use mock data if contract not deployed (package ID is 0x0)
    if (MOCHI_PET_TYPE.startsWith("0x0::")) {
      return MOCK_PETS;
    }

    if (!data?.data) return [];

    return data.data
      .map((obj) => {
        const content = obj.data?.content;
        if (content?.dataType !== "moveObject") {
          return null;
        }

        const fields = content.fields as Record<string, unknown>;
        const storedSatiety = Number(fields.satiety ?? 0);
        const lastFed = Number(fields.last_fed ?? 0);
        const currentSatiety = calculateCurrentSatiety(storedSatiety, lastFed);

        return {
          id: obj.data?.objectId ?? "",
          name: String(fields.name ?? "Unknown"),
          satiety: currentSatiety,
          bornAt: Number(fields.born_at ?? 0),
          lastFed: lastFed,
          isAlive: currentSatiety > 0,
        } as Pet;
      })
      .filter((pet): pet is Pet => pet !== null);
  }, [data]);

  return {
    pets,
    isLoading,
    error,
    refetch,
  };
}
