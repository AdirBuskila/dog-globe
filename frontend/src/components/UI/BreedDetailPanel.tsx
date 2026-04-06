import { motion, AnimatePresence } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";

/** Stat bar component for physical measurements */
function StatBar({
  label,
  min,
  max,
  unit,
  maxValue,
}: {
  label: string;
  min: number;
  max: number;
  unit: string;
  maxValue: number;
}): React.JSX.Element {
  const pct = (max / maxValue) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#E8EDF0]/60">{label}</span>
        <span className="text-[#E8EDF0]/80">
          {min}-{max} {unit}
        </span>
      </div>
      <div className="h-1.5 bg-[#0a1628] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00FFB3]/60 to-[#00FFB3]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/** Full breed detail panel that slides in from the right */
export function BreedDetailPanel(): React.JSX.Element {
  const breed = useGlobeStore((s) => s.selectedBreed);
  const selectBreed = useGlobeStore((s) => s.selectBreed);

  return (
    <AnimatePresence>
      {breed && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => selectBreed(null)}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-sm
              bg-[#050A0E]/95 backdrop-blur-xl
              border-l border-[#00FFB3]/10
              overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-label={`Details for ${breed.name}`}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-lg
                text-[#E8EDF0]/40 hover:text-[#E8EDF0]
                hover:bg-[#E8EDF0]/5 transition-all"
              onClick={() => selectBreed(null)}
              aria-label="Close breed details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header image */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050A0E]" />
              <img
                src={breed.image}
                alt={breed.name}
                className="w-full h-full object-cover opacity-60"
              />
            </div>

            <div className="px-6 -mt-12 relative">
              {/* Breed photo */}
              <img
                src={breed.image}
                alt={breed.name}
                className="w-20 h-20 rounded-full border-2 border-[#00FFB3]/40
                  shadow-lg shadow-[#00FFB3]/10 object-cover mb-4"
              />

              {/* Name & origin */}
              <h2 className="text-2xl font-bold text-[#E8EDF0] mb-1">
                {breed.name}
              </h2>
              <p className="text-[#E8EDF0]/50 text-sm mb-4">
                {breed.origin_country}
                {breed.popularity_rank && (
                  <span className="ml-2 text-[#F5A623]/80">
                    #{breed.popularity_rank} popularity
                  </span>
                )}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag label={breed.group} color="teal" />
                <Tag label={breed.size} color="teal" />
                <Tag label={breed.life_expectancy} color="gold" />
              </div>

              {/* Description */}
              <Section title="Overview">
                <p className="text-[#E8EDF0]/70 text-sm leading-relaxed">
                  {breed.description}
                </p>
              </Section>

              {/* Physical stats */}
              <Section title="Physical Stats">
                <StatBar
                  label="Weight"
                  min={breed.weight_kg.min}
                  max={breed.weight_kg.max}
                  unit="kg"
                  maxValue={90}
                />
                <StatBar
                  label="Height"
                  min={breed.height_cm.min}
                  max={breed.height_cm.max}
                  unit="cm"
                  maxValue={90}
                />
              </Section>

              {/* Temperament */}
              <Section title="Temperament">
                <div className="flex flex-wrap gap-2">
                  {breed.temperament.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full
                        bg-[#F5A623]/10 text-[#F5A623]/90
                        text-xs border border-[#F5A623]/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Spacer at bottom */}
              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Section heading */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="mb-6">
      <h3 className="text-[#E8EDF0]/40 text-xs font-medium tracking-wider uppercase mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Styled tag/badge */
function Tag({
  label,
  color,
}: {
  label: string;
  color: "teal" | "gold";
}): React.JSX.Element {
  const colors =
    color === "teal"
      ? "bg-[#00FFB3]/10 text-[#00FFB3]/90 border-[#00FFB3]/20"
      : "bg-[#F5A623]/10 text-[#F5A623]/90 border-[#F5A623]/20";

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs border ${colors}`}>
      {label}
    </span>
  );
}
