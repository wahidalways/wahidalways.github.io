import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ResumeDropdown from "./ResumeDropdown";
import ThemeSwitcher from "./ThemeSwitcher";

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

const LogoMark = () => (
  <div className="flex items-center gap-1.5">
    <motion.div
      whileHover={{ rotate: [0, -10, 10, 0] }}
      transition={{ duration: 0.5 }}
      className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center"
      style={{ background: "var(--gradient-primary)" }}
    >
      <motion.span
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="font-heading text-sm font-bold text-primary-foreground leading-none"
      >
        M
      </motion.span>
    </motion.div>
    <div className="flex items-baseline">
      {["M", "W", "N"].map((letter, i) => (
        <motion.span
          key={i}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-lg font-bold text-foreground tracking-tight"
        >
          {letter}
        </motion.span>
      ))}
      <motion.span
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="font-heading text-lg font-bold text-accent"
      >
        .
      </motion.span>
    </div>
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const activeSectionRef = useRef("");

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

  const handleNav = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const id = href.replace("#", "");
      activeSectionRef.current = id;
      setActiveSection(id);
    }
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-3"
    >
      <nav
        className={`mx-auto max-w-6xl flex items-center justify-between px-5 md:px-6 transition-all duration-500 rounded-full ${
          scrolled
            ? "glass py-2.5 shadow-lg"
            : "py-3 bg-background/60 backdrop-blur-md border border-border/50"
        }`}
      >
        <a
          href="#"
          className="flex items-center group"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <LogoMark />
          </motion.div>
        </a>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <motion.button
                key={item.label}
                onClick={() => handleNav(item.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-xs font-medium transition-all cursor-pointer relative px-3 py-1.5 rounded-full ${
                  isActive
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {item.label}
              </motion.button>
            );
          })}
          <div className="w-px h-5 bg-border mx-2" />
          <ThemeSwitcher />
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          <ResumeDropdown />
        </div>

        {/* Mobile toggle */}
        <div className="flex xl:hidden items-center gap-2">
          <ThemeSwitcher />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 cursor-pointer"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden glass mx-auto max-w-6xl mt-2 rounded-2xl p-5 flex flex-col gap-2"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleNav(item.href)}
                className={`text-left text-sm font-medium transition-all cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl ${
                  activeSection === item.href.replace("#", "")
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
            <div className="border-t border-border pt-3 mt-1">
              <ResumeDropdown mobile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
