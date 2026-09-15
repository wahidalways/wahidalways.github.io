import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export { gsap, ScrollTrigger };

let registered = false;

/**
 * Registers ScrollTrigger on first use rather than at import. Registration
 * immediately queries window.matchMedia, so doing it at module load crashes
 * any environment that has a window but no matchMedia yet (a test DOM, an old
 * embedded webview). Every effect that touches GSAP calls this first.
 */
export const ensureGsap = () => {
  if (registered || typeof window === "undefined" || typeof window.matchMedia !== "function") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    // On phones the address bar showing and hiding resizes the viewport on
    // almost every scroll. Re-measuring every trigger each time is the single
    // biggest source of mid-scroll jank on mobile, and nothing here needs it.
    ignoreMobileResize: true,
    // Only fire callbacks when a trigger's state actually changes.
    limitCallbacks: true,
  });
  registered = true;
};

/** gsap.matchMedia condition every non-essential animation is registered under. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** The house curve: decelerate hard, settle soft. */
export const EASE = "expo.out";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/*
 * Initial animation states must be applied before the browser paints, or every
 * element flashes in its final position for one frame and then jumps. Layout
 * effects run before paint; the fallback keeps server or test renders quiet.
 */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
