import { m } from "framer-motion";
import { FileText } from "lucide-react";
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
    title: "HRIS, Payroll & ATS",
    subtitle: "Workforce Management Systems",
    problem: "Workforce management needed integrated analysis across HR operations, payroll and hiring.",
    solution: "Led requirement, gap and impact analysis and produced BRD, SRS and PRD documentation in Agile sprints.",
    impact: "Improved data integrity and reporting accuracy across HR operations.",
    tags: ["HRIS", "Payroll", "ATS", "BRD / SRS / PRD"],
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
    subtitle: "Healthcare & Medical Travel",
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
              <m.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 md:p-8 hover-glow group cursor-default h-full relative overflow-hidden"
              >
                <FileText aria-hidden="true" className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 text-primary/[0.04]" />
                <div className="mb-4">
                  <h3 className="font-heading font-bold text-lg md:text-xl group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm text-accent font-medium">{project.subtitle}</p>
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
              </m.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
