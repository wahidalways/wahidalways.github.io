import { m, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "preloaderSeen";

// The count lands inside EXIT_AT; the window up to COMPLETE_AT is the curtain.
// Kept deliberately short, because this splash sits in front of the LCP.
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
  const [exiting, setExiting] = useState(false);
  // The count and bar are written directly each frame. As state, they
  // re-rendered the whole splash ~50 times in under a second, on the exact
  // frames the page is also parsing and laying itself out.
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked — nothing to record, the splash simply runs again */
    }

    let raf = 0;
    let start = 0;
    let shown = -1;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / (EXIT_AT - 120));
      const value = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      // Only touch the DOM when the displayed number actually changes.
      if (value !== shown) {
        shown = value;
        if (countRef.current) countRef.current.textContent = String(value).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const exitTimer = setTimeout(() => setExiting(true), EXIT_AT);
    const completeTimer = setTimeout(() => onComplete(), COMPLETE_AT);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <m.div
          key="preloader"
          aria-hidden="true"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className="band-ink fixed inset-0 z-[9999] flex flex-col justify-between bg-background text-foreground"
        >
          <div className="shell flex items-start justify-between pt-6">
            <span className="label text-foreground">MWN — Portfolio</span>
            <span className="label hidden sm:block">Technical Business Analyst</span>
          </div>

          <div className="shell pb-6">
            <div className="flex items-end justify-between gap-6">
              <span ref={countRef} className="display tabular-nums text-[34vw] sm:text-[22vw] lg:text-[16rem] leading-[0.8]">
                000
              </span>
              <span className="label pb-3 text-right">
                Dhaka,
                <br />
                Bangladesh
              </span>
            </div>
            <div className="mt-6 h-px w-full bg-border overflow-hidden">
              <div ref={barRef} className="h-full bg-accent origin-left" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
