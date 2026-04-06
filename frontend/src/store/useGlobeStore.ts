import { create } from "zustand";
import type { Breed, BreedFilters } from "../types/breed";

interface GlobeState {
  /** All loaded breed data */
  breeds: Breed[];
  /** Currently selected breed (detail panel open) */
  selectedBreed: Breed | null;
  /** Currently hovered breed (tooltip shown) */
  hoveredBreed: Breed | null;
  /** Search query string */
  searchQuery: string;
  /** Active filters */
  filters: BreedFilters;
  /** Whether globe auto-rotation is active */
  isRotating: boolean;
  /** Whether data is loading */
  isLoading: boolean;
  /** Load error message */
  error: string | null;
  /** Set the breed list */
  setBreeds: (breeds: Breed[]) => void;
  /** Select a breed (opens detail panel) */
  selectBreed: (breed: Breed | null) => void;
  /** Hover a breed (shows tooltip) */
  hoverBreed: (breed: Breed | null) => void;
  /** Update the search query */
  setSearchQuery: (query: string) => void;
  /** Update a specific filter */
  setFilter: <K extends keyof BreedFilters>(
    key: K,
    value: BreedFilters[K]
  ) => void;
  /** Clear all filters and search */
  clearFilters: () => void;
  /** Toggle globe rotation */
  setIsRotating: (rotating: boolean) => void;
  /** Set loading state */
  setIsLoading: (loading: boolean) => void;
  /** Set error state */
  setError: (error: string | null) => void;
}

const initialFilters: BreedFilters = {
  group: null,
  size: null,
  temperament: null,
};

/** Global store for globe state management */
export const useGlobeStore = create<GlobeState>((set) => ({
  breeds: [],
  selectedBreed: null,
  hoveredBreed: null,
  searchQuery: "",
  filters: { ...initialFilters },
  isRotating: true,
  isLoading: true,
  error: null,

  setBreeds: (breeds) => set({ breeds, isLoading: false }),

  selectBreed: (breed) =>
    set({
      selectedBreed: breed,
      hoveredBreed: null,
      isRotating: breed === null,
    }),

  hoverBreed: (breed) => set({ hoveredBreed: breed }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  clearFilters: () =>
    set({ filters: { ...initialFilters }, searchQuery: "" }),

  setIsRotating: (isRotating) => set({ isRotating }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),
}));
