import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FileText, Users, CheckCircle, Briefcase } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const stats = [
  { icon: Briefcase, value: 2, suffix: "+", label: "Years Experience" },
  { icon: FileText, value: 25, suffix: "%", label: "Rework Reduced" },
  { icon: CheckCircle, value: 10, suffix: "+", label: "Projects Delivered" },
  { icon: Users, value: 20, suffix: "+", label: "Stakeholders Managed" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-heading text-2xl md:text-4xl font-bold gradient-text">
      {count}{suffix}
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
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-4 md:p-6 text-center hover-glow"
              >
                <motion.div
                  whileInView={{ rotate: [0, 10, -10, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                >
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </motion.div>
                <Counter target={stat.value} suffix={stat.suffix} />
                <p className="text-[10px] md:text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
