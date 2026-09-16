import { useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK, ensureGsap, useIsoLayoutEffect } from "@/lib/gsap";
import { subscribeScroll } from "@/lib/scroll-store";
import { isLiteMode, isLowPowerDevice } from "@/lib/performance";

// Domains and deliverables, not tools: what the work covers, at a glance.
const CAPABILITIES = [
  "HRIS",
  "Payroll",
  "Recruitment & ATS",
  "BRD · FRD · SRS",
  "Gap & Impact Analysis",
  "Process Design",
  "Agile & Scrum",
  "Stakeholder Workshops",
  "UAT & Traceability",
];

type Run = { x: number; y: number; w: number };

/** Row-runs of the cells in `rows` whose character is one of `chars`. */
const runsOf = (rows: string[], chars: string, offsetY = 0): Run[] => {
  const runs: Run[] = [];
  rows.forEach((row, y) => {
    let start = -1;
    for (let x = 0; x <= row.length; x++) {
      const on = x < row.length && chars.includes(row[x]);
      if (on && start < 0) start = x;
      if (!on && start >= 0) {
        runs.push({ x: start, y: y + offsetY, w: x - start });
        start = -1;
      }
    }
  });
  return runs;
};

const PixelRuns = ({ runs, className }: { runs: Run[]; className?: string }) => (
  <>
    {runs.map((r) => (
      <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} className={className} />
    ))}
  </>
);

/*
 * The chomper: a 13×13 pixel mouth. Three frames (open, half, shut) differ
 * only in the wedge cut out of the right side. The eye is painted in the page
 * ground rather than cut out, because the track passes behind this half.
 */
const SPRITE = 13;
const EYE = { x: 7, y: 3 };
const CHOMP_FRAMES = [0.95, 0.45, -1].map((slope) => {
  const c = (SPRITE - 1) / 2;
  const rows = Array.from({ length: SPRITE }, (_, y) =>
    Array.from({ length: SPRITE }, (_, x) => {
      const dx = x - c;
      const dy = y - c;
      const body = dx * dx + dy * dy <= 6.6 * 6.6;
      const mouth = slope >= 0 && dx > 0 && Math.abs(dy) <= dx * slope;
      return body && !mouth ? "#" : ".";
    }).join(""),
  );
  return runsOf(rows, "#");
});
const OPEN = 0;
const HALF = 1;
const SHUT = 2;

/*
 * The ghost that separates the words: 10×10, eyes looking left toward the
 * mouth, and a skirt with two frames that swap as the band moves. Ghosts take
 * the classic four colours, each deepened a little so it still reads on the
 * light page.
 */
const GHOST_COLORS = ["#dc2626", "#db2777", "#0891b2", "#ea580c"];
// Cycle the four, but never let the last ghost match the first: they sit side
// by side where the loop wraps.
const ghostColor = (i: number) => {
  const c = i % GHOST_COLORS.length;
  return GHOST_COLORS[i === CAPABILITIES.length - 1 && c === 0 ? 2 : c];
};
const GHOST = [
  "...####...",
  ".########.",
  "##########",
  "#oo##oo###",
  "#po##po###",
  "##########",
  "##########",
  "##########",
  "##########",
];
const GHOST_BODY = runsOf(GHOST, "#");
const GHOST_WHITES = runsOf(GHOST, "o");
const GHOST_PUPILS = runsOf(GHOST, "p");
const GHOST_SKIRTS = ["#.##..##.#", ".##.##.##."].map((row) => runsOf([row], "#", GHOST.length));

const Ghost = ({ color }: { color: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 10 10"
    shapeRendering="crispEdges"
    data-color={color}
    style={{ fill: color }}
    className="marquee-ghost h-5 w-5 shrink-0 transition-transform duration-500 ease-out-expo group-hover/item:-translate-y-1"
  >
    <PixelRuns runs={GHOST_BODY} />
    <PixelRuns runs={GHOST_WHITES} className="fill-white" />
    <PixelRuns runs={GHOST_PUPILS} className="fill-[#1e3a8a]" />
    {GHOST_SKIRTS.map((runs, i) => (
      <g key={i} data-skirt={i}>
        <PixelRuns runs={runs} />
      </g>
    ))}
  </svg>
);

// Bites per second, and skirt swaps per second, of loop time.
const CHEW_RATE = 7;
const WIGGLE_RATE = 5;
// How far ahead (px) the mouth opens for an arriving ghost.
const ANTICIPATE = 14;
const CRUMBS = 12;

/*
 * A ruled band with a fixed label on the left and the capabilities running
 * into it. Between the words run pixel ghosts, and a pixel mouth at the label
 * eats each ghost as it arrives; the words slide past behind the shut mouth.
 *
 * The list is rendered twice and the track travels exactly half its own width,
 * so the loop has no seam. It is one compositor-friendly transform tween.
 *
 * Nothing else has a clock of its own. On each loop update the mouth works out,
 * from cached ghost offsets and the track's current position, whether a ghost
 * is arriving (open), inside the lips (chewing) or not there (shut), and the
 * ghosts' skirts swap on the same loop time, so all of it keeps pace with the
 * band through scroll speed-ups and hover stops. Each bite spits a couple of
 * pixel crumbs from a small reused pool.
 *
 * What keeps it cheap:
 *   - it pauses whenever the band is off screen;
 *   - positions are measured once (and on refresh), not every frame, and
 *     attributes are only written when they change;
 *   - the scroll speed-up and hover slow-down share one reusable quickTo;
 *   - on low-power devices the speed changes and crumbs are skipped.
 *
 * Under reduced motion there is no loop, so the track wraps onto several lines
 * instead of running off the edge, and the label and mouth step aside.
 */
const Marquee = () => {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<SVGSVGElement>(null);

  useIsoLayoutEffect(() => {
    const band = bandRef.current;
    const track = trackRef.current;
    const mouth = mouthRef.current;
    if (!band || !track || !mouth) return;
    ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      band.dataset.running = "true";
      const loop = gsap.to(track, { xPercent: -50, duration: 42, ease: "none", repeat: -1 });
      const decorative = !isLowPowerDevice();
      const cleanups: (() => void)[] = [];

      // --- Where everything is, in band coordinates -----------------------------
      const ghostEls = gsap.utils.toArray<SVGSVGElement>(".marquee-ghost", track);
      let ghosts: { l: number; r: number; color: string }[] = [];
      let trackBase = 0;
      let trackWidth = 1;
      let swallowX = 0; // the mouth's centre: a ghost is gone once it passes this
      let lipsX = 0; // the mouth's front edge
      let midY = 0;

      const measure = () => {
        const bandRect = band.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        trackWidth = track.offsetWidth || 1;
        const shiftNow = ((gsap.getProperty(track, "xPercent") as number) / 100) * trackWidth;
        trackBase = trackRect.left - bandRect.left - shiftNow;
        ghosts = ghostEls.map((g) => {
          const r = g.getBoundingClientRect();
          return { l: r.left - trackRect.left, r: r.right - trackRect.left, color: g.dataset.color ?? "" };
        });
        const m = mouth.getBoundingClientRect();
        swallowX = m.left + m.width / 2 - bandRect.left;
        lipsX = m.right - bandRect.left;
        midY = m.top + m.height / 2 - bandRect.top;
      };
      measure();
      // Web fonts and resizes move everything; ScrollTrigger refreshes on both.
      ScrollTrigger.addEventListener("refresh", measure);
      document.fonts?.ready.then(measure).catch(() => {});
      cleanups.push(() => ScrollTrigger.removeEventListener("refresh", measure));

      // --- Crumbs -----------------------------------------------------------------
      const crumbs = gsap.utils.toArray<HTMLElement>(".chomp-crumb", band);
      let nextCrumb = 0;
      // Crumbs are bits of whichever ghost is being eaten, so they share its colour.
      const spit = (color: string) => {
        for (let k = 0; k < 2; k++) {
          const el = crumbs[nextCrumb++ % crumbs.length];
          if (!el) return;
          gsap.killTweensOf(el);
          gsap.set(el, {
            backgroundColor: color,
            x: lipsX - 6,
            y: midY + gsap.utils.random(-4, 4),
            rotate: 0,
            scale: gsap.utils.random([1, 1.34]),
            autoAlpha: 1,
          });
          // Burst up or down out of the lips, then drop away, wider and springier
          // than a stray crumb has any right to be: that is what sells the bite.
          const side = k === 0 ? -1 : 1;
          gsap
            .timeline()
            .to(el, {
              x: `+=${gsap.utils.random(-5, 11)}`,
              y: `+=${side * gsap.utils.random(9, 16)}`,
              rotate: gsap.utils.random(-160, 160),
              duration: 0.2,
              ease: "back.out(2)",
            })
            .to(el, { y: `+=${gsap.utils.random(12, 22)}`, autoAlpha: 0, duration: 0.4, ease: "power2.in" });
        }
      };

      // --- A one-shot squash, reused for both the mouth's chomp and a ghost's gulp. ---
      const punch = (el: Element, scaleX: number, scaleY: number, duration: number) => {
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          { scale: 1 },
          { scaleX, scaleY, duration, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "50% 50%" },
        );
      };

      // --- The mouth and the ghosts, kept in time with the band ------------------------
      let frame = -1;
      let bite = -1;
      let wiggle = -1;
      let eatingIndex = -1;
      const setFrame = (next: number) => {
        if (next === frame) return;
        frame = next;
        mouth.dataset.frame = String(next);
      };

      const tick = () => {
        const time = loop.totalTime();

        const w = Math.floor(time * WIGGLE_RATE) % 2;
        if (w !== wiggle) {
          wiggle = w;
          band.dataset.wiggle = String(w);
        }

        const shift = trackBase + ((gsap.getProperty(track, "xPercent") as number) / 100) * trackWidth;
        let eating: string | null = null;
        let eatingAt = -1;
        let arriving = false;
        for (let idx = 0; idx < ghosts.length; idx++) {
          const g = ghosts[idx];
          const left = g.l + shift;
          const right = g.r + shift;
          if (left < lipsX && right > swallowX) {
            eating = g.color;
            eatingAt = idx;
            break;
          }
          if (left >= lipsX && left < lipsX + ANTICIPATE) arriving = true;
        }

        // The instant a ghost first overlaps the lips, it gets one quick squash,
        // as if the mouth had actually closed on it, right before it disappears
        // behind the label panel.
        if (eatingAt !== eatingIndex) {
          eatingIndex = eatingAt;
          if (eatingAt >= 0 && decorative) punch(ghostEls[eatingAt], 0.5, 1.4, 0.09);
        }

        if (eating !== null) {
          const b = Math.floor(time * CHEW_RATE) % 2;
          setFrame(b === 0 ? OPEN : HALF);
          if (b !== bite) {
            bite = b;
            if (b === 0 && decorative) punch(mouth, 1.18, 0.85, 0.08);
            if (b === 1 && decorative) spit(eating);
          }
        } else {
          bite = -1;
          setFrame(arriving ? OPEN : SHUT);
        }
      };
      loop.eventCallback("onUpdate", tick);
      tick();

      // --- Visibility, scroll and hover ---------------------------------------------
      const visibility = ScrollTrigger.create({
        trigger: band,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });
      if (!visibility.isActive) loop.pause();

      if (decorative) {
        const speed = { value: 1 };
        const setSpeed = gsap.quickTo(speed, "value", {
          duration: 0.5,
          ease: "power3.out",
          onUpdate: () => {
            loop.timeScale(speed.value);
          },
        });

        // Hovering eases the band (and the chase) to a stop so an item can be read.
        let hovered = false;
        if (window.matchMedia("(pointer: fine)").matches) {
          const onEnter = () => {
            hovered = true;
            setSpeed(0);
          };
          const onLeave = () => {
            hovered = false;
            setSpeed(1);
          };
          band.addEventListener("pointerenter", onEnter);
          band.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            band.removeEventListener("pointerenter", onEnter);
            band.removeEventListener("pointerleave", onLeave);
          });
        }

        let settle: ReturnType<typeof setTimeout> | undefined;
        let lastY = window.scrollY;
        const unsubscribe = subscribeScroll((y) => {
          const delta = Math.abs(y - lastY);
          lastY = y;
          if (hovered || delta < 1 || isLiteMode() || !visibility.isActive) return;
          setSpeed(1 + Math.min(delta / 8, 4));
          clearTimeout(settle);
          settle = setTimeout(() => setSpeed(hovered ? 0 : 1), 160);
        });
        cleanups.push(() => {
          clearTimeout(settle);
          unsubscribe();
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
        visibility.kill();
        mouth.dataset.frame = String(SHUT);
        delete band.dataset.wiggle;
        delete band.dataset.running;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={bandRef} className="group/band relative overflow-hidden border-y border-border">
      {/*
       * The fixed label and the mouth. This cell carries the page ground and ends
       * at the mouth's centre, with the front half of the mouth hanging over the
       * track, so ghosts slide into the open mouth, and words slip behind the
       * shut one, with no hard edge in front of the lips.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-10 hidden items-center gap-3 md:gap-4 bg-background pl-5 md:pl-8 xl:pl-12 group-data-[running=true]/band:flex"
      >
        <span className="label whitespace-nowrap font-pixel text-[11px] md:text-[11px] tracking-[0.04em] text-foreground">
          Focus areas
        </span>
        <svg
          ref={mouthRef}
          data-frame={SHUT}
          viewBox={`0 0 ${SPRITE} ${SPRITE}`}
          shapeRendering="crispEdges"
          className="chomper -mr-[13px] h-[26px] w-[26px] shrink-0 fill-accent"
        >
          {CHOMP_FRAMES.map((runs, f) => (
            <g key={f}>
              <PixelRuns runs={runs} />
              <rect x={EYE.x} y={EYE.y} width={1} height={1} className="fill-background" />
            </g>
          ))}
        </svg>
      </div>

      {/* Crumbs: a small reused pool, positioned and flung by GSAP. */}
      {Array.from({ length: CRUMBS }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="chomp-crumb pointer-events-none invisible absolute left-0 top-0 z-20 h-[3px] w-[3px] bg-muted-foreground opacity-0"
        />
      ))}

      <div
        ref={trackRef}
        // At rest (reduced motion) the track fills the band and wraps inside the page
        // gutter; only a running track is sized to its content for the seamless loop.
        className="marquee-track w-auto flex-wrap px-5 md:px-8 xl:px-12 group-data-[running=true]/band:w-max group-data-[running=true]/band:flex-nowrap group-data-[running=true]/band:px-0 group-data-[running=true]/band:will-change-transform"
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className={`items-center flex-wrap group-data-[running=true]/band:flex-nowrap ${
              copy === 1 ? "hidden group-data-[running=true]/band:flex" : "flex"
            }`}
          >
            {CAPABILITIES.map((item, i) => (
              <li key={item} className="group/item flex items-center gap-6 md:gap-8 pr-6 md:pr-8 py-3.5 md:py-4">
                <span className="whitespace-nowrap font-pixel text-[15px] md:text-lg tracking-normal transition-colors duration-300 group-hover/item:text-accent-ink">
                  {item}
                </span>
                <Ghost color={ghostColor(i)} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
