import { motion, AnimatePresence } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";

/** Stat bar component for physical measurements */
function StatBar({
  label,
  min,
  max,
  unit,
  maxValue,
  color,
}: {
  label: string;
  min: number;
  max: number;
  unit: string;
  maxValue: number;
  color: "teal" | "gold";
}): React.JSX.Element {
  const pct = (max / maxValue) * 100;
  const gradient =
    color === "teal"
      ? "from-[#00FFB3]/40 via-[#00FFB3]/70 to-[#00FFB3]"
      : "from-[#F5A623]/40 via-[#F5A623]/70 to-[#F5A623]";

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[#E8EDF0]/50 tracking-wide">{label}</span>
        <span className="text-[#E8EDF0]/90 font-medium tabular-nums">
          {min}-{max} {unit}
        </span>
      </div>
      <div className="h-1.5 bg-[#0a1628] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
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
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => selectBreed(null)}
            aria-hidden="true"
          />

          {/* Close button — fixed over the panel, not inside scroll */}
          <motion.button
            className="fixed top-4 z-50 p-2 rounded-lg
              text-[#E8EDF0]/60 hover:text-[#E8EDF0]
              hover:bg-[#E8EDF0]/10 bg-[#050A0E]/60 backdrop-blur-sm
              transition-all"
            style={{ right: "calc(min(100%, 24rem) - 2.5rem)" }}
            onClick={() => selectBreed(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
            aria-label="Close breed details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-sm
              bg-gradient-to-b from-[#050A0E]/98 to-[#0a1220]/98
              backdrop-blur-2xl
              border-l border-[#00FFB3]/10
              overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-label={`Details for ${breed.name}`}
          >
            {/* Header image with layered gradients */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={breed.image}
                alt={breed.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050A0E]/30 via-transparent to-[#050A0E]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050A0E]/40 to-transparent" />
              {/* Teal glow accent at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, #00FFB3, transparent)",
                  boxShadow: "0 0 20px rgba(0,255,179,0.3)",
                }}
              />
            </div>

            <div className="px-6 -mt-16 relative">
              {/* Breed photo with glow */}
              <div className="relative inline-block mb-4">
                <img
                  src={breed.image}
                  alt={breed.name}
                  className="w-24 h-24 rounded-full border-2 border-[#00FFB3]/50
                    shadow-lg shadow-[#00FFB3]/20 object-cover"
                />
                <div
                  className="absolute -inset-1 rounded-full -z-10"
                  style={{
                    background: "radial-gradient(circle, rgba(0,255,179,0.15), transparent 70%)",
                  }}
                />
              </div>

              {/* Name & origin */}
              <motion.h2
                className="text-2xl font-bold text-[#E8EDF0] mb-1 glow-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                {breed.name}
              </motion.h2>
              <motion.p
                className="text-[#E8EDF0]/50 text-sm mb-4 flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {breed.origin_country}
                {breed.popularity_rank && (
                  <span className="text-[#F5A623]/80 bg-[#F5A623]/10 px-2 py-0.5 rounded-full text-xs">
                    #{breed.popularity_rank}
                  </span>
                )}
              </motion.p>

              {/* Tags */}
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Tag label={breed.group} color="teal" />
                <Tag label={breed.size} color="teal" />
                <Tag label={breed.life_expectancy} color="gold" />
              </motion.div>

              {/* Divider */}
              <div
                className="h-px mb-6"
                style={{
                  background: "linear-gradient(90deg, rgba(0,255,179,0.2), transparent)",
                }}
              />

              {/* Description */}
              <Section title="Overview" delay={0.3}>
                <p className="text-[#E8EDF0]/70 text-sm leading-relaxed">
                  {breed.description}
                </p>
              </Section>

              {/* Physical stats */}
              <Section title="Physical Stats" delay={0.35}>
                <StatBar
                  label="Weight"
                  min={breed.weight_kg.min}
                  max={breed.weight_kg.max}
                  unit="kg"
                  maxValue={90}
                  color="teal"
                />
                <StatBar
                  label="Height"
                  min={breed.height_cm.min}
                  max={breed.height_cm.max}
                  unit="cm"
                  maxValue={90}
                  color="gold"
                />
              </Section>

              {/* Temperament */}
              <Section title="Temperament" delay={0.4}>
                <div className="flex flex-wrap gap-2">
                  {breed.temperament.map((t, i) => (
                    <motion.span
                      key={t}
                      className="px-2.5 py-1 rounded-full
                        bg-[#F5A623]/10 text-[#F5A623]/90
                        text-xs border border-[#F5A623]/20
                        hover:bg-[#F5A623]/20 transition-colors"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                    >
                      {t}
                    </motion.span>
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

/** Section heading with animation */
function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}): React.JSX.Element {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <h3 className="text-[#E8EDF0]/40 text-xs font-medium tracking-wider uppercase mb-3">
        {title}
      </h3>
      {children}
    </motion.div>
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
      ? "bg-[#00FFB3]/10 text-[#00FFB3]/90 border-[#00FFB3]/20 hover:bg-[#00FFB3]/20"
      : "bg-[#F5A623]/10 text-[#F5A623]/90 border-[#F5A623]/20 hover:bg-[#F5A623]/20";

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${colors}`}>
      {label}
    </span>
  );
}
