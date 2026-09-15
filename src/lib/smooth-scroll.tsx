import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, ensureGsap, prefersReducedMotion } from "./gsap";
import { enableLiteMode, isLowPowerDevice } from "./performance";

let lenis: Lenis | null = null;

/** The live Lenis instance, or null when smooth scrolling is off. */
export const getLenis = () => lenis;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Scroll to a selector, element or offset. Goes through Lenis when it is
 * running so programmatic scrolls share the same inertia as the wheel, and
 * falls back to native scrolling (instant under reduced motion) when it is not.
 */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, easing: easeOutQuart });
    return;
  }

  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior });
}

/**
 * Lenis wired into GSAP's ticker, so ScrollTrigger reads the same scroll
 * position Lenis renders on the same frame — two separate rAF loops drift and
 * pinned sections visibly jitter.
 *
 * Not started under reduced motion (inertial scrolling is itself motion), nor
 * where ResizeObserver is missing, which Lenis needs to measure the page.
 */
const SmoothScroll = () => {
  useEffect(() => {
    if (prefersReducedMotion() || typeof ResizeObserver === "undefined") return;

    // Known-weak hardware never starts script-driven scrolling at all.
    if (isLowPowerDevice()) {
      enableLiteMode();
      return;
    }

    ensureGsap();
    const instance = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 });
    lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page links scroll through Lenis too. The skip link is left alone: its
    // job is to move keyboard focus, which only the browser's default does.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor || anchor.classList.contains("skip-link")) return;

      const hash = anchor.getAttribute("href") ?? "";
      if (hash === "#") {
        event.preventDefault();
        instance.scrollTo(0, { duration: 1.4, easing: easeOutQuart });
        return;
      }
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      event.preventDefault();
      instance.scrollTo(el, { duration: 1.4, easing: easeOutQuart });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    let active = true;
    const teardown = () => {
      if (!active) return;
      active = false;
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };

    return teardown;
  }, []);

  return null;
};

export default SmoothScroll;
