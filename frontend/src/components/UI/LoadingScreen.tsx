import { motion, AnimatePresence } from "framer-motion";
import { useGlobeStore } from "../../store/useGlobeStore";

/** Paw print SVG icon */
function PawIcon(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-16 h-16"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="22" cy="12" rx="7" ry="9" />
      <ellipse cx="42" cy="12" rx="7" ry="9" />
      <ellipse cx="10" cy="28" rx="6" ry="8" />
      <ellipse cx="54" cy="28" rx="6" ry="8" />
      <path d="M32 56c-12 0-22-10-18-20 2-5 8-10 18-10s16 5 18 10c4 10-6 20-18 20z" />
    </svg>
  );
}

/** Full-screen loading overlay with animated paw print */
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
          transition={{ duration: 0.8, ease: "easeInOut" }}
          aria-label="Loading breed data"
          role="status"
        >
          <motion.div
            className="text-[#00FFB3] mb-6"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <PawIcon />
          </motion.div>

          <h2 className="text-xl font-light text-[#E8EDF0] mb-4 tracking-widest">
            WORLD DOG GLOBE
          </h2>

          {error ? (
            <p className="text-red-400 text-sm max-w-md text-center px-4">
              {error}
            </p>
          ) : (
            <div className="w-48 h-1 bg-[#0a1628] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#00FFB3] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </div>
          )}

          <p className="text-[#E8EDF0]/40 text-xs mt-4 tracking-wider">
            Loading {error ? "" : "breed data..."}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
