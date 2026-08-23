import { m, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin, Briefcase, User, FileSearch, GitBranch, BarChart3, Database, ClipboardList, Workflow } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";

const ParticleField = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 14 + 12,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.1 + 0.03,
    }));
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full anim-loop anim-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? "hsl(var(--accent))" : "hsl(var(--primary))",
            "--dur": `${p.duration}s`,
            "--delay": `${p.delay}s`,
            "--op": p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const FloatingBAIcons = () => {
  const icons = [
    { Icon: FileSearch, x: "8%", y: "20%", delay: 0 },
    { Icon: GitBranch, x: "90%", y: "25%", delay: 1.5 },
    { Icon: BarChart3, x: "12%", y: "75%", delay: 3 },
    { Icon: Database, x: "85%", y: "70%", delay: 2 },
    { Icon: ClipboardList, x: "50%", y: "10%", delay: 4 },
    { Icon: Workflow, x: "75%", y: "88%", delay: 1 },
  ];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
      {icons.map(({ Icon, x, y, delay }, i) => (
        <div
          key={i}
          className="absolute anim-loop anim-hero-icon"
          style={{
            left: x,
            top: y,
            "--dur": `${12 + i * 2}s`,
            "--delay": `${delay}s`,
          } as React.CSSProperties}
        >
          <Icon className="w-5 h-5 md:w-8 md:h-8 text-primary" />
        </div>
      ))}
    </div>
  );
};

const GridOverlay = () => (
  <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.025]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  </div>
);

const AVATAR_SIZES =
  "(min-width: 1024px) 240px, (min-width: 768px) 208px, (min-width: 640px) 176px, 144px";

// React 18 does not recognise the camelCase `fetchPriority` prop: it warns, and
// the hint never reaches the DOM. The lowercase DOM attribute passes straight
// through, so spread it rather than silently losing priority on the LCP image.
const FETCH_PRIORITY_HIGH = { fetchpriority: "high" } as Record<string, string>;

const TYPING_CPS = 45;

const TypingEffect = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [count, setCount] = useState(0);

  // Driven off rAF rather than setInterval: a fixed 22ms timer is not aligned to
  // the display and drifts, which reads as uneven stepping on a high-refresh
  // screen. Deriving the character count from elapsed time keeps the speed
  // identical at 60Hz, 120Hz or any other refresh rate.
  useEffect(() => {
    setCount(0);
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000 - delay;
      const next = Math.max(0, Math.min(text.length, Math.floor(elapsed * TYPING_CPS)));
      setCount(next);
      if (next < text.length) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay, text]);

  /*
   * Assistive tech gets the finished sentence once, from a visually hidden
   * node. The animated copy is hidden from it entirely — left exposed, the
   * per-character state updates make a screen reader either re-announce the
   * line repeatedly or read out a half-typed fragment.
   */
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {count < text.length && (
          <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-text-bottom anim-loop anim-caret" />
        )}
      </span>
    </>
  );
};

const StatusBadges = () => {
  const badges = [
    { label: "Available for hire", color: "bg-accent" },
    { label: "2.5+ Years Experience", color: "bg-primary" },
  ];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4"
    >
      {badges.map((badge, i) => (
        <m.span
          key={badge.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + i * 0.15 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs font-medium text-muted-foreground"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.color} animate-pulse`} />
          {badge.label}
        </m.span>
      ))}
    </m.div>
  );
};

const Hero = () => {
  const [imgError, setImgError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax offsets are snapped to the DEVICE pixel. Snapping keeps the hero
  // text off a sub-pixel offset, which is what made it render soft; snapping to
  // the device pixel rather than the CSS pixel means a 2x display gets twice the
  // steps, so the motion stays smooth at 120Hz instead of visibly stepping.
  const snap = (px: number) => {
    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    return Math.round(px * dpr) / dpr;
  };
  const bgY = useTransform(scrollYProgress, (v) => snap(v * 240));
  const contentY = useTransform(scrollYProgress, (v) => snap(v * 96));
  // Hold at exactly 1 while the hero is still the thing being read — any value
  // below 1 costs sub-pixel text antialiasing too.
  const opacity = useTransform(scrollYProgress, [0, 0.45, 0.9], [1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--gradient-hero-light)" }}
    >
      {/* Parallax background */}
      <m.div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div
          className="absolute top-20 -left-20 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] anim-loop anim-blob-a"
          style={{ "--dur": "22s" } as React.CSSProperties}
        />
        <div
          className="absolute bottom-10 -right-20 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[100px] anim-loop anim-blob-b"
          style={{ "--dur": "28s" } as React.CSSProperties}
        />
        <ParticleField />
        <GridOverlay />
        <FloatingBAIcons />
      </m.div>

      {/* Content */}
      <m.div
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-8 relative z-10 pt-24 pb-16 md:pt-0 md:pb-0"
        style={{ y: contentY, opacity }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Text */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-muted-foreground">
                <Briefcase aria-hidden="true" className="w-4 h-4 text-accent" />
                Technical Business Analyst
              </span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            >
              <span className="text-foreground">Md. Wahiduzzaman</span>
              <br />
              <span className="gradient-text">Nayem</span>
            </m.h1>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground max-w-xl mb-6 leading-relaxed mx-auto md:mx-0"
            >
              <TypingEffect
                text="Technical Business Analyst turning business needs into clear, actionable solutions — requirements engineering, documentation quality, and process optimization."
                delay={0.6}
              />
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center md:items-start gap-3 mb-4"
            >
              <m.button
                whileHover={{ y: -2, boxShadow: "0 10px 30px hsl(var(--primary) / 0.3)" }}
                whileTap={{ y: 0 }}
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3 rounded-xl font-heading font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
              >
                Get In Touch
              </m.button>
              <m.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3 rounded-xl font-heading font-semibold text-sm glass-panel hover-lift cursor-pointer"
              >
                View Projects
              </m.button>
            </m.div>

            <StatusBadges />

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground mt-4"
            >
              <span className="flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="w-4 h-4 text-accent" /> Dhaka, Bangladesh
              </span>
            </m.div>
          </div>

          {/* Profile Image */}
          <m.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 md:order-2 shrink-0"
          >
            <div className="relative">
              <div
                className="absolute -inset-5 rounded-full border border-dashed border-primary/15 anim-loop anim-spin"
                style={{ "--dur": "25s" } as React.CSSProperties}
              />
              <div
                className="absolute -inset-9 rounded-full border border-dotted border-accent/10 anim-loop anim-spin-reverse"
                style={{ "--dur": "35s" } as React.CSSProperties}
              />
              <div
                className="absolute -inset-5 rounded-full anim-loop anim-spin"
                style={{ "--dur": "10s" } as React.CSSProperties}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent" />
              </div>

              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden ring-4 ring-primary/10 ring-offset-4 ring-offset-background">
                {!imgError ? (
                  /*
                   * The avatar is never laid out wider than 240 CSS px, so the
                   * candidates stop at 480 (2x). `sizes` mirrors the w-36 /
                   * sm:w-44 / md:w-52 / lg:w-60 ladder on the wrapper, and the
                   * same list is preloaded from index.html — keep the three in
                   * step or the browser fetches a second copy.
                   */
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="/profile-240.webp 240w, /profile-480.webp 480w"
                      sizes={AVATAR_SIZES}
                    />
                    <img
                      src="/profile-480.jpg"
                      srcSet="/profile-240.jpg 240w, /profile-480.jpg 480w"
                      sizes={AVATAR_SIZES}
                      width={480}
                      height={480}
                      alt="Md. Wahiduzzaman Nayem"
                      className="w-full h-full object-cover"
                      decoding="async"
                      {...FETCH_PRIORITY_HIGH}
                      onError={() => setImgError(true)}
                    />
                  </picture>
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <User aria-hidden="true" className="w-14 h-14 md:w-18 md:h-18 text-primary/40" />
                  </div>
                )}
              </div>
            </div>
          </m.div>
        </div>
      </m.div>

      {/* Scroll indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="anim-loop anim-bob" style={{ "--dur": "2s" } as React.CSSProperties}>
          <ArrowDown aria-hidden="true" className="w-5 h-5 text-muted-foreground" />
        </div>
      </m.div>
    </section>
  );
};

export default Hero;
