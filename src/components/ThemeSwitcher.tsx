import { m, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useId, useState } from "react";
import { useTheme, accentThemes } from "./ThemeProvider";
import { useDismissable } from "@/hooks/useDismissable";

const ThemeSwitcher = () => {
  const { accentTheme, setAccentTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { containerRef, triggerRef } = useDismissable<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Change theme colour"
        className="group grid place-items-center w-10 h-10 rounded-full border border-foreground/15 hover:border-foreground transition-colors cursor-pointer"
      >
        <span
          aria-hidden="true"
          className="block w-3.5 h-3.5 rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-125"
        />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id={menuId}
            role="menu"
            aria-label="Signal colour"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 z-50 w-56 rounded-lg border border-border bg-popover p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)]"
          >
            <p className="label px-2.5 pt-2 pb-2.5">Signal colour</p>
            {accentThemes.map((t) => {
              const selected = accentTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => {
                    setAccentTheme(t.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-left hover:bg-muted transition-colors cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ background: `hsl(${t.accent})` }}
                  />
                  <span className="flex-1">{t.label}</span>
                  {selected && <Check aria-hidden="true" className="w-4 h-4" />}
                </button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
