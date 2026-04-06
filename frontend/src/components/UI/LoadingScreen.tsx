import { motion, AnimatePresence } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";

/** Animated globe wireframe SVG for loading */
function GlobeWireframe(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-40 h-40"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer circle */}
      <motion.circle
        cx="100"
        cy="100"
        r="90"
        stroke="#00FFB3"
        strokeWidth="0.8"
        strokeOpacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* Horizontal lines (latitudes) */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const y = 100 - lat * 0.9;
        const rx = Math.cos((lat * Math.PI) / 180) * 90;
        return (
          <motion.ellipse
            key={`lat-${lat}`}
            cx="100"
            cy={y}
            rx={rx}
            ry={rx * 0.15}
            stroke="#00FFB3"
            strokeWidth="0.5"
            strokeOpacity={lat === 0 ? "0.5" : "0.2"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.3 + Math.abs(lat) * 0.005 }}
          />
        );
      })}
      {/* Vertical lines (longitudes) */}
      {[0, 30, 60, 90, 120, 150].map((lng) => {
        const rx = Math.sin((lng * Math.PI) / 180) * 90;
        return (
          <motion.ellipse
            key={`lng-${lng}`}
            cx="100"
            cy="100"
            rx={Math.max(rx, 0.5)}
            ry="90"
            stroke="#00FFB3"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 + lng * 0.003 }}
          />
        );
      })}
      {/* Glow pulse */}
      <motion.circle
        cx="100"
        cy="100"
        r="92"
        stroke="#00FFB3"
        strokeWidth="2"
        strokeOpacity="0.1"
        animate={{ r: [92, 98, 92], strokeOpacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Floating particles in loading screen */
function LoadingParticles(): React.JSX.Element {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#00FFB3]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/** Full-screen cinematic loading overlay */
export function LoadingScreen(): React.JSX.Element {
  const isLoading = useGlobeStore((s) => s.isLoading);
  const error = useGlobeStore((s) => s.error);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050A0E]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          aria-label="Loading breed data"
          role="status"
        >
          {/* Background particles */}
          <LoadingParticles />

          {/* Radial gradient backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0,255,179,0.03) 0%, transparent 60%)",
            }}
          />

          {/* Animated globe wireframe */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ perspective: 600 }}
          >
            <GlobeWireframe />
          </motion.div>

          {/* Title */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h1 className="text-3xl font-extralight text-[#E8EDF0] tracking-[0.3em] mb-1">
              WORLD DOG
            </h1>
            <h2 className="text-lg font-light text-[#00FFB3] tracking-[0.5em]">
              GLOBE
            </h2>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {error ? (
              <p className="text-red-400 text-sm max-w-md text-center px-4">
                {error}
              </p>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-56 h-px bg-[#0a1628] rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #00FFB3, transparent)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  />
                </div>
                <motion.p
                  className="text-[#E8EDF0]/30 text-xs tracking-[0.2em]"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  MAPPING BREEDS WORLDWIDE
                </motion.p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
