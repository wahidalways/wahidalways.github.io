import { motion } from "framer-motion";
import { Target, Users, FileText, TrendingUp } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";
import FlowchartAnimation from "./FlowchartAnimation";

const highlights = [
  { icon: Target, label: "Requirement Analysis", desc: "Translating complex business needs into clear functional specifications" },
  { icon: FileText, label: "Documentation", desc: "SRS, BRD, CR, User Stories & Process Flow Diagrams" },
  { icon: Users, label: "Stakeholder Management", desc: "Collaborating with cross-functional teams for timely delivery" },
  { icon: TrendingUp, label: "Process Optimization", desc: "Reducing documentation rework by 25% across projects" },
];

const domains = ["E-commerce", "HRIS & Payroll", "ERP & Logistics", "Process Automation", "Administration & ATS", "CRM"];

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
            Dedicated Business Analyst specializing in requirement analysis, comprehensive documentation (SRS, BRD, CR), and effective stakeholder management. I excel at translating complex business needs into clear, functional specifications and collaborating with cross-functional teams to ensure timely and budget-compliant project delivery. My contributions span across e-commerce, HRIS, ERP, and logistics platforms, where I have significantly improved UAT cycles, minimized documentation errors, and enhanced overall project clarity.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {highlights.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-5 md:p-6 hover-glow cursor-default h-full"
              >
                <motion.div
                  whileInView={{ rotate: [0, -8, 8, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                >
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </motion.div>
                <h3 className="font-heading font-semibold text-base md:text-lg mb-2">{item.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Flowchart */}
        <div className="max-w-[200px] md:max-w-xs mx-auto mb-10 md:mb-12">
          <FlowchartAnimation />
        </div>

        <ScrollReveal delay={0.2} className="text-center">
          <h3 className="font-heading font-semibold text-lg mb-4">Domain Expertise</h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {domains.map((d, i) => (
              <motion.span
                key={d}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full glass text-xs md:text-sm font-medium text-foreground cursor-default hover-border-accent"
              >
                {d}
              </motion.span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
