import { motion } from "framer-motion";
import { FileText, GitBranch, BarChart3, Database, Workflow, ClipboardCheck, FileSearch, PieChart } from "lucide-react";
import { useMemo } from "react";

const icons = [FileText, GitBranch, BarChart3, Database, Workflow, ClipboardCheck, FileSearch, PieChart];

interface BABackgroundProps {
  density?: "light" | "medium";
  className?: string;
}

const BABackground = ({ density = "light", className = "" }: BABackgroundProps) => {
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
    <div className={`absolute inset-0 overflow-hidden pointer-events-none hidden sm:block ${className}`}>
      {items.map(({ id, Icon, x, y, delay, duration, rotate }) => (
        <motion.div
          key={id}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.06, 0.02, 0.06],
            y: [0, -15, 0],
            rotate: [0, rotate, 0],
          }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
        </motion.div>
      ))}

      {/* Data flow lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]">
        <motion.path
          d="M0,30% Q20%,15% 40%,30% T80%,25% T100%,35%"
          fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,70% Q30%,60% 55%,70% T100%,65%"
          fill="none" stroke="hsl(var(--accent))" strokeWidth="0.8" strokeDasharray="4 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 16, delay: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Process flow boxes */}
        <motion.rect
          x="10%" y="45%" width="6%" height="3%" rx="3" fill="none"
          stroke="hsl(var(--primary))" strokeWidth="0.4"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.rect
          x="84%" y="40%" width="6%" height="3%" rx="3" fill="none"
          stroke="hsl(var(--accent))" strokeWidth="0.4"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 10, delay: 3, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};

export default BABackground;
