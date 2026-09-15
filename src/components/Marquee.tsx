import { useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK, ensureGsap, useIsoLayoutEffect } from "@/lib/gsap";
import { subscribeScroll } from "@/lib/scroll-store";
import { isLiteMode, isLowPowerDevice } from "@/lib/performance";

// Domains and deliverables, not tools — what the work covers, at a glance.
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
 * The list is rendered twice and the track travels exactly half its own width,
 * so the loop has no seam. It is one compositor-friendly transform tween.
 *
 * Three things keep it cheap:
 *   - it pauses whenever the band is off screen, so it costs nothing while the
 *     rest of the page is being read;
 *   - the scroll speed-up drives a single reusable quickTo, instead of
 *     creating a fresh tween on every scroll event as it used to;
 *   - on low-power devices the speed-up is skipped entirely.
 *
 * Under reduced motion there is no loop, so the track wraps onto several lines
 * instead of running off the edge with half its items out of view.
 */
const Marquee = () => {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const band = bandRef.current;
    const track = trackRef.current;
    if (!band || !track) return;
    ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      track.dataset.running = "true";
      const loop = gsap.to(track, { xPercent: -50, duration: 42, ease: "none", repeat: -1 });

      const visibility = ScrollTrigger.create({
        trigger: band,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });
      if (!visibility.isActive) loop.pause();

      let unsubscribe = () => {};
      let settle: ReturnType<typeof setTimeout> | undefined;

      if (!isLowPowerDevice()) {
        const speed = { value: 1 };
        const setSpeed = gsap.quickTo(speed, "value", {
          duration: 0.5,
          ease: "power3.out",
          onUpdate: () => {
            loop.timeScale(speed.value);
          },
        });

        let lastY = window.scrollY;
        unsubscribe = subscribeScroll((y) => {
          const delta = Math.abs(y - lastY);
          lastY = y;
          if (delta < 1 || isLiteMode() || !visibility.isActive) return;
          setSpeed(1 + Math.min(delta / 8, 4));
          clearTimeout(settle);
          settle = setTimeout(() => setSpeed(1), 160);
        });
      }

      return () => {
        clearTimeout(settle);
        unsubscribe();
        visibility.kill();
        delete track.dataset.running;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={bandRef} className="relative overflow-hidden border-t border-border">
      <div
        ref={trackRef}
        className="marquee-track group flex-wrap data-[running=true]:flex-nowrap data-[running=true]:will-change-transform"
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className={`items-center flex-wrap group-data-[running=true]:flex-nowrap ${
              copy === 1 ? "hidden group-data-[running=true]:flex" : "flex"
            }`}
          >
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex items-center gap-5 md:gap-7 pr-5 md:pr-7 py-4 md:py-5">
                <span className="font-display text-lg md:text-2xl tracking-[-0.02em] whitespace-nowrap">{item}</span>
                <span aria-hidden="true" className="w-1.5 h-1.5 rotate-45 bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
