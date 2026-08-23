import { m, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useId, useState } from "react";
import { useTheme, colorThemes } from "./ThemeProvider";
import { useDismissable } from "@/hooks/useDismissable";

const ThemeSwitcher = () => {
  const { colorTheme, setColorTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { containerRef, triggerRef } = useDismissable<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <m.button
        ref={triggerRef}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
        aria-label="Change theme colour"
      >
        <Palette aria-hidden="true" className="w-4 h-4" />
      </m.button>

      <AnimatePresence>
        {open && (
          <m.div
            id={menuId}
            role="menu"
            aria-label="Colour theme"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl shadow-lg p-3 min-w-[220px]"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2.5 px-1">Color Theme</p>
            <div className="grid grid-cols-5 gap-2">
              {colorThemes.map((t) => {
                const selected = colorTheme === t.id;
                return (
                  <m.button
                    key={t.id}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setColorTheme(t.id); setOpen(false); }}
                    role="menuitemradio"
                    aria-checked={selected}
                    // The swatch has no text, so the colour name is the only
                    // thing a screen reader can announce. `title` alone would
                    // not be exposed reliably.
                    aria-label={t.label}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      selected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ background: `linear-gradient(135deg, hsl(${t.primary}), hsl(${t.accent}))` }}
                    title={t.label}
                  >
                    {selected && <Check aria-hidden="true" className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                  </m.button>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
