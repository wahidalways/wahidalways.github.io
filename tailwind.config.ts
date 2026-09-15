import type { Config } from "tailwindcss";

const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      /*
       * Switzer (Indian Type Foundry) — a Swiss neo-grotesk, set tight for
       * display and open for text. Fragment Mono — a Helvetica-derived mono,
       * so labels and IDs share the grotesk's skeleton instead of fighting it.
       * Both are self-hosted from /public/fonts.
       */
      fontFamily: {
        sans: ["Switzer", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Switzer", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Fragment Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
        background: token("background"),
        foreground: token("foreground"),
        primary: { DEFAULT: token("primary"), foreground: token("primary-foreground") },
        secondary: { DEFAULT: token("secondary"), foreground: token("secondary-foreground") },
        destructive: { DEFAULT: token("destructive"), foreground: token("destructive-foreground") },
        muted: { DEFAULT: token("muted"), foreground: token("muted-foreground") },
        accent: {
          DEFAULT: token("accent"),
          foreground: token("accent-foreground"),
          /* Text-safe variant: meets 4.5:1 on the current ground. */
          ink: token("accent-ink"),
        },
        popover: { DEFAULT: token("popover"), foreground: token("popover-foreground") },
        card: { DEFAULT: token("card"), foreground: token("card-foreground") },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      letterSpacing: {
        display: "-0.04em",
        label: "0.06em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        shell: "1440px",
      },
    },
  },
  plugins: [],
} satisfies Config;
