import { motion } from "framer-motion";
import { Database, Workflow, ClipboardCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";

const skillCategories = [
  {
    title: "Business Analysis",
    icon: ClipboardCheck,
    skills: ["Requirement Analysis", "SRS, CR, BRD", "Process Flow Diagram", "Gap Analysis", "Stakeholder Engagement", "Vendor Management"],
  },
  {
    title: "Technical Skills",
    icon: Database,
    skills: ["Microsoft Excel / Google Sheet", "Draw.io / Lucidchart / Adobe XD", "Redmine / PMS / Trello", "HTML / CSS (Basic)", "SQL (Basic)"],
  },
  {
    title: "Soft Skills",
    icon: Workflow,
    skills: ["Problem-Solving & Critical Thinking", "Communication & Documentation", "Team Collaboration & Leadership", "Adaptability"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="section-padding bg-secondary/30 relative overflow-hidden">
      <BABackground density="light" />
      <div className="container mx-auto relative z-10">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Skills</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Skills & Expertise</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-5xl mx-auto">
          {skillCategories.map((cat, i) => (
            <ScrollReveal key={cat.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 md:p-8 hover-glow h-full relative overflow-hidden"
              >
                <cat.icon className="absolute -bottom-4 -right-4 w-20 h-20 md:w-24 md:h-24 text-primary/[0.04]" />
                <h3 className="font-heading font-semibold text-lg md:text-xl mb-5 md:mb-6 gradient-text">{cat.title}</h3>
                <div className="flex flex-col gap-3">
                  {cat.skills.map((skill, j) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        whileInView={{ scale: [0, 1.3, 1] }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.06 }}
                        className="w-2 h-2 rounded-full bg-accent shrink-0"
                      />
                      <span className="text-sm text-foreground">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
