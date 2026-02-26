import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";

const projects = [
  {
    title: "CartUp",
    subtitle: "E-commerce Platform",
    problem: "Complex e-commerce requirements needed clear documentation and stakeholder alignment.",
    solution: "Prepared comprehensive SRS, CR, and user stories for CartUp platform development.",
    impact: "Enhanced development efficiency and improved documentation accuracy for e-commerce features.",
    tags: ["SRS", "CR", "E-commerce", "User Stories"],
  },
  {
    title: "ERP, Payroll & HRIS",
    subtitle: "Enterprise Software",
    problem: "Multiple enterprise systems required integrated analysis and documentation.",
    solution: "Comprehensive analysis and documentation for ERP, Payroll, and HRIS solutions.",
    impact: "On-time delivery and reduced documentation rework by 25%.",
    tags: ["ERP", "HRIS", "Process Flows", "Documentation"],
  },
  {
    title: "Foodi",
    subtitle: "Food Delivery Platform",
    problem: "Food delivery platform needed process optimization and requirement analysis.",
    solution: "Assisted in requirement gathering and process analysis for food delivery workflows.",
    impact: "Improved workflow clarity and supported smooth solution adoption.",
    tags: ["Process Analysis", "Documentation", "Food Delivery"],
  },
  {
    title: "Meditrip",
    subtitle: "Medical Travel & Accommodation",
    problem: "Complex medical travel platform required detailed requirement documentation.",
    solution: "Supported requirement analysis for medical travel and accommodation features.",
    impact: "Enhanced understanding of travel/accommodation platform requirements.",
    tags: ["Travel Platform", "Requirement Analysis"],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="section-padding bg-secondary/30 relative overflow-hidden">
      <BABackground density="light" />
      <div className="container mx-auto relative z-10">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Portfolio</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Featured Projects</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-5xl mx-auto">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 md:p-8 hover-glow group cursor-default h-full relative overflow-hidden"
              >
                <FileText className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 text-primary/[0.04]" />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg md:text-xl group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-accent font-medium">{project.subtitle}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Challenge</span>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{project.problem}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Solution</span>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{project.solution}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Impact</span>
                    <p className="text-xs md:text-sm text-foreground font-medium mt-1">{project.impact}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-primary/10 text-[10px] md:text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
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

export default Projects;
