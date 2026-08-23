import { useState, useEffect, useRef, useCallback, useId } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ResumeDropdown from "./ResumeDropdown";
import ThemeSwitcher from "./ThemeSwitcher";
import { useDismissable } from "@/hooks/useDismissable";

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

/*
 * `scroll-behavior: smooth` is switched off for reduced motion in CSS, but
 * scrollIntoView({ behavior: "smooth" }) is a JS argument and ignores the
 * stylesheet entirely — so the preference has to be re-checked here.
 */
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

const LogoMark = () => (
  <div className="flex items-center gap-1.5">
    <m.div
      whileHover={{ rotate: [0, -10, 10, 0] }}
      transition={{ duration: 0.5 }}
      className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center"
      style={{ background: "var(--gradient-primary)" }}
    >
      <span
        className="font-heading text-sm font-bold text-primary-foreground leading-none anim-loop anim-pulse-fade"
        style={{ "--dur": "3s" } as React.CSSProperties}
      >
        M
      </span>
    </m.div>
    <div className="flex items-baseline">
      {["M", "W", "N"].map((letter, i) => (
        <m.span
          key={i}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-lg font-bold text-foreground tracking-tight"
        >
          {letter}
        </m.span>
      ))}
      <span
        className="font-heading text-lg font-bold text-accent anim-loop anim-pulse-dot"
        style={{ "--dur": "2s" } as React.CSSProperties}
      >
        .
      </span>
    </div>
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const activeSectionRef = useRef("");
  const menuId = useId();

  // The whole header is the dismiss boundary, so a press anywhere on the page
  // closes the mobile menu, and Escape hands focus back to the hamburger.
  const { containerRef, triggerRef } = useDismissable<HTMLElement>(mobileOpen, () =>
    setMobileOpen(false),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));
    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        if (visibleSections.size > 0) {
          let closest = "";
          let closestDist = Infinity;
          visibleSections.forEach((_, id) => {
            const el = document.getElementById(id);
            if (el) {
              const dist = Math.abs(el.getBoundingClientRect().top);
              if (dist < closestDist) { closestDist = dist; closest = id; }
            }
          });
          if (closest && closest !== activeSectionRef.current) {
            activeSectionRef.current = closest;
            setActiveSection(closest);
          }
        }
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: [0, 0.25, 0.5] }
    );

    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  const handleNav = useCallback((event: React.MouseEvent, href: string) => {
    const el = document.querySelector(href);
    if (!el) return; // let the browser follow the real href as a fallback

    event.preventDefault();
    setMobileOpen(false);
    el.scrollIntoView({ behavior: scrollBehavior() });
    const id = href.replace("#", "");
    activeSectionRef.current = id;
    setActiveSection(id);
  }, []);

  const handleHome = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }, []);

  return (
    <m.header
      ref={containerRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-20 xl:px-8 pt-3"
    >
      <nav
        aria-label="Main"
        className={`mx-auto max-w-6xl flex items-center justify-between px-4 lg:px-5 xl:px-6 py-3 rounded-full transition-[background-color,box-shadow,border-color,transform] duration-500 ${
          scrolled
            ? "glass-panel shadow-lg"
            : "bg-background/60 backdrop-blur-md border border-border/50"
        }`}
      >
        <a href="#" aria-label="Back to top" className="flex items-center group" onClick={handleHome}>
          <m.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <LogoMark />
          </m.div>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              /*
               * Real anchors, not buttons. As buttons these could not be
               * middle-clicked, opened in a new tab, copied as a link, or
               * reached from a screen reader's list of links.
               */
              <m.a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                aria-current={isActive ? "true" : undefined}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                className={`text-[10px] xl:text-xs font-medium transition-all cursor-pointer relative px-2 xl:px-3 py-1 xl:py-1.5 rounded-full ${
                  isActive
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {item.label}
              </m.a>
            );
          })}
          <div className="w-px h-5 bg-border mx-1 xl:mx-2" />
          <ThemeSwitcher />
          <m.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-1.5 xl:p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            <AnimatePresence mode="wait">
              <m.div
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "light"
                  ? <Moon aria-hidden="true" className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                  : <Sun aria-hidden="true" className="w-3.5 h-3.5 xl:w-4 xl:h-4" />}
              </m.div>
            </AnimatePresence>
          </m.button>
          <ResumeDropdown />
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeSwitcher />
          <m.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light"
              ? <Moon aria-hidden="true" className="w-4 h-4" />
              : <Sun aria-hidden="true" className="w-4 h-4" />}
          </m.button>
          <m.button
            ref={triggerRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? menuId : undefined}
          >
            <AnimatePresence mode="wait">
              <m.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
              </m.div>
            </AnimatePresence>
          </m.button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            id={menuId}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden glass-panel mx-auto max-w-6xl mt-2 rounded-2xl p-5 flex flex-col gap-2"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {navItems.map((item, i) => (
                <m.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={(e) => handleNav(e, item.href)}
                  aria-current={activeSection === item.href.replace("#", "") ? "true" : undefined}
                  className={`text-left text-sm font-medium transition-all cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl ${
                    activeSection === item.href.replace("#", "")
                      ? "text-primary-foreground bg-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="border-t border-border pt-3 mt-1">
              <ResumeDropdown mobile />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
};

export default Navbar;
