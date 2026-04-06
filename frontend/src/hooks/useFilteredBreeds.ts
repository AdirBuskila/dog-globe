import { useMemo } from "react";
import { useGlobeStore } from "../store/useGlobeStore";
import type { Breed } from "../types/breed";

/** Returns breeds filtered by current search query and active filters */
export function useFilteredBreeds(): Breed[] {
  const breeds = useGlobeStore((s) => s.breeds);
  const searchQuery = useGlobeStore((s) => s.searchQuery);
  const filters = useGlobeStore((s) => s.filters);

  return useMemo(() => {
    let result = breeds;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.origin_country.toLowerCase().includes(q) ||
          b.group.toLowerCase().includes(q)
      );
    }

    if (filters.group) {
      result = result.filter((b) => b.group === filters.group);
    }

    if (filters.size) {
      result = result.filter((b) => b.size === filters.size);
    }

    if (filters.temperament) {
      const t = filters.temperament.toLowerCase();
      result = result.filter((b) =>
        b.temperament.some((trait) => trait.toLowerCase().includes(t))
      );
    }

    return result;
  }, [breeds, searchQuery, filters]);
}
