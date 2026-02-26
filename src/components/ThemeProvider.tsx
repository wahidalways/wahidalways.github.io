import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ColorTheme = "blue" | "emerald" | "violet" | "rose" | "amber" | "ocean" | "crimson" | "slate" | "forest" | "sunset";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (ct: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colorTheme: "blue",
  toggleTheme: () => {},
  setColorTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const colorThemes: { id: ColorTheme; label: string; primary: string; accent: string }[] = [
  { id: "blue", label: "Ocean Blue", primary: "220 70% 50%", accent: "175 80% 40%" },
  { id: "emerald", label: "Emerald", primary: "160 84% 39%", accent: "142 71% 45%" },
  { id: "violet", label: "Violet", primary: "262 83% 58%", accent: "280 65% 60%" },
  { id: "rose", label: "Rose", primary: "346 77% 50%", accent: "340 82% 52%" },
  { id: "amber", label: "Amber", primary: "38 92% 50%", accent: "25 95% 53%" },
  { id: "ocean", label: "Deep Ocean", primary: "199 89% 48%", accent: "187 92% 41%" },
  { id: "crimson", label: "Crimson", primary: "0 72% 51%", accent: "15 80% 55%" },
  { id: "slate", label: "Slate", primary: "215 20% 45%", accent: "210 30% 55%" },
  { id: "forest", label: "Forest", primary: "150 60% 30%", accent: "120 50% 40%" },
  { id: "sunset", label: "Sunset", primary: "20 90% 55%", accent: "350 80% 55%" },
];

const applyColorTheme = (ct: ColorTheme) => {
  const found = colorThemes.find((t) => t.id === ct);
  if (!found) return;
  const root = document.documentElement;
  root.style.setProperty("--primary", found.primary);
  root.style.setProperty("--accent", found.accent);
  root.style.setProperty("--ring", found.primary);
  root.style.setProperty("--gradient-primary", `linear-gradient(135deg, hsl(${found.primary}), hsl(${found.accent}))`);
  root.style.setProperty("--gradient-accent", `linear-gradient(135deg, hsl(${found.accent}), hsl(${found.primary}))`);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "dark";
    }
    return "dark";
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("colorTheme") as ColorTheme) || "crimson";
    }
    return "crimson";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    applyColorTheme(colorTheme);
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const setColorTheme = (ct: ColorTheme) => setColorThemeState(ct);

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, toggleTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
