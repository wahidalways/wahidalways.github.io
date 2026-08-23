import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const SEEN_KEY = "preloaderSeen";

// The sequence lands inside EXIT_AT; the window up to COMPLETE_AT is the fade.
// Kept deliberately short, because this splash sits in front of the LCP — every
// millisecond spent here is a millisecond a visitor waits on an empty page.
const EXIT_AT = 850;
const COMPLETE_AT = 1250;

/**
 * First visit of the session only, and never under reduced motion — a purely
 * decorative delay is exactly what that setting exists to suppress.
 */
export const shouldShowPreloader = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    // Storage is blocked, so "seen" can never be recorded. Running the splash on
    // every single load is the worse of the two failure modes; skip it instead.
    return false;
  }
};

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked — nothing to record, the splash simply runs again */
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        const remaining = 100 - p;
        return p + Math.max(1, remaining * 0.14);
      });
    }, 20);

    const exitTimer = setTimeout(() => setExiting(true), EXIT_AT);
    const completeTimer = setTimeout(() => onComplete(), COMPLETE_AT);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <m.div
          key="preloader"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
        >
          {/* Animated background blobs */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl anim-loop anim-blob-a"
              style={{ "--dur": "8s" } as React.CSSProperties}
            />
            <div
              className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl anim-loop anim-blob-b"
              style={{ "--dur": "10s" } as React.CSSProperties}
            />
          </m.div>

          <div className="flex flex-col items-center gap-10 relative z-10">
            {/* Logo */}
            <div className="relative">
              {/* Ring animations */}
              <m.svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                className="absolute -inset-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <m.circle
                  cx="80" cy="80" r="75"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeInOut" }}
                />
                <m.circle
                  cx="80" cy="80" r="68"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="0.5"
                  strokeDasharray="3 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15, rotate: 360 }}
                  transition={{ duration: 0.9, delay: 0.15, ease: "easeInOut" }}
                />
              </m.svg>

              <m.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="relative w-[150px] h-[150px] flex items-center justify-center"
              >
                {/* Gradient bg */}
                <m.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="absolute inset-6 rounded-2xl"
                  style={{ background: "var(--gradient-primary)", opacity: 0.08 }}
                />

                {/* Logo mark + text */}
                <div className="flex items-center gap-2">
                  <m.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <span className="font-heading text-xl font-bold text-primary-foreground">M</span>
                  </m.div>
                  <div className="flex items-baseline">
                    {["M", "W", "N"].map((letter, i) => (
                      <m.span
                        key={i}
                        initial={{ y: 20, opacity: 0, filter: "blur(6px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{
                          delay: 0.22 + i * 0.06,
                          duration: 0.35,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        }}
                        className="font-heading text-3xl font-bold text-foreground"
                      >
                        {letter}
                      </m.span>
                    ))}
                    <m.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.4, 1] }}
                      transition={{ delay: 0.45, duration: 0.3, ease: "easeOut" }}
                      className="font-heading text-3xl font-bold text-accent ml-0.5"
                    >
                      .
                    </m.span>
                  </div>
                </div>
              </m.div>

              {/* Orbiting dots */}
              <div
                className="absolute inset-0 -m-4 anim-loop anim-spin"
                style={{ "--dur": "4s" } as React.CSSProperties}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent anim-loop anim-pulse-fade"
                  style={{ "--dur": "2s", "--delay": "0.3s" } as React.CSSProperties}
                />
              </div>
              <div
                className="absolute inset-0 -m-2 anim-loop anim-spin-reverse"
                style={{ "--dur": "6s" } as React.CSSProperties}
              >
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              </div>
            </div>

            {/* Tagline */}
            <m.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              className="text-[11px] text-muted-foreground tracking-[0.35em] uppercase font-heading"
            >
              Portfolio
            </m.p>

            {/* Progress */}
            <m.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 180 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-full h-[2px] rounded-full bg-border overflow-hidden">
                <m.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              </div>
              <m.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.4 }}
                className="text-[10px] text-muted-foreground font-heading tabular-nums"
              >
                {Math.round(progress)}%
              </m.span>
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
