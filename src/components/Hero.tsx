import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, User } from "lucide-react";
import { gsap, EASE, MOTION_OK, ensureGsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useMagnetic } from "@/lib/useMagnetic";
import { isLowPowerDevice } from "@/lib/performance";
import { SplitText } from "./ui/typography";
import Marquee from "./Marquee";

// Keep in step with `imagesizes` on the preload in index.html, or the browser
// fetches the portrait twice.
const PORTRAIT_SIZES = "(min-width: 1280px) 320px, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 36vw";

// React 18 does not recognise camelCase `fetchPriority`; the lowercase DOM
// attribute passes straight through.
const FETCH_PRIORITY_HIGH = { fetchpriority: "high" } as Record<string, string>;

const PHRASES = [
  "ambiguity into clear requirements",
  "processes into measurable flows",
  "stakeholder noise into signal",
  "requirements into shipped software",
];

// Each field says something the rest of the hero does not. (The focus areas
// are already in the body copy and the ticker, so they are not repeated here.)
const META = [
  { term: "Role", value: "Technical Business Analyst" },
  { term: "Currently at", value: "US Bangla Airlines", note: "since Aug 2026" },
  { term: "Based in", value: "Dhaka, Bangladesh", note: "23.81° N, 90.41° E" },
  { term: "Status", value: "Open to conversations", status: true },
];

/*
 * Screen readers get one settled sentence; the swapping copy is hidden from
 * them, since a phrase replacing itself every three seconds would interrupt
 * whatever they are reading. The phrase sits on its own line so a longer one
 * can never overlap "I turn" or shift the layout while it animates.
 */
const RotatingPhrase = () => {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  const ref = useRef<HTMLSpanElement>(null);

  // Only cycles while the phrase is on screen and the tab is visible — no
  // re-renders and no animation work for a line nobody is looking at.
  useEffect(() => {
    if (reduced) return;
    let onScreen = true;
    const el = ref.current;
    const observer = el
      ? new IntersectionObserver((entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
        })
      : null;
    if (el && observer) observer.observe(el);

    const id = window.setInterval(() => {
      if (onScreen && !document.hidden) setIndex((v) => (v + 1) % PHRASES.length);
    }, 3200);
    return () => {
      window.clearInterval(id);
      observer?.disconnect();
    };
  }, [reduced]);

  return (
    <span ref={ref} className="relative block xl:inline-block">
      <span className="sr-only">{PHRASES[0]}</span>
      <span aria-hidden="true" className="relative block">
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={index}
            initial={{ opacity: 0, y: "0.35em" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-0.35em" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="block text-accent-ink"
          >
            {PHRASES[index]}
          </m.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

/* The photograph, and nothing on top of it. 4:5 keeps the folded arms in frame. */
const Portrait = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="crop-marks relative w-full">
      <div
        className="hero-portrait-clip relative aspect-[4/5] overflow-hidden rounded-[2px] bg-muted"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        {!imgError ? (
          // Oversized a little so the scroll parallax never reveals an edge.
          <div data-speed="16" className="absolute -inset-y-[4%] inset-x-0">
            <picture className="hero-portrait-drift block h-full w-full">
              <source
                type="image/webp"
                srcSet="/hero-480.webp 480w, /hero-800.webp 800w, /hero-1200.webp 1200w"
                sizes={PORTRAIT_SIZES}
              />
              <img
                src="/hero-800.jpg"
                srcSet="/hero-800.jpg 800w, /hero-1200.jpg 1200w"
                sizes={PORTRAIT_SIZES}
                width={1200}
                height={1500}
                alt="Md. Wahiduzzaman Nayem, arms folded, in front of a dark textured wall"
                className="hero-portrait-img h-full w-full object-cover object-[50%_28%]"
                decoding="async"
                {...FETCH_PRIORITY_HIGH}
                onError={() => setImgError(true)}
              />
            </picture>
          </div>
        ) : (
          <div className="grid h-full w-full place-items-center">
            <User aria-hidden="true" className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
          </div>
        )}
      </div>
    </div>
  );
};

/*
 * The facts row. It sits in a different place per layout — under the portrait
 * on narrow screens, at the foot of the hero on wide ones — so it is rendered in
 * both places and the caller passes the display classes that show only one.
 */
const MetaRow = ({ className }: { className: string }) => (
  <dl className={`hero-meta-row grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-6 gap-y-4 ${className}`}>
    {META.map((item) => (
      <div key={item.term} className="hero-meta group relative pt-3">
        {/* The card's rule, drawn in on load; a darker one sweeps over it on hover. */}
        <span aria-hidden="true" className="hero-meta-rule absolute inset-x-0 top-0 h-px origin-left bg-border" />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-foreground transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
        />
        <dt className="label transition-colors duration-300 group-hover:text-foreground">{item.term}</dt>
        <dd className="mt-1.5 flex items-center gap-2 text-[13px] leading-snug text-foreground">
          {item.status && <span aria-hidden="true" className="status-dot shrink-0" />}
          <span>
            {item.value}
            {item.note && <span className="hidden xl:inline font-mono text-[11px] text-muted-foreground"> · {item.note}</span>}
          </span>
        </dd>
      </div>
    ))}
  </dl>
);

/*
 * Composition, wide screens: the name and the argument stacked down the left;
 * the photograph set into the last three columns, top-aligned with the name so
 * the two read as one block. Narrow screens: name, then photograph and
 * statement side by side, then the body — the photo never fills the screen.
 */
const Hero = ({ ready }: { ready: boolean }) => {
  const rootRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const readyRef = useRef(ready);
  const primaryRef = useMagnetic<HTMLAnchorElement>(0.3);
  const secondaryRef = useMagnetic<HTMLAnchorElement>(0.3);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });

      tl.from(q(".hero-guides"), { autoAlpha: 0, duration: 1.6 }, 0)
        // The facts row sits at the foot of the hero, so it arrives after the name:
        // each card's hairline draws in, then its text settles beneath it.
        .from(q(".hero-meta-rule"), { scaleX: 0, duration: 1.2, stagger: 0.09 }, 0.7)
        .from(q(".hero-meta dt, .hero-meta dd"), { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.045 }, 0.85)
        .from(q(".hero-name .split-word"), { yPercent: 118, duration: 1.35, stagger: 0.08 }, 0.1)
        // The closing square lands last, with a small overshoot.
        .from(q(".hero-mark"), { scale: 0, rotate: -90, duration: 0.8, ease: "back.out(2.4)" }, 0.95)
        .from(q(".hero-portrait-clip"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4 }, 0.3)
        .from(q(".hero-portrait-img"), { scale: 1.2, duration: 1.9 }, 0.3)
        .from(q(".hero-fade"), { autoAlpha: 0, y: 22, duration: 1.1, stagger: 0.08 }, 0.55)
        .from(q(".hero-marquee"), { autoAlpha: 0, duration: 1.2 }, 0.9);

      timelineRef.current = tl;
      if (readyRef.current) tl.play();

      // The continuous effects below are decorative; weak hardware skips them.
      const decorative = !isLowPowerDevice();
      const cleanups: (() => void)[] = [];

      // As the hero leaves, its content lifts and dims a touch. Scrubbed, so it
      // reverses exactly on the way back up.
      if (decorative) {
        gsap.to(q(".hero-stack"), {
          yPercent: -4,
          // Kept light: the buttons are still on screen for most of this scroll.
          opacity: 0.6,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      }

      // The photograph drifts a few pixels against the cursor, zoomed just enough
      // that the drift never shows an edge. Fine pointers only.
      const figure = root.querySelector<HTMLElement>(".hero-figure");
      const drift = root.querySelector<HTMLElement>(".hero-portrait-drift");
      if (decorative && figure && drift && window.matchMedia("(pointer: fine)").matches) {
        const xTo = gsap.quickTo(drift, "x", { duration: 0.9, ease: "power3.out" });
        const yTo = gsap.quickTo(drift, "y", { duration: 0.9, ease: "power3.out" });
        const onEnter = () => gsap.to(drift, { scale: 1.06, duration: 0.9, ease: EASE, overwrite: "auto" });
        const onMove = (e: PointerEvent) => {
          const r = figure.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * -12);
          yTo(((e.clientY - r.top) / r.height - 0.5) * -12);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
          gsap.to(drift, { scale: 1, duration: 0.9, ease: EASE, overwrite: "auto" });
        };
        figure.addEventListener("pointerenter", onEnter);
        figure.addEventListener("pointermove", onMove);
        figure.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          figure.removeEventListener("pointerenter", onEnter);
          figure.removeEventListener("pointermove", onMove);
          figure.removeEventListener("pointerleave", onLeave);
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
        timelineRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) timelineRef.current?.play();
  }, [ready]);

  return (
    /*
     * From tablet up the hero fills the first view — but never taller than about
     * two-thirds of its width, so a tall portrait tablet gets a composed hero
     * instead of the same block floating in a screen of empty space.
     */
    <section ref={rootRef} className="relative flex md:min-h-[min(100svh,64vw)] flex-col overflow-hidden pt-16">
      {/*
       * On phones the hero is sized by its content, not the screen, so the
       * ticker follows the buttons at one steady distance on every phone height
       * instead of being pushed down to the fold with a gap that grows.
       */}
      <div className="relative flex flex-1 flex-col">
        <div aria-hidden="true" className="hero-guides pointer-events-none absolute inset-0">
          {/* Mirrors hero-stack's own grid-cols-12 + gap-x, so the guide lines land
              exactly on the real column edges instead of an unrelated equal split. */}
          <div className="shell grid h-full grid-cols-12 gap-x-5 md:gap-x-6">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="border-x border-foreground/[0.055]" />
            ))}
          </div>
        </div>

        <div className="shell relative flex flex-1 flex-col">
          {/*
           * Wide screens size this block by the viewport's height as well as its
           * width (type, gaps and photo all use vh-capped values) and centre it in
           * the space between the header and the facts row, so the whole hero —
           * ticker included — fits the first view on short and tall screens alike.
           */}
          <div className="hero-stack mt-10 pb-8 md:my-auto md:py-[clamp(1rem,3.5vh,3.5rem)] grid grid-cols-12 gap-x-5 md:gap-x-6 gap-y-8 md:gap-y-[clamp(1rem,3vh,2.5rem)]">
            <h1 className="hero-name display col-span-12 md:col-span-8 md:row-start-1 text-[12.5vw] md:text-[min(8vw,11vh)] 2xl:text-[min(6.5rem,11vh)] leading-[0.9]">
              <span className="block">
                <SplitText parts={["Md."]} />
              </span>
              <span className="block">
                <SplitText parts={["Wahiduzzaman"]} />
              </span>
              <span className="block">
                <SplitText parts={["Nayem"]} />
                <span aria-hidden="true" className="split-mask">
                  <span className="split-word">
                    <span className="hero-mark inline-block h-[0.16em] w-[0.16em] ml-[0.04em] bg-accent" />
                  </span>
                </span>
              </span>
            </h1>

            {/*
             * Bottom-aligned with the buttons, so the photo and the text column
             * finish on one line instead of leaving an empty corner under the
             * photo. Its height is capped at about half the viewport.
             */}
            <div className="col-span-5 sm:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10 md:row-start-1 md:row-span-3 self-start md:self-end">
              <figure className="hero-figure md:ml-auto md:max-w-[calc(52vh*0.8)]">
                <Portrait />
                {/* A plate caption, as in a printed spread. It names the figure, not the role — that is in the meta row. */}
                <figcaption className="hero-fade mt-3 flex items-baseline justify-between gap-3 font-mono text-[12px] md:text-[11px] leading-snug text-muted-foreground">
                  <span>
                    Fig. 01 — <span className="text-foreground">Portrait</span>
                  </span>
                  <span className="hidden sm:inline">2026</span>
                </figcaption>
              </figure>
            </div>

            {/*
             * Two lines below xl, so a longer phrase can never re-wrap the text
             * while it swaps. From xl there is room for the longest phrase on one
             * line, so the sentence reads as one; the vw cap keeps it from wrapping.
             */}
            <p className="hero-fade col-span-7 sm:col-span-8 lg:col-span-7 xl:col-span-8 md:row-start-2 self-center md:self-start font-display text-xl sm:text-2xl md:text-[clamp(1.35rem,min(3.4vh,3vw),2rem)] xl:text-[min(clamp(1.35rem,3.4vh,2rem),2.2vw)] leading-[1.15] tracking-[-0.025em] min-h-[4.6em] sm:min-h-[2.3em] xl:min-h-[1.15em] xl:whitespace-nowrap">
              <span className="block xl:inline">I turn</span>{" "}
              <RotatingPhrase />
            </p>

            {/* Narrow screens: the facts sit straight under the portrait and statement. */}
            <MetaRow className="col-span-12 grid md:hidden" />

            <div className="col-span-12 sm:col-start-5 sm:col-span-8 md:col-start-1 md:col-span-7 lg:col-span-6 md:row-start-3 flex flex-col gap-6 md:gap-[clamp(1rem,2.6vh,1.75rem)]">
              <p className="hero-fade max-w-lg text-[15px] md:text-base leading-relaxed text-muted-foreground text-pretty">
                Requirements engineering and process design across HRIS, payroll and recruitment systems —
                written so engineering can build it and the business can sign it off.
              </p>

              <div className="hero-fade flex flex-wrap items-center gap-3">
                <a ref={primaryRef} href="#contact" className="btn btn-accent">
                  Get in touch
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a ref={secondaryRef} href="#projects" className="btn btn-line">
                  View projects
                  <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/*
           * Wide screens: the facts row closes the hero, just above the ticker —
           * the name opens the page, and who, where and whether-available read as
           * its footnote. (Narrow screens show it under the portrait instead.)
           */}
          <MetaRow className="hidden md:grid md:mb-[clamp(1.75rem,4.5vh,3.5rem)]" />
        </div>
      </div>

      <div className="hero-marquee relative">
        <Marquee />
      </div>
    </section>
  );
};

export default Hero;
