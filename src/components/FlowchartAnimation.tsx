import { m, useInView } from "framer-motion";
import { useId, useRef } from "react";

/*
 * The one diagram on a business analyst's portfolio, so it has to be a diagram
 * a business analyst would actually draw: left to right, connectors that meet
 * the node edges, arrowheads that say which way the work flows.
 *
 * Geometry is expressed in viewBox units and derived from the node box rather
 * than hand-tuned, so the lines cannot drift away from the shapes again.
 */

const NODE_W = 76;
const NODE_H = 38;
const VIEW_W = 420;
const VIEW_H = 140;

type Tone = "primary" | "accent";

const nodes: { cx: number; cy: number; label: string; tone: Tone }[] = [
  { cx: 48, cy: 70, label: "Gather", tone: "primary" },
  { cx: 150, cy: 70, label: "Analyse", tone: "primary" },
  { cx: 252, cy: 30, label: "BRD", tone: "primary" },
  { cx: 252, cy: 110, label: "SRS", tone: "primary" },
  { cx: 372, cy: 70, label: "Deliver", tone: "accent" },
];

const left = (cx: number) => cx - NODE_W / 2;
const right = (cx: number) => cx + NODE_W / 2;

/*
 * Every path starts on one node's right edge and ends on the next node's left
 * edge. The branch and merge use cubic curves whose control points are level
 * with their endpoints, so each path arrives horizontally — which is what lets
 * the arrowheads below be plain right-pointing triangles.
 */
const connectors = [
  { d: `M${right(48)} 70 H${left(150)}`, delay: 0.35 },
  { d: `M${right(150)} 70 C 199 70, 203 30, ${left(252)} 30`, delay: 0.7 },
  { d: `M${right(150)} 70 C 199 70, 203 110, ${left(252)} 110`, delay: 0.7 },
  { d: `M${right(252)} 30 C 306 30, 318 70, ${left(372)} 70`, delay: 1.05 },
  { d: `M${right(252)} 110 C 306 110, 318 70, ${left(372)} 70`, delay: 1.05 },
];

// One head per arrival point — the two merge curves share Deliver's edge, so
// stacking a second triangle there would just render a darker blob.
const arrowheads = [
  { x: left(150), y: 70, delay: 0.85 },
  { x: left(252), y: 30, delay: 1.2 },
  { x: left(252), y: 110, delay: 1.2 },
  { x: left(372), y: 70, delay: 1.55 },
];

const head = (x: number, y: number) => `${x},${y} ${x - 7},${y - 3.6} ${x - 7},${y + 3.6}`;

const FlowchartAnimation = ({ className = "" }: { className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const uid = useId();

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Process flow: Gather, then Analyse, which produces a BRD and an SRS, both feeding into Deliver."
      >
        {connectors.map((c, i) => (
          <g key={`c-${i}`}>
            <m.path
              d={c.d}
              fill="none"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: c.delay, ease: "easeInOut" }}
            />
            {/*
              * A short dash travelling the same path reads as work moving
              * through the flow. pathLength="100" normalises every path to the
              * same scale, so one keyframe drives all five at a steady speed
              * regardless of how long each curve actually is.
              */}
            {inView && (
              <path
                d={c.d}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="2.2"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="7 93"
                className="anim-loop anim-flow-pulse"
                style={{ "--dur": "3.2s", "--delay": `${1.8 + i * 0.18}s` } as React.CSSProperties}
              />
            )}
          </g>
        ))}

        {arrowheads.map((a, i) => (
          <m.polygon
            key={`a-${i}`}
            points={head(a.x, a.y)}
            fill="hsl(var(--primary) / 0.55)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.25, delay: a.delay }}
          />
        ))}

        {nodes.map((node, i) => {
          const accent = node.tone === "accent";
          return (
            <m.g
              key={node.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              transition={{ delay: i * 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <rect
                x={left(node.cx)}
                y={node.cy - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx="9"
                fill={accent ? "hsl(var(--accent) / 0.12)" : "hsl(var(--primary) / 0.08)"}
                stroke={accent ? "hsl(var(--accent) / 0.7)" : "hsl(var(--primary) / 0.5)"}
                strokeWidth="1.4"
              />
              <text
                x={node.cx}
                y={node.cy}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-heading"
                fontSize="15"
                fontWeight="600"
                fill="hsl(var(--foreground))"
              >
                {node.label}
              </text>
            </m.g>
          );
        })}
      </svg>
    </div>
  );
};

export default FlowchartAnimation;
