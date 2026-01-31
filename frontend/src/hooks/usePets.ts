"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { Pet, SATIETY_DECAY_PER_DAY, MS_PER_DAY } from "@/types";
import { MOCHI_PET_TYPE } from "@/lib/contracts";

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
