import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        const remaining = 100 - p;
        return p + Math.max(1, remaining * 0.08);
      });
    }, 30);

    const exitTimer = setTimeout(() => setExiting(true), 2200);
    const completeTimer = setTimeout(() => onComplete(), 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
        >
          {/* Animated background blobs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
            />
          </motion.div>

          <div className="flex flex-col items-center gap-10 relative z-10">
            {/* Logo */}
            <div className="relative">
              {/* Ring animations */}
              <motion.svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                className="absolute -inset-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.circle
                  cx="80" cy="80" r="75"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="80" cy="80" r="68"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="0.5"
                  strokeDasharray="3 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15, rotate: 360 }}
                  transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
                />
              </motion.svg>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="relative w-[150px] h-[150px] flex items-center justify-center"
              >
                {/* Gradient bg */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="absolute inset-6 rounded-2xl"
                  style={{ background: "var(--gradient-primary)", opacity: 0.08 }}
                />

                {/* Logo mark + text */}
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <span className="font-heading text-xl font-bold text-primary-foreground">M</span>
                  </motion.div>
                  <div className="flex items-baseline">
                    {["M", "W", "N"].map((letter, i) => (
                      <motion.span
                        key={i}
                        initial={{ y: 20, opacity: 0, filter: "blur(6px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{
                          delay: 0.5 + i * 0.08,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        }}
                        className="font-heading text-3xl font-bold text-foreground"
                      >
                        {letter}
                      </motion.span>
                    ))}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.4, 1] }}
                      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                      className="font-heading text-3xl font-bold text-accent ml-0.5"
                    >
                      .
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              {/* Orbiting dots */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-4"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5, 1] }}
                  transition={{ delay: 0.8, duration: 2, repeat: Infinity }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent"
                />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-2"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-[11px] text-muted-foreground tracking-[0.35em] uppercase font-heading"
            >
              Portfolio
            </motion.p>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 180 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-full h-[2px] rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1 }}
                className="text-[10px] text-muted-foreground font-heading tabular-nums"
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
