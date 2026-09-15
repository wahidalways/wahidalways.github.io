/*
 * One scroll listener for the whole page.
 *
 * The header, the back-to-top ring, the share button and the ticker each used
 * to attach their own scroll listener, and two of them also ran a Framer Motion
 * scroll tracker with a spring on top. On a weak CPU that is four handlers and
 * two physics steps per scroll event — and scroll events can fire several times
 * per frame.
 *
 * Here the browser event only schedules a frame. The position is read once per
 * frame, then every subscriber gets the same numbers and writes its own styles.
 * All reads happen before any writes, so a frame can never force layout twice.
 */
export type ScrollListener = (y: number, progress: number) => void;

const listeners = new Set<ScrollListener>();
let scheduled = false;
let attached = false;

const measure = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
  return { y, progress };
};

const flush = () => {
  scheduled = false;
  const { y, progress } = measure();
  listeners.forEach((listener) => listener(y, progress));
};

const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(flush);
};

/** Subscribe to per-frame scroll updates. Fires once immediately. Returns an unsubscribe. */
export function subscribeScroll(listener: ScrollListener) {
  if (typeof window === "undefined") return () => {};

  listeners.add(listener);
  if (!attached) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    attached = true;
  }

  const { y, progress } = measure();
  listener(y, progress);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && attached) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      attached = false;
    }
  };
}
