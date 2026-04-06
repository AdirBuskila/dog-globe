import { Globe } from "./components/Globe/Globe";
import { GlobeErrorBoundary } from "./components/Layout/AppShell";
import { SearchBar } from "./components/UI/SearchBar";
import { FilterPanel } from "./components/UI/FilterPanel";
import { BreedDetailPanel } from "./components/UI/BreedDetailPanel";
import { LoadingScreen } from "./components/UI/LoadingScreen";
import { useBreedData } from "./hooks/useBreedData";
import { useFilteredBreeds } from "./hooks/useFilteredBreeds";
import { useGlobeStore } from "./store/useGlobeStore";

/** Breed count indicator */
function BreedCounter(): React.JSX.Element {
  const filteredBreeds = useFilteredBreeds();
  const totalBreeds = useGlobeStore((s) => s.breeds.length);
  const isLoading = useGlobeStore((s) => s.isLoading);

  if (isLoading || totalBreeds === 0) return <></>;

  const showing = filteredBreeds.length;
  const isFiltered = showing < totalBreeds;

  return (
    <div
      className="fixed top-4 right-4 z-20 px-3 py-1.5 rounded-lg
        glass-panel text-[#E8EDF0]/40 text-xs"
      aria-live="polite"
    >
      {isFiltered
        ? `${showing} of ${totalBreeds} breeds`
        : `${totalBreeds} breeds worldwide`}
    </div>
  );
}

/** Root application component */
export default function App(): React.JSX.Element {
  useBreedData();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050A0E] vignette scene-gradient">
      {/* Loading overlay */}
      <LoadingScreen />

      {/* 3D Globe */}
      <GlobeErrorBoundary>
        <Globe />
      </GlobeErrorBoundary>

      {/* UI overlay */}
      <SearchBar />
      <FilterPanel />
      <BreedDetailPanel />
      <BreedCounter />
    </div>
  );
}
