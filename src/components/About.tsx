import { m } from "framer-motion";
import { Target, Users, FileText, TrendingUp } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";
import FlowchartAnimation from "./FlowchartAnimation";

const highlights = [
  { icon: Target, label: "Requirements Engineering", desc: "Gathering, analysing and translating business needs into actionable specifications" },
  { icon: FileText, label: "Documentation", desc: "BRD, SRS, FRD, PRD, Change Requests & process flow diagrams" },
  { icon: Users, label: "Stakeholder Management", desc: "Aligning development, QA, UI/UX and operations across Agile sprint cycles" },
  { icon: TrendingUp, label: "Process Optimization", desc: "Gap and impact analysis to remove bottlenecks and drive operational efficiency" },
];

const domains = [
  "HRIS",
  "Payroll & Workforce Management",
  "ATS",
  "E-commerce (Cartup)",
  "Food Delivery (Foodi) & Logistics",
  "Healthcare & Medical Travel",
];

const About = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <BABackground density="light" />
      <div className="container mx-auto relative z-10">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">About Me</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Professional Summary</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg text-center px-2">
            Technical Business Analyst with 2.5+ years of experience in requirements engineering, business analysis, and solution delivery. I leverage AI-powered tools and techniques to enhance requirement analysis, documentation quality, and process optimization. Skilled in stakeholder management, business process analysis, and creating functional documentation and Change Requests — adept at translating business needs into clear, actionable solutions that drive operational efficiency and business value.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {highlights.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.1}>
              <m.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-5 md:p-6 hover-glow cursor-default h-full"
              >
                <m.div
                  whileInView={{ rotate: [0, -8, 8, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                >
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </m.div>
                <h3 className="font-heading font-semibold text-base md:text-lg mb-2">{item.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </m.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Flowchart */}
        <ScrollReveal delay={0.2} className="text-center mb-12 md:mb-16">
          <h3 className="font-heading font-semibold text-lg mb-5">How I Work</h3>
          <div className="max-w-xl mx-auto px-2">
            <FlowchartAnimation />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="text-center">
          <h3 className="font-heading font-semibold text-lg mb-4">Domain Expertise</h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {domains.map((d, i) => (
              <m.span
                key={d}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full glass text-xs md:text-sm font-medium text-foreground cursor-default hover-border-accent"
              >
                {d}
              </m.span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
