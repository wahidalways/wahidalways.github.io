import { Fragment, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, MapPin, Sparkles, User } from "lucide-react";
import HeroLattice from "./hero/HeroLattice";

const AVATAR_SIZES =
  "(min-width: 1024px) 240px, (min-width: 768px) 208px, (min-width: 640px) 176px, 144px";

// React 18 does not recognise the camelCase `fetchPriority` prop: it warns, and
// the hint never reaches the DOM. The lowercase DOM attribute passes straight
// through, so spread it rather than silently losing priority on the LCP image.
const FETCH_PRIORITY_HIGH = { fetchpriority: "high" } as Record<string, string>;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/* Kinetic sub-line                                                            */
/* -------------------------------------------------------------------------- */

const PHRASES = [
  "ambiguity into clear requirements",
  "processes into measurable flows",
  "stakeholder noise into signal",
  "requirements into shipped software",
];

const PHRASE_MS = 3000;

/*
 * The old hero typed its entire opening paragraph one character at a time. That
 * cost a hundred-odd renders, delayed the sentence a reader came for by three
 * seconds, and made the LCP text arrive late. The paragraph is static now, and
 * the motion moved to the one clause where it earns its place: the promise.
 */
const RotatingPhrase = () => {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIndex((v) => (v + 1) % PHRASES.length), PHRASE_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  /*
   * Screen readers get one settled sentence. The swapping copy is hidden from
   * them entirely — announced, a phrase that replaces itself every three
   * seconds interrupts whatever the reader is currently on.
   */
  return (
    <span className="relative inline-block align-bottom">
      <span className="sr-only">{PHRASES[0]}</span>
      <span aria-hidden="true" className="relative inline-block">
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={index}
            initial={{ opacity: 0, y: "0.45em", filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "-0.45em", filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="inline-block gradient-text font-semibold"
          >
            {PHRASES[index]}
          </m.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Line reveal                                                                 */
/* -------------------------------------------------------------------------- */

/*
 * A mask reveal, not a fade-up: the line slides out from behind a hard edge, so
 * nothing is ever rendered mid-opacity. Sub-pixel opacity on large display type
 * is exactly what makes a hero headline look soft on the first frame.
 *
 * `pb-[0.14em]` on the clip window keeps descenders (the j in Nayem's font
 * stack, the y in "Wahiduzzaman") from being sheared off by the overflow.
 */
const RevealLine = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <span className="block overflow-hidden pb-[0.14em]">
    <m.span
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      className="block"
    >
      {children}
    </m.span>
  </span>
);

/* -------------------------------------------------------------------------- */
/* Magnetic call to action                                                     */
/* -------------------------------------------------------------------------- */

interface MagneticProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

/** Pull toward the cursor, capped hard — past a few pixels it stops reading as
 *  responsive and starts reading as broken hit-testing. */
const MagneticButton = ({ children, onClick, className = "" }: MagneticProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.35 });

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-8, Math.min(8, dx * 0.28)));
    y.set(Math.max(-6, Math.min(6, dy * 0.28)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </m.button>
  );
};

/* -------------------------------------------------------------------------- */
/* Portrait                                                                    */
/* -------------------------------------------------------------------------- */

const Portrait = () => {
  const [imgError, setImgError] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Tilt is a pointer affordance, so it is driven by motion values rather than
  // state: a re-render per mousemove on a section this heavy is visible.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
      className="order-1 md:order-2 shrink-0"
      style={{ perspective: 1000 }}
    >
      <div
        ref={wrapRef}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        className="relative"
      >
        {/* Aura behind the frame, so the portrait sits in light rather than on a plate. */}
        <div
          aria-hidden="true"
          className="absolute -inset-8 sm:-inset-12 blur-2xl anim-loop anim-pulse-fade"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, hsl(var(--primary) / 0.42), hsl(var(--accent) / 0.16) 45%, transparent 70%)",
            "--dur": "9s",
          } as React.CSSProperties}
        />

        <m.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Conic sweep, masked to a hairline — a lit edge that travels the frame. */}
          <div aria-hidden="true" className="hero-ring absolute -inset-px rounded-[2rem]" />

          {/*
           * Registration brackets, the mark a drawing gets on a spec sheet.
           * They cost four 14px corners and are the cheapest way to say the
           * page belongs to someone who documents things for a living.
           */}
          <span aria-hidden="true" className="portrait-bracket portrait-bracket-tl" />
          <span aria-hidden="true" className="portrait-bracket portrait-bracket-tr" />
          <span aria-hidden="true" className="portrait-bracket portrait-bracket-bl" />
          <span aria-hidden="true" className="portrait-bracket portrait-bracket-br" />

          {/* The glass border is white at 30% — invisible on the light theme's
              near-white background, which left the photo floating in a halo.
              A token border underneath gives the frame an edge in both themes. */}
          <div className="relative rounded-[2rem] p-2.5 sm:p-3 glass-panel ring-1 ring-inset ring-border/60">
            <div className="relative overflow-hidden rounded-[1.4rem] w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60">
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
                  <User aria-hidden="true" className="w-14 h-14 text-primary/40" />
                </div>
              )}

              {/* Reads the frame as glass rather than as a cut-out photo. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[1.4rem] ring-1 ring-inset ring-white/10"
              />

              {/* Sits the face on a base instead of letting it stop at a hard crop. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-16 rounded-b-[1.4rem] bg-gradient-to-t from-black/30 to-transparent"
              />
            </div>

            {/*
             * A caption bar turns a floating avatar into a card with a subject.
             * It carries the role, not the employer: this is his page, and the
             * Experience section states where he works with dates and scope.
             * It is also the only place the title appears below lg, where the
             * status pill has no room for it.
             */}
            <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-2 pb-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent anim-loop anim-pulse-dot"
                style={{ "--dur": "2.4s" } as React.CSSProperties}
              />
              {/*
               * The full title is wider than a 144px frame and stretched the
               * card past the photo it frames. Below md the caption drops the
               * qualifier; only one of the two is ever displayed, so a screen
               * reader still reads the caption once.
               */}
              <span className="font-heading text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.14em] text-muted-foreground whitespace-nowrap md:hidden">
                Business Analyst
              </span>
              <span className="font-heading text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.14em] text-muted-foreground whitespace-nowrap hidden md:inline">
                Technical Business Analyst
              </span>
            </div>
          </div>

          {/*
           * Chips are pushed toward the viewer on the Z axis, so the tilt moves
           * them across the portrait instead of with it. That parallax is the
           * whole reason the tilt is worth having.
           *
           * The depth goes through framer's `z` motion value, not a CSS
           * `transform` — framer composes the element's whole transform string
           * itself, so a hand-written one on the same element is overwritten on
           * the first animated frame.
           */}
          <m.div
            aria-hidden="true"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: EASE_OUT }}
            style={{ z: 55 }}
            className="absolute -left-5 top-7 lg:-left-11 hidden sm:flex items-center gap-2 rounded-xl glass-panel px-3 py-2 shadow-lg"
          >
            <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-primary" />
            <span className="font-heading text-[11px] font-semibold tracking-wide">BRD · FRD · SRS</span>
          </m.div>

        </m.div>
      </div>
    </m.div>
  );
};

/* -------------------------------------------------------------------------- */
/* Credibility strip                                                           */
/* -------------------------------------------------------------------------- */

// Same figures the Stats section counts up to, read off the CV — keep the two
// in step, a visitor sees both within one scroll.
const FACTS = [
  { value: "2.5+", label: "Years" },
  { value: "4", label: "Analyst roles" },
  { value: "6", label: "Domains" },
  { value: "4", label: "Awards & certs" },
];

const FactStrip = () => (
  <m.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.75, duration: 0.7, ease: EASE_OUT }}
    className="mt-6 sm:mt-9 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-3 max-w-[17rem] mx-auto sm:max-w-none sm:mx-0 lg:flex lg:flex-wrap lg:items-center lg:justify-start lg:gap-x-8"
  >
    {FACTS.map((fact, i) => (
      // The rule is a flex item of its own rather than a child of the fact, so
      // one gap value sets the spacing on both of its sides.
      <Fragment key={fact.label}>
        {i > 0 && <span aria-hidden="true" className="hidden lg:block w-px h-9 bg-border" />}
        <div className="text-center sm:text-center md:text-left">
          <p className="font-heading text-lg sm:text-2xl font-bold text-foreground leading-none">
            {fact.value}
          </p>
          <p className="mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-muted-foreground">
            {fact.label}
          </p>
        </div>
      </Fragment>
    ))}
  </m.div>
);

/* -------------------------------------------------------------------------- */
/* Capability rail                                                             */
/* -------------------------------------------------------------------------- */

// Domains and deliverables, not tools. A recruiter scanning the fold learns
// what the work covers without scrolling as far as Skills.
const CAPABILITIES = [
  "HRIS",
  "Payroll",
  "Recruitment & ATS",
  "Airline Systems",
  "BRD · FRD · SRS",
  "Gap & Impact Analysis",
  "Process Design",
  "Agile & Scrum",
  "Stakeholder Workshops",
  "UAT & Traceability",
];

/*
 * The band that closes the hero. It replaces the bobbing arrow that used to sit
 * here: an arrow says "there is more below", which the scrollbar already says,
 * while this says what the work actually covers — and it anchors the bottom of
 * a composition that was empty from the CTAs down.
 *
 * The list is rendered twice and the track translated by exactly half its own
 * width, so the loop has no seam. Only the first copy is exposed to assistive
 * tech; the second is the same ten strings again.
 */
const CapabilityRail = () => (
  <m.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.1, duration: 0.9 }}
    className="relative z-10 w-full border-t border-border/60"
  >
    <div className="marquee py-3.5 sm:py-4">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="marquee-group">
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex items-center gap-3 sm:gap-4">
                <span aria-hidden="true" className="w-1 h-1 rotate-45 bg-accent/60" />
                <span className="font-heading text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  </m.div>
);

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

const Hero = () => {
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
  const bgY = useTransform(scrollYProgress, (v) => snap(v * 220));
  const contentY = useTransform(scrollYProgress, (v) => snap(v * 88));
  // Hold at exactly 1 while the hero is still the thing being read — any value
  // below 1 costs sub-pixel text antialiasing too.
  const opacity = useTransform(scrollYProgress, [0, 0.45, 0.9], [1, 1, 0]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-background"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Abstract                                                          */}
      {/* ---------------------------------------------------------------- */}
      <m.div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        {/* Throws the header into some light instead of leaving it on flat ground. */}
        <div
          className="absolute inset-x-0 top-0 h-[52vh]"
          style={{
            background:
              "radial-gradient(70% 100% at 50% 0%, hsl(var(--primary) / 0.1), transparent 72%)",
          }}
        />

        {/* Two soft light sources, drifting on different periods. */}
        <div
          className="absolute -top-24 -left-20 w-[95vw] h-[95vw] sm:w-[52vw] sm:h-[52vw] max-w-[620px] max-h-[620px] rounded-full blur-[90px] sm:blur-[120px] opacity-[0.13] sm:opacity-[0.18] anim-loop anim-blob-a"
          style={{ background: "hsl(var(--primary))", "--dur": "22s" } as React.CSSProperties}
        />
        <div
          className="absolute -bottom-28 -right-20 w-[105vw] h-[105vw] sm:w-[56vw] sm:h-[56vw] max-w-[720px] max-h-[720px] rounded-full blur-[100px] sm:blur-[130px] opacity-[0.11] sm:opacity-[0.16] anim-loop anim-blob-b"
          style={{ background: "hsl(var(--accent))", "--dur": "28s" } as React.CSSProperties}
        />

        {/* Blueprint grid, faded out toward the edges so it never meets a border. */}
        <div className="hero-grid absolute inset-0" />

        {/* The lattice itself. */}
        <HeroLattice />

        {/* Film grain: kills the banding a 120px blur leaves across a wide gradient. */}
        <div className="hero-grain absolute inset-0" />

        {/* Hands the section off to the one below it instead of ending on a hard line. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </m.div>

      {/* ---------------------------------------------------------------- */}
      {/* Content                                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex items-center w-full">
        <m.div
          className="container mx-auto px-5 sm:px-6 md:px-8 lg:px-20 xl:px-8 pt-20 pb-10 sm:pt-28 sm:pb-16 md:pt-24"
          style={{ y: contentY, opacity }}
        >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-16 lg:gap-20">
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="mb-4 sm:mb-6 max-w-full inline-flex items-center gap-2 sm:gap-2.5 rounded-full glass-panel py-1.5 pl-2 pr-3.5 sm:pr-4 text-[11px] sm:text-[13px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 anim-loop anim-ping" style={{ "--dur": "2.4s" } as React.CSSProperties} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-medium text-muted-foreground">
                Available for new opportunities
              </span>
              <span aria-hidden="true" className="hidden lg:block w-px h-3.5 bg-border" />
              <span className="hidden lg:inline font-medium text-foreground/80">Technical Business Analyst</span>
              <span aria-hidden="true" className="sm:hidden w-px h-3.5 bg-border" />
              <span className="sm:hidden font-medium text-foreground/80">Dhaka, BD</span>
            </m.div>

            <h1 className="font-heading text-[clamp(1.85rem,8.6vw,2.75rem)] leading-[0.98] sm:leading-[0.95] sm:text-6xl md:text-[2.6rem] lg:text-6xl xl:text-7xl font-bold tracking-[-0.02em] sm:tracking-[-0.03em] mb-3 sm:mb-6">
              <RevealLine delay={0.1}>
                <span className="text-foreground">Md. Wahiduzzaman</span>
              </RevealLine>
              <RevealLine delay={0.2}>
                <span className="headline-sheen">Nayem</span>
              </RevealLine>
            </h1>

            <m.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease: EASE_OUT }}
              className="font-heading text-[1.05rem] leading-snug sm:text-xl lg:text-2xl text-muted-foreground min-h-[2.9em] lg:min-h-[2.7em] flex flex-wrap items-center justify-center md:justify-start gap-x-[0.3em]"
            >
              I turn <RotatingPhrase />
            </m.p>

            <m.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: EASE_OUT }}
              className="mt-3 sm:mt-4 max-w-xl mx-auto md:mx-0 text-[13px] sm:text-base leading-relaxed text-pretty text-muted-foreground/90"
            >
              Requirements engineering and process design across HRIS, payroll,
              recruitment and airline systems — written so engineering can build it
              and the business can sign it off.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: EASE_OUT }}
              className="mt-5 sm:mt-8 flex flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-3"
            >
              <MagneticButton
                onClick={() => scrollTo("#contact")}
                className="hero-cta group relative overflow-hidden rounded-xl px-5 sm:px-7 py-3 sm:py-3.5 font-heading text-[13px] sm:text-sm font-semibold text-primary-foreground cursor-pointer"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  Get in touch
                  <ArrowRight aria-hidden="true" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() => scrollTo("#projects")}
                className="rounded-xl px-5 sm:px-7 py-3 sm:py-3.5 font-heading text-[13px] sm:text-sm font-semibold glass-panel hover-lift cursor-pointer"
              >
                View projects
              </MagneticButton>
            </m.div>

            <FactStrip />

            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-6 sm:mt-7 hidden sm:flex items-center justify-center md:justify-start gap-1.5 text-[13px] sm:text-sm text-muted-foreground"
            >
              <MapPin aria-hidden="true" className="w-4 h-4 text-accent" />
              Dhaka, Bangladesh
            </m.p>
          </div>

          <Portrait />
        </div>
        </m.div>
      </div>

      <CapabilityRail />

    </section>
  );
};

export default Hero;
