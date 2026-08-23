import { m, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Award, Layers, TrendingUp, Briefcase } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

// Figures are drawn from the CV — 2.5+ years in the profile, six entries under
// Domain Knowledge, four entries under Certifications & Awards — except the role
// count, which includes the US Bangla Airlines role that post-dates the CV.
const stats = [
  { icon: Briefcase, value: 2.5, suffix: "+", label: "Years Experience" },
  { icon: Layers, value: 6, suffix: "", label: "Domains Covered" },
  { icon: TrendingUp, value: 4, suffix: "", label: "Analyst Roles Held" },
  { icon: Award, value: 4, suffix: "", label: "Awards & Certifications" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const decimals = Number.isInteger(target) ? 0 : 1;

  // Time-based rAF rather than a 16ms setInterval, which drifts and lands
  // between frames on a high-refresh display. This also eases out instead of
  // counting linearly, and always finishes on exactly `target`.
  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const factor = 10 ** decimals;
      setCount(Math.round(target * eased * factor) / factor);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, decimals]);

  return (
    <span ref={ref} className="font-heading text-2xl md:text-4xl font-bold gradient-text">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};

const Stats = () => {
  return (
    <section className="section-padding bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <m.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-4 md:p-6 text-center hover-glow"
              >
                <m.div
                  whileInView={{ rotate: [0, 10, -10, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                >
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </m.div>
                <Counter target={stat.value} suffix={stat.suffix} />
                <p className="text-[10px] md:text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
              </m.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
