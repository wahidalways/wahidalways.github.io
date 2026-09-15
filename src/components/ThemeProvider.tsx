import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type AccentTheme = "acid" | "signal" | "cobalt" | "violet" | "jade" | "amber";

interface ThemeContextType {
  theme: Theme;
  accentTheme: AccentTheme;
  toggleTheme: () => void;
  setAccentTheme: (id: AccentTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  accentTheme: "acid",
  toggleTheme: () => {},
  setAccentTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/*
 * Six curated signals, not a rainbow. Each carries four values: the fill, the
 * text colour that sits on that fill, and a text-safe variant for each ground —
 * a colour vivid enough to work as a fill almost never passes 4.5:1 as small
 * text on a light page.
 *
 * Mirrored in the boot script in index.html; change both together.
 */
export const accentThemes: {
  id: AccentTheme;
  label: string;
  accent: string;
  foreground: string;
  textLight: string;
  textDark: string;
}[] = [
  { id: "acid", label: "Acid", accent: "74 88% 56%", foreground: "60 4% 7%", textLight: "80 75% 27%", textDark: "74 88% 60%" },
  { id: "signal", label: "Signal", accent: "12 96% 52%", foreground: "60 4% 7%", textLight: "12 85% 40%", textDark: "14 100% 62%" },
  { id: "cobalt", label: "Cobalt", accent: "228 96% 60%", foreground: "0 0% 100%", textLight: "228 75% 48%", textDark: "226 100% 72%" },
  { id: "violet", label: "Violet", accent: "262 83% 58%", foreground: "0 0% 100%", textLight: "262 70% 48%", textDark: "258 100% 76%" },
  { id: "jade", label: "Jade", accent: "160 70% 42%", foreground: "60 4% 7%", textLight: "162 80% 26%", textDark: "158 62% 55%" },
  { id: "amber", label: "Amber", accent: "36 100% 54%", foreground: "60 4% 7%", textLight: "30 90% 34%", textDark: "38 100% 60%" },
];

const isAccent = (v: unknown): v is AccentTheme => accentThemes.some((t) => t.id === v);

const safeGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked — the choice lasts for this page view only */
  }
};

const applyAccent = (id: AccentTheme) => {
  const t = accentThemes.find((a) => a.id === id) ?? accentThemes[0];
  const root = document.documentElement.style;
  root.setProperty("--accent", t.accent);
  root.setProperty("--accent-foreground", t.foreground);
  root.setProperty("--accent-text-light", t.textLight);
  root.setProperty("--accent-text-dark", t.textDark);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // The boot script in index.html has already resolved the ground before
  // first paint; read it back rather than deciding a second time.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const [accentTheme, setAccentState] = useState<AccentTheme>(() => {
    const saved = typeof window === "undefined" ? null : safeGet("accentTheme");
    return isAccent(saved) ? saved : "acid";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    applyAccent(accentTheme);
  }, [accentTheme]);

  // Until the visitor picks a ground themselves, follow the OS as it changes.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq?.addEventListener) return;
    const onChange = (e: MediaQueryListEvent) => {
      if (safeGet("theme")) return;
      setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      safeSet("theme", next);
      return next;
    });
  }, []);

  const setAccentTheme = useCallback((id: AccentTheme) => {
    setAccentState(id);
    safeSet("accentTheme", id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, accentTheme, toggleTheme, setAccentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
