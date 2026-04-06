import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";
import type { BreedGroup, BreedSize } from "../../types/breed";

const GROUPS: BreedGroup[] = [
  "Sporting", "Hound", "Working", "Terrier",
  "Toy", "Non-Sporting", "Herding",
  "Foundation Stock Service", "Miscellaneous",
];

const SIZES: BreedSize[] = ["Small", "Medium", "Large", "Giant"];

const TEMPERAMENTS = [
  "Friendly", "Loyal", "Energetic", "Gentle",
  "Intelligent", "Independent", "Playful", "Calm",
  "Alert", "Protective", "Affectionate", "Brave",
];

/** Collapsible filter panel on the left side */
export function FilterPanel(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const filters = useGlobeStore((s) => s.filters);
  const setFilter = useGlobeStore((s) => s.setFilter);
  const clearFilters = useGlobeStore((s) => s.clearFilters);

  const activeCount =
    (filters.group ? 1 : 0) +
    (filters.size ? 1 : 0) +
    (filters.temperament ? 1 : 0);

  const handleGroupClick = useCallback(
    (group: BreedGroup) => {
      setFilter("group", filters.group === group ? null : group);
    },
    [filters.group, setFilter]
  );

  const handleSizeClick = useCallback(
    (size: BreedSize) => {
      setFilter("size", filters.size === size ? null : size);
    },
    [filters.size, setFilter]
  );

  const handleTemperamentClick = useCallback(
    (temperament: string) => {
      setFilter(
        "temperament",
        filters.temperament === temperament ? null : temperament
      );
    },
    [filters.temperament, setFilter]
  );

  return (
    <>
      {/* Toggle button */}
      <motion.button
        className="fixed left-4 top-1/2 z-30 p-2.5 rounded-lg
          bg-[#0a1628]/80 backdrop-blur-xl
          border border-[#00FFB3]/20
          text-[#00FFB3] hover:border-[#00FFB3]/50
          transition-all duration-200"
        style={{ y: "-50%" }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        aria-label={isOpen ? "Close filters" : "Open filters"}
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00FFB3] text-[#050A0E] text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 top-0 bottom-0 z-20 w-72 p-6 pt-20
              bg-[#050A0E]/95 backdrop-blur-xl
              border-r border-[#00FFB3]/10
              overflow-y-auto"
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="complementary"
            aria-label="Breed filters"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#E8EDF0] font-semibold text-sm tracking-wider uppercase">
                Filters
              </h3>
              {activeCount > 0 && (
                <button
                  className="text-[#00FFB3]/60 hover:text-[#00FFB3] text-xs transition-colors"
                  onClick={clearFilters}
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.group && (
                  <Chip
                    label={filters.group}
                    onRemove={() => setFilter("group", null)}
                  />
                )}
                {filters.size && (
                  <Chip
                    label={filters.size}
                    onRemove={() => setFilter("size", null)}
                  />
                )}
                {filters.temperament && (
                  <Chip
                    label={filters.temperament}
                    onRemove={() => setFilter("temperament", null)}
                  />
                )}
              </div>
            )}

            {/* Group filter */}
            <FilterSection title="Group">
              {GROUPS.map((g) => (
                <FilterButton
                  key={g}
                  label={g}
                  active={filters.group === g}
                  onClick={() => handleGroupClick(g)}
                />
              ))}
            </FilterSection>

            {/* Size filter */}
            <FilterSection title="Size">
              {SIZES.map((s) => (
                <FilterButton
                  key={s}
                  label={s}
                  active={filters.size === s}
                  onClick={() => handleSizeClick(s)}
                />
              ))}
            </FilterSection>

            {/* Temperament filter */}
            <FilterSection title="Temperament">
              {TEMPERAMENTS.map((t) => (
                <FilterButton
                  key={t}
                  label={t}
                  active={filters.temperament === t}
                  onClick={() => handleTemperamentClick(t)}
                />
              ))}
            </FilterSection>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Filter section with title */
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="mb-6">
      <h4 className="text-[#E8EDF0]/50 text-xs font-medium tracking-wider uppercase mb-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

/** Individual filter button */
function FilterButton({
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
      className={`px-2.5 py-1 rounded-md text-xs transition-all duration-150
        ${
          active
            ? "bg-[#00FFB3]/20 text-[#00FFB3] border border-[#00FFB3]/40"
            : "bg-[#0a1628]/60 text-[#E8EDF0]/50 border border-[#E8EDF0]/10 hover:border-[#00FFB3]/20 hover:text-[#E8EDF0]/80"
        }`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

/** Dismissible active filter chip */
function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00FFB3]/15 text-[#00FFB3] text-xs">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-white transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        &times;
      </button>
    </span>
  );
}
