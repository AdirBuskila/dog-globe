import { motion, AnimatePresence } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";

/** Country flag emoji from country name (best-effort) */
function getCountryFlag(country: string): string {
  const FLAGS: Record<string, string> = {
    "United Kingdom": "\u{1F1EC}\u{1F1E7}",
    "Germany": "\u{1F1E9}\u{1F1EA}",
    "France": "\u{1F1EB}\u{1F1F7}",
    "Japan": "\u{1F1EF}\u{1F1F5}",
    "China": "\u{1F1E8}\u{1F1F3}",
    "Russia": "\u{1F1F7}\u{1F1FA}",
    "Australia": "\u{1F1E6}\u{1F1FA}",
    "United States": "\u{1F1FA}\u{1F1F8}",
    "Canada": "\u{1F1E8}\u{1F1E6}",
    "Mexico": "\u{1F1F2}\u{1F1FD}",
    "Italy": "\u{1F1EE}\u{1F1F9}",
    "Spain": "\u{1F1EA}\u{1F1F8}",
    "Portugal": "\u{1F1F5}\u{1F1F9}",
    "Belgium": "\u{1F1E7}\u{1F1EA}",
    "Netherlands": "\u{1F1F3}\u{1F1F1}",
    "Switzerland": "\u{1F1E8}\u{1F1ED}",
    "Austria": "\u{1F1E6}\u{1F1F9}",
    "Hungary": "\u{1F1ED}\u{1F1FA}",
    "Czech Republic": "\u{1F1E8}\u{1F1FF}",
    "Poland": "\u{1F1F5}\u{1F1F1}",
    "Sweden": "\u{1F1F8}\u{1F1EA}",
    "Norway": "\u{1F1F3}\u{1F1F4}",
    "Finland": "\u{1F1EB}\u{1F1EE}",
    "Denmark": "\u{1F1E9}\u{1F1F0}",
    "Ireland": "\u{1F1EE}\u{1F1EA}",
    "Scotland": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
    "Turkey": "\u{1F1F9}\u{1F1F7}",
    "Iran": "\u{1F1EE}\u{1F1F7}",
    "Afghanistan": "\u{1F1E6}\u{1F1EB}",
    "Tibet": "\u{1F1E8}\u{1F1F3}",
    "South Korea": "\u{1F1F0}\u{1F1F7}",
    "Thailand": "\u{1F1F9}\u{1F1ED}",
    "India": "\u{1F1EE}\u{1F1F3}",
    "Israel": "\u{1F1EE}\u{1F1F1}",
    "Egypt": "\u{1F1EA}\u{1F1EC}",
    "South Africa": "\u{1F1FF}\u{1F1E6}",
    "Morocco": "\u{1F1F2}\u{1F1E6}",
    "Mali": "\u{1F1F2}\u{1F1F1}",
    "Congo": "\u{1F1E8}\u{1F1EC}",
    "Madagascar": "\u{1F1F2}\u{1F1EC}",
    "Cuba": "\u{1F1E8}\u{1F1FA}",
    "Peru": "\u{1F1F5}\u{1F1EA}",
    "Croatia": "\u{1F1ED}\u{1F1F7}",
    "Slovenia": "\u{1F1F8}\u{1F1EE}",
    "Malta": "\u{1F1F2}\u{1F1F9}",
    "Greece": "\u{1F1EC}\u{1F1F7}",
    "Romania": "\u{1F1F7}\u{1F1F4}",
    "Brazil": "\u{1F1E7}\u{1F1F7}",
    "Argentina": "\u{1F1E6}\u{1F1F7}",
    "Wales": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}",
    "Bulgaria": "\u{1F1E7}\u{1F1EC}",
    "Serbia": "\u{1F1F7}\u{1F1F8}",
  };
  return FLAGS[country] ?? "\u{1F30D}";
}

/** Hover tooltip that appears near the cursor area */
export function BreedTooltip(): React.JSX.Element {
  const hoveredBreed = useGlobeStore((s) => s.hoveredBreed);
  const selectedBreed = useGlobeStore((s) => s.selectedBreed);

  const breed = hoveredBreed && !selectedBreed ? hoveredBreed : null;

  return (
    <AnimatePresence>
      {breed && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-40 pointer-events-none"
          style={{ x: "-50%" }}
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl
              bg-[#0a1628]/90 backdrop-blur-xl
              border border-[#00FFB3]/20
              shadow-lg shadow-[#00FFB3]/5"
          >
            <img
              src={breed.image}
              alt={breed.name}
              className="w-12 h-12 rounded-full object-cover border border-[#00FFB3]/30"
            />
            <div>
              <p className="text-[#E8EDF0] font-medium text-sm">
                {breed.name}
              </p>
              <p className="text-[#E8EDF0]/50 text-xs">
                {getCountryFlag(breed.origin_country)} {breed.origin_country}
                <span className="mx-1.5 text-[#00FFB3]/30">|</span>
                {breed.group}
                <span className="mx-1.5 text-[#00FFB3]/30">|</span>
                {breed.size}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
