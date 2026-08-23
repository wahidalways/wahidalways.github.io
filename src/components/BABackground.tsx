import { FileText, GitBranch, BarChart3, Database, Workflow, ClipboardCheck, FileSearch, PieChart } from "lucide-react";
import { useMemo, useRef } from "react";
import { useInView } from "framer-motion";

const icons = [FileText, GitBranch, BarChart3, Database, Workflow, ClipboardCheck, FileSearch, PieChart];

interface BABackgroundProps {
  density?: "light" | "medium";
  className?: string;
}

/**
 * Ambient section decoration. Six sections mount one of these, so it is the
 * single largest source of continuous animation on the page — everything here
 * is CSS keyframes on the compositor, and the whole set is unmounted while the
 * section is off screen so it costs nothing at all until you scroll to it.
 */
const BABackground = ({ density = "light", className = "" }: BABackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });

  const items = useMemo(() => {
    const count = density === "light" ? 5 : 8;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      Icon: icons[i % icons.length],
      x: 8 + (i * 84 / count) + Math.random() * 8,
      y: 10 + Math.random() * 75,
      delay: i * 1.2,
      duration: 12 + Math.random() * 8,
      rotate: Math.random() * 20 - 10,
    }));
  }, [density]);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden pointer-events-none hidden sm:block ${className}`}
    >
      {inView && (
        <>
          {items.map(({ id, Icon, x, y, delay, duration, rotate }) => (
            <div
              key={id}
              className="absolute anim-loop anim-ba-icon"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                "--dur": `${duration}s`,
                "--delay": `${delay}s`,
                "--rot": `${rotate}deg`,
              } as React.CSSProperties}
            >
              <Icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
            </div>
          ))}

          {/* Data flow lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]">
            <path
              d="M0,30% Q20%,15% 40%,30% T80%,25% T100%,35%"
              fill="none" stroke="hsl(var(--primary))" strokeWidth="1"
              pathLength={1} strokeDasharray={1}
              className="anim-loop anim-path-draw"
              style={{ "--dur": "14s" } as React.CSSProperties}
            />
            <path
              d="M0,70% Q30%,60% 55%,70% T100%,65%"
              fill="none" stroke="hsl(var(--accent))" strokeWidth="0.8"
              pathLength={1} strokeDasharray={1}
              className="anim-loop anim-path-draw"
              style={{ "--dur": "16s", "--delay": "4s" } as React.CSSProperties}
            />
            {/* Process flow boxes */}
            <rect
              x="10%" y="45%" width="6%" height="3%" rx="3" fill="none"
              stroke="hsl(var(--primary))" strokeWidth="0.4"
              className="anim-loop anim-fade-io"
              style={{ "--dur": "8s", "--op": 0.5 } as React.CSSProperties}
            />
            <rect
              x="84%" y="40%" width="6%" height="3%" rx="3" fill="none"
              stroke="hsl(var(--accent))" strokeWidth="0.4"
              className="anim-loop anim-fade-io"
              style={{ "--dur": "10s", "--delay": "3s", "--op": 0.4 } as React.CSSProperties}
            />
          </svg>
        </>
      )}
    </div>
  );
};

export default BABackground;
