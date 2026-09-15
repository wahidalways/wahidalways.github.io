import { useState, useEffect, useRef, useCallback, useId } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ResumeDropdown from "./ResumeDropdown";
import ThemeSwitcher from "./ThemeSwitcher";
import Wordmark from "./Wordmark";
import { useDismissable } from "@/hooks/useDismissable";
import { getLenis, scrollToTarget } from "@/lib/smooth-scroll";
import { subscribeScroll } from "@/lib/scroll-store";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const activeSectionRef = useRef("");
  const menuId = useId();

  // Written straight to the element once per frame: no React render, no spring.
  const progressRef = useRef<HTMLSpanElement>(null);

  const { containerRef, triggerRef } = useDismissable<HTMLElement>(mobileOpen, () => setMobileOpen(false));

  // Transparent over the top of the hero, solid once content passes beneath it.
  // The header never hides: navigation stays one click away at every point.
  useEffect(() => {
    let shown = -1;
    return subscribeScroll((y, progress) => {
      setScrolled(y > 24);
      // Skip the write when the bar would not visibly move.
      if (!progressRef.current || Math.abs(progress - shown) < 0.0005) return;
      shown = progress;
      progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    });
  }, []);

  // The menu is a full-screen sheet; the page behind it must not scroll.
  useEffect(() => {
    const lenis = getLenis();
    if (mobileOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [mobileOpen]);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1));
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        let closest = "";
        let closestDist = Infinity;
        visible.forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          const dist = Math.abs(el.getBoundingClientRect().top);
          if (dist < closestDist) {
            closestDist = dist;
            closest = id;
          }
        });
        if (closest && closest !== activeSectionRef.current) {
          activeSectionRef.current = closest;
          setActiveSection(closest);
        }
      },
      { rootMargin: "-20% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNav = useCallback((event: React.MouseEvent, href: string) => {
    const el = document.querySelector(href);
    if (!el) return; // let the browser follow the real href as a fallback
    event.preventDefault();
    getLenis()?.start();
    setMobileOpen(false);
    scrollToTarget(href);
    const id = href.slice(1);
    activeSectionRef.current = id;
    setActiveSection(id);
  }, []);

  const handleHome = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    getLenis()?.start();
    setMobileOpen(false);
    scrollToTarget(0);
  }, []);

  const iconButton =
    // 44px on touch screens (the minimum comfortable tap size), 40px on desktop.
    "grid place-items-center w-11 h-11 md:w-10 md:h-10 rounded-full border border-foreground/15 hover:border-foreground transition-colors cursor-pointer";

  return (
    <header
      ref={containerRef}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        /*
         * A solid bar, not frosted glass. backdrop-filter re-blurs everything
         * scrolling beneath the header on every frame — the most expensive
         * effect the page had, and the first thing a weak GPU drops frames on.
         */
        className={`relative transition-[background-color,border-color] duration-300 border-b ${
          scrolled || mobileOpen
            ? "bg-background border-border"
            : "bg-transparent border-transparent"
        }`}
      >
        <nav aria-label="Main" className="shell flex h-16 items-center justify-between gap-6">
          <a href="#" aria-label="Back to top" onClick={handleHome} className="-my-2.5 shrink-0 py-2.5">
            {/* Capitals stand taller than lowercase; sized so the monogram sits level with the nav. */}
            <Wordmark className="text-[1.5rem] md:text-[1.6rem]" />
          </a>

          {/* The full index from 1024px; below 1280px it drops the numbers to fit. */}
          <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navItems.map((item, i) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNav(e, item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative flex items-baseline gap-1.5 px-2 xl:px-3 py-2 text-[13px] transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`hidden xl:inline font-mono text-[10px] transition-colors ${
                        isActive ? "text-accent-ink" : "text-muted-foreground/60 group-hover:text-foreground/60"
                      }`}
                    >
                      {pad(i + 1)}
                    </span>
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute left-2 right-2 xl:left-3 xl:right-3 -bottom-px h-px bg-foreground origin-left transition-transform duration-500 ease-out-expo ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              type="button"
              onClick={toggleTheme}
              className={iconButton}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            >
              {theme === "light" ? (
                <Moon aria-hidden="true" className="w-4 h-4" strokeWidth={1.75} />
              ) : (
                <Sun aria-hidden="true" className="w-4 h-4" strokeWidth={1.75} />
              )}
            </button>
            <div className="hidden sm:block ml-1">
              <ResumeDropdown />
            </div>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={`${iconButton} lg:hidden`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls={mobileOpen ? menuId : undefined}
            >
              <span aria-hidden="true" className="relative block w-4 h-2.5">
                <span
                  className={`absolute left-0 right-0 h-px bg-foreground transition-all duration-300 ${
                    mobileOpen ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-px bg-foreground transition-all duration-300 ${
                    mobileOpen ? "top-1/2 -rotate-45" : "top-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute left-0 right-0 -bottom-px h-[2px] origin-left bg-accent will-change-transform"
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <m.div
            id={menuId}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-background overflow-y-auto"
            data-lenis-prevent
          >
            <div className="shell flex min-h-full flex-col justify-between gap-10 py-8">
              <nav aria-label="Mobile">
                <ul className="border-t border-border">
                  {navItems.map((item, i) => {
                    const isActive = activeSection === item.href.slice(1);
                    return (
                      <m.li
                        key={item.href}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="border-b border-border"
                      >
                        <a
                          href={item.href}
                          onClick={(e) => handleNav(e, item.href)}
                          aria-current={isActive ? "true" : undefined}
                          // The current section fills with the signal; the rest step back
                          // so the filled row is the first thing the eye finds.
                          className={`group -mx-3 my-1 flex items-center justify-between rounded-lg px-3 py-2.5 sm:py-3 transition-colors duration-300 ${
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span
                            className={`display text-[2.1rem] sm:text-5xl transition-transform duration-500 ease-out-expo ${
                              isActive ? "translate-x-1.5" : "group-hover:translate-x-1.5"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span aria-hidden="true" className="flex items-center gap-2 font-mono text-xs">
                            {pad(i + 1)}
                            {/* The wordmark's closing square, marking where the reader is. */}
                            <span
                              className={`block w-1.5 h-1.5 bg-current transition-opacity duration-300 ${
                                isActive ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </span>
                        </a>
                      </m.li>
                    );
                  })}
                </ul>
              </nav>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap items-end justify-between gap-6"
              >
                <ResumeDropdown mobile />
                <a
                  href="mailto:nayemwahid05@gmail.com"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  nayemwahid05@gmail.com
                  <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                </a>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
