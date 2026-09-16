import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { subscribeScroll } from "@/lib/scroll-store";

/*
 * A back-to-top control that doubles as a reading gauge: the ring fills as the
 * page is read.
 *
 * The button stays mounted and fades with CSS, and the ring's offset is written
 * straight to the element from the shared scroll reader, so scrolling costs
 * one style write per frame here, not a React render or a motion-value update.
 */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let shown = -1;
    return subscribeScroll((y, progress) => {
      setVisible(y > 600);
      // Skip the write when the ring would not visibly move.
      if (!ringRef.current || Math.abs(progress - shown) < 0.001) return;
      shown = progress;
      ringRef.current.style.strokeDashoffset = (1 - progress).toFixed(4);
    });
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-5 right-5 z-40 grid place-items-center w-12 h-12 rounded-full bg-foreground text-background shadow-[0_12px_32px_-12px_rgb(0_0_0/0.5)] cursor-pointer transition-[opacity,transform] duration-300 ease-out-expo ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r="22.5"
          fill="none"
          strokeWidth="1.5"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          className="stroke-accent"
        />
      </svg>
      <ArrowUp aria-hidden="true" className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
};

export default BackToTop;
