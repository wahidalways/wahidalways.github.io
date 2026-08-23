import { m } from "framer-motion";
import { Building2, Calendar, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";

const experiences = [
  {
    title: "Business Analyst",
    company: "US Bangla Airlines",
    duration: "Aug 2026 – Present",
    points: [
      "Owning end-to-end requirement lifecycles, from elicitation and gap analysis through to UAT coordination and change management.",
      "Engaging stakeholders across business and technical teams to agree scope, priorities and delivery expectations.",
      "Managing and refining the backlog to support Agile sprint planning and predictable end-to-end delivery.",
      "Designing workflows, process diagrams and UI prototypes with AI-powered tools to accelerate analysis and solution visualization.",
    ],
  },
  {
    title: "Business Analyst",
    company: "TechnoNext Software Limited",
    duration: "Dec 2025 – Jul 2026",
    points: [
      "Led HRIS development and system optimization initiatives to improve workforce management, HR operations, data integrity, and reporting accuracy within an Agile environment.",
      "Performed business requirement, gap and impact analysis to define effective solutions and improvement opportunities.",
      "Translated business needs into BRD, SRS, PRD, and functional specifications to ensure alignment across business and technical teams.",
      "Managed end-to-end SDLC activities including workflow design, prototyping, UAT coordination, and change management.",
      "Collaborated with development, QA, UI/UX, and operations teams in Agile sprint cycles to ensure smooth delivery and stakeholder alignment.",
    ],
  },
  {
    title: "Junior Business Analyst",
    company: "TechnoNext Software Limited",
    duration: "Jun 2024 – Nov 2025",
    points: [
      "Collaborated with stakeholders to gather requirements, perform gap analysis, and support solution design to improve clarity and reduce rework.",
      "Prepared SRS, change requests, and process flow diagrams to support development and ensure accurate documentation.",
      "Supported UAT execution, vendor coordination, and end-user training to ensure smooth delivery and adoption of solutions.",
      "Worked closely with development, QA, UI/UX, and operations teams to ensure alignment across SDLC phases.",
    ],
  },
  {
    title: "Intern Business Analyst",
    company: "TechnoNext Software Limited",
    duration: "Feb 2024 – May 2024",
    points: [
      "Assisted in requirement gathering and process analysis for food delivery and medical travel systems.",
      "Contributed to SRS, change requests, and process flow documentation to improve clarity and support development.",
      "Supported UAT execution and end-user training to ensure smooth validation and adoption of solutions.",
      "Collaborated with cross-functional teams across SDLC to support end-to-end delivery activities.",
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
          <m.div
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
                className="absolute top-0 left-[15px] md:left-auto hidden md:block"
                style={i % 2 === 0 ? { right: "-7px" } : { left: "-7px" }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full bg-primary shadow-md anim-loop anim-pulse-scale"
                  style={{ "--dur": "2.5s", "--delay": `${i * 0.5}s` } as React.CSSProperties}
                />
              </div>

              <m.div
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
                    <m.li
                      key={j}
                      initial={{ opacity: 0, x: -5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + j * 0.06 }}
                      className="flex gap-2 text-xs md:text-sm text-muted-foreground"
                    >
                      <ArrowRight className="w-3 h-3 text-accent mt-1 shrink-0" />
                      {point}
                    </m.li>
                  ))}
                </ul>
              </m.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
