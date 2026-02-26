import { motion } from "framer-motion";
import { Building2, Calendar, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";

const experiences = [
  {
    title: "Business Analyst",
    company: "TechnoNext Software Limited, US Bangla Airlines",
    duration: "Jan 2026 – Present",
    points: [
      "Leading the development and optimization of HRIS to streamline workforce management and data accuracy.",
      "Spearheading process automation initiatives, reducing manual workflows and increasing operational efficiency.",
      "Managing end-to-end requirement lifecycles for complex enterprise solutions.",
      "Conducting detailed workflow analysis to identify bottlenecks and propose scalable automated solutions.",
    ],
  },
  {
    title: "Junior Business Analyst",
    company: "TechnoNext Software Limited, US Bangla Airlines",
    duration: "June 2024 – Dec 2025",
    points: [
      "Collaborated with stakeholders to gather requirements, perform gap analysis, and design solutions.",
      "Prepared SRS, CR, user stories, and process flow diagrams for CartUp, ERP, Payroll & HRIS.",
      "Reduced documentation rework by 25% through accurate SRS and CR preparation.",
      "Coordinated with Development, QA, UI/UX, and Operations teams to ensure project alignment.",
    ],
  },
  {
    title: "Intern Business Analyst",
    company: "TechnoNext Software Limited, US Bangla Airlines",
    duration: "Feb 2024 – May 2024",
    points: [
      "Assisted in requirement gathering and process analysis for Foodi and Meditrip platforms.",
      "Contributed to documentation (SRS, CR, process flows), improving workflow clarity.",
      "Supported UAT and end-user training, ensuring smooth solution adoption.",
      "Gained hands-on experience in end-to-end project delivery with cross-functional teams.",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <BABackground density="medium" />
      <div className="container mx-auto relative z-10">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Career</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Work Experience</h2>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
            style={{ background: "var(--gradient-primary)" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {experiences.map((exp, i) => (
            <ScrollReveal
              key={exp.title + exp.duration}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 0.15}
              className={`relative mb-10 md:mb-12 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"}`}
            >
              {/* Timeline dot */}
              <div
                className="absolute top-6 left-[15px] md:left-auto hidden md:block"
                style={i % 2 === 0 ? { right: "-7px" } : { left: "-7px" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                  className="w-3.5 h-3.5 rounded-full bg-primary shadow-md"
                />
              </div>

              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-5 md:p-6 hover-glow ml-12 md:ml-0"
              >
                <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  {exp.duration}
                </div>
                <h3 className="font-heading font-bold text-lg md:text-xl mb-1">{exp.title}</h3>
                <p className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground mb-4">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{exp.company}</span>
                </p>
                <ul className="space-y-2">
                  {exp.points.map((point, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + j * 0.06 }}
                      className="flex gap-2 text-xs md:text-sm text-muted-foreground"
                    >
                      <ArrowRight className="w-3 h-3 text-accent mt-1 shrink-0" />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
