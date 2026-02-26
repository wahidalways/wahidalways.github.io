import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme, colorThemes } from "./ThemeProvider";

const ThemeSwitcher = () => {
  const { colorTheme, setColorTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
        aria-label="Change theme color"
      >
        <Palette className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl shadow-lg p-3 min-w-[220px]"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2.5 px-1">Color Theme</p>
            <div className="grid grid-cols-5 gap-2">
              {colorThemes.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setColorTheme(t.id); setOpen(false); }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    colorTheme === t.id ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={{ background: `linear-gradient(135deg, hsl(${t.primary}), hsl(${t.accent}))` }}
                  title={t.label}
                >
                  {colorTheme === t.id && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
