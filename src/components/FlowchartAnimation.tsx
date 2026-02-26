import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FlowchartAnimation = ({ className = "" }: { className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const nodes = [
    { x: 50, y: 12, label: "Gather", w: 20 },
    { x: 50, y: 36, label: "Analyze", w: 18 },
    { x: 25, y: 60, label: "SRS", w: 14 },
    { x: 75, y: 60, label: "BRD", w: 14 },
    { x: 50, y: 84, label: "Deliver", w: 18 },
  ];

  const lines = [
    { x1: 50, y1: 20, x2: 50, y2: 28, delay: 0.4 },
    { x1: 42, y1: 44, x2: 30, y2: 52, delay: 0.8 },
    { x1: 58, y1: 44, x2: 70, y2: 52, delay: 0.8 },
    { x1: 30, y1: 68, x2: 42, y2: 76, delay: 1.2 },
    { x1: 70, y1: 68, x2: 58, y2: 76, delay: 1.2 },
  ];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-15">
        {lines.map((l, i) => (
          <motion.line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="hsl(var(--primary))" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.6, delay: l.delay }}
          />
        ))}
        {/* Animated flow dots on lines */}
        {inView && (
          <>
            <motion.circle r="1" fill="hsl(var(--accent))"
              animate={{ cy: [20, 28], cx: [50, 50], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
            />
            <motion.circle r="1" fill="hsl(var(--accent))"
              animate={{ cy: [68, 76], cx: [30, 42], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, delay: 2.5, repeat: Infinity }}
            />
          </>
        )}
        {nodes.map((node, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <rect
              x={node.x - node.w / 2} y={node.y - 6} width={node.w} height="12" rx="2.5"
              fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary))" strokeWidth="0.4"
            />
            <text x={node.x} y={node.y + 1.5} textAnchor="middle" fontSize="3.2"
              fill="hsl(var(--primary))" fontFamily="system-ui" fontWeight="500"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default FlowchartAnimation;
