import type { RefObject } from "react";
import { gsap, ScrollTrigger, MOTION_OK, EASE, ensureGsap, useIsoLayoutEffect } from "./gsap";
import { isLowPowerDevice } from "./performance";

/*
 * Declarative scroll motion for the whole page, driven by data attributes so
 * components describe *what* moves and this file owns *how*:
 *
 *   data-split    heading whose .split-word children rise out of their masks
 *   data-reveal   element that fades up when it enters (batched, so a row of
 *                 siblings arriving together staggers instead of popping)
 *   data-rule     hairline that draws from the left
 *   data-scrub    paragraph whose .scrub-word children brighten with scroll
 *   data-counter  number that counts up to its value
 *   data-speed    element with gentle scroll parallax (value in px)
 *
 * Everything is registered under prefers-reduced-motion: no-preference, so with
 * reduced motion — or if this never runs — the content simply sits in its
 * final, readable state.
 */
export function usePageMotion(scope: RefObject<HTMLElement>) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    ensureGsap();

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const q = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root);
      // Scroll-scrubbed effects update on every scroll frame for as long as
      // their section is in view. One-shot reveals stay everywhere; the
      // continuous, purely decorative ones are skipped on weak hardware.
      const decorative = !isLowPowerDevice();

      q<HTMLElement>("[data-split]").forEach((el) => {
        const words = el.querySelectorAll(".split-word");
        if (!words.length) return;
        gsap.from(words, {
          yPercent: 118,
          duration: 0.9,
          ease: EASE,
          stagger: 0.055,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      const reveals = q<HTMLElement>("[data-reveal]");
      if (reveals.length) {
        gsap.set(reveals, { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(reveals, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
      }

      q<HTMLElement>("[data-rule]").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
          ease: EASE,
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        });
      });

      (decorative ? q<HTMLElement>("[data-scrub]") : []).forEach((el) => {
        const words = el.querySelectorAll(".scrub-word");
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: 0.6 },
          },
        );
      });

      const counters = q<HTMLElement>("[data-counter]");
      counters.forEach((el) => {
        const raw = el.dataset.counter ?? "0";
        const target = parseFloat(raw);
        const decimals = (raw.split(".")[1] ?? "").length;
        const state = { value: 0 };
        el.textContent = (0).toFixed(decimals);
        gsap.to(state, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            // Assigning textContent swaps the text node and forces layout even
            // when the string is identical, so only write when the figure changes.
            const next = state.value.toFixed(decimals);
            if (el.textContent !== next) el.textContent = next;
          },
        });
      });

      (decorative ? q<HTMLElement>("[data-speed]") : []).forEach((el) => {
        const speed = parseFloat(el.dataset.speed ?? "0");
        gsap.fromTo(
          el,
          { y: speed },
          {
            y: -speed,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      return () => {
        // Counters were written directly; put the real figure back on revert.
        counters.forEach((el) => {
          el.textContent = el.dataset.counter ?? "";
        });
      };
    });

    // Web fonts change line heights after first layout, which moves every
    // trigger. Re-measure once they (and images) have settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [scope]);
}
