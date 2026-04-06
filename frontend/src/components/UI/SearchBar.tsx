import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";
import { SEARCH_SHORTCUT } from "../../constants";

/** Glass-morphism search bar with glow effect */
export function SearchBar(): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchQuery = useGlobeStore((s) => s.searchQuery);
  const setSearchQuery = useGlobeStore((s) => s.setSearchQuery);
  const breeds = useGlobeStore((s) => s.breeds);
  const [focused, setFocused] = useState(false);

  /** Focus on CMD/CTRL+K */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === SEARCH_SHORTCUT) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        inputRef.current?.blur();
      }
    },
    [setSearchQuery]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      className="fixed top-4 left-1/2 z-30 w-full max-w-md px-4"
      style={{ x: "-50%" }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <div className="relative">
        {/* Glow effect behind search bar when focused */}
        <div
          className="absolute -inset-1 rounded-2xl transition-opacity duration-300 -z-10"
          style={{
            opacity: focused ? 1 : 0,
            background: "radial-gradient(ellipse, rgba(0,255,179,0.08), transparent 70%)",
          }}
        />

        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className={`w-4 h-4 transition-colors duration-200 ${
              focused ? "text-[#00FFB3]" : "text-[#00FFB3]/50"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Search ${breeds.length} breeds... (Ctrl+K)`}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl
            bg-[#0a1628]/80 backdrop-blur-xl
            border border-[#00FFB3]/15
            text-[#E8EDF0] text-sm
            placeholder-[#E8EDF0]/25
            focus:outline-none focus:border-[#00FFB3]/50
            focus:ring-1 focus:ring-[#00FFB3]/20
            focus:bg-[#0a1628]/90
            transition-all duration-200"
          aria-label="Search dog breeds"
        />

        {searchQuery && (
          <button
            className="absolute inset-y-0 right-3 flex items-center text-[#E8EDF0]/40 hover:text-[#E8EDF0]/80 transition-colors"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
