import { useEffect } from "react";
import { useGlobeStore } from "../store/useGlobeStore";
import { BREEDS_DATA_URL } from "../constants";
import type { Breed } from "../types/breed";

/** Fetches breed data on mount and loads it into the store */
export function useBreedData(): void {
  const setBreeds = useGlobeStore((s) => s.setBreeds);
  const setError = useGlobeStore((s) => s.setError);
  const setIsLoading = useGlobeStore((s) => s.setIsLoading);

  useEffect(() => {
    let cancelled = false;

    async function fetchBreeds(): Promise<void> {
      setIsLoading(true);
      try {
        const response = await fetch(BREEDS_DATA_URL);
        if (!response.ok) {
          throw new Error(`Failed to load breed data: ${response.status}`);
        }
        const data: Breed[] = await response.json();
        if (!cancelled) {
          setBreeds(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load breed data"
          );
        }
      }
    }

    fetchBreeds();

    return () => {
      cancelled = true;
    };
  }, [setBreeds, setError, setIsLoading]);
}
