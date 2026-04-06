import { useCallback } from "react";
import { motion } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";
import type { BreedGroup, BreedSize } from "../../types/breed";

const GROUPS: BreedGroup[] = [
  "Sporting", "Hound", "Working", "Terrier",
  "Toy", "Non-Sporting", "Herding",
];

const SIZES: BreedSize[] = ["Small", "Medium", "Large", "Giant"];

/** Horizontal bottom category tabs matching ohmo.ai style */
export function FilterPanel(): React.JSX.Element {
  const filters = useGlobeStore((s) => s.filters);
  const setFilter = useGlobeStore((s) => s.setFilter);
  const clearFilters = useGlobeStore((s) => s.clearFilters);
  const isLoading = useGlobeStore((s) => s.isLoading);

  const activeGroup = filters.group;
  const activeSize = filters.size;
  const hasActiveFilter = activeGroup !== null || activeSize !== null || filters.temperament !== null;

  const handleGroupClick = useCallback(
    (group: BreedGroup) => {
      if (filters.group === group) {
        setFilter("group", null);
      } else {
        setFilter("group", group);
        setFilter("size", null);
        setFilter("temperament", null);
      }
    },
    [filters.group, setFilter]
  );

  const handleSizeClick = useCallback(
    (size: BreedSize) => {
      if (filters.size === size) {
        setFilter("size", null);
      } else {
        setFilter("size", size);
        setFilter("group", null);
        setFilter("temperament", null);
      }
    },
    [filters.size, setFilter]
  );

  const handleAllClick = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  if (isLoading) return <></>;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-30"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      {/* Gradient fade above tabs */}
      <div
        className="h-8 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(5,10,14,0.6), transparent)",
        }}
      />

      {/* Tab bar */}
      <div
        className="flex items-center justify-center gap-1 px-4 pb-4 pt-2
          overflow-x-auto scrollbar-none"
        role="tablist"
        aria-label="Filter breeds by category"
      >
        {/* All tab */}
        <TabButton
          label="All"
          active={!hasActiveFilter}
          onClick={handleAllClick}
        />

        {/* Separator */}
        <div className="w-px h-4 bg-[#E8EDF0]/10 mx-1" />

        {/* Group tabs */}
        {GROUPS.map((g) => (
          <TabButton
            key={g}
            label={g}
            active={activeGroup === g}
            onClick={() => handleGroupClick(g)}
          />
        ))}

        {/* Separator */}
        <div className="w-px h-4 bg-[#E8EDF0]/10 mx-1" />

        {/* Size tabs */}
        {SIZES.map((s) => (
          <TabButton
            key={s}
            label={s}
            active={activeSize === s}
            onClick={() => handleSizeClick(s)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/** Individual tab button */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button
      className={`relative px-3 py-1.5 rounded-full text-xs tracking-wide
        transition-all duration-200 whitespace-nowrap
        ${
          active
            ? "text-[#00FFB3] bg-[#00FFB3]/10"
            : "text-[#E8EDF0]/40 hover:text-[#E8EDF0]/70"
        }`}
      onClick={onClick}
      role="tab"
      aria-selected={active}
    >
      {label}
      {active && (
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-[#00FFB3]"
          style={{ x: "-50%" }}
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}
