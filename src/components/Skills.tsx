import { Database, Workflow, ClipboardCheck } from "lucide-react";
import { SectionHeader } from "./ui/typography";

const skillCategories = [
  {
    title: "Business Analysis",
    icon: ClipboardCheck,
    skills: [
      "Requirements Gathering & Analysis",
      "Business Process Analysis",
      "BRD, SRS, FRD, CR Documentation",
      "Gap & Impact Analysis",
      "Stakeholder Engagement & Communication",
      "Wireframing & UI Prototyping",
    ],
  },
  {
    title: "Technical & Tools",
    icon: Database,
    skills: [
      "Microsoft Word / Google Docs",
      "Microsoft Excel / Google Sheet",
      "Draw.io / Lucidchart / Adobe XD",
      "Redmine / PMS / Trello",
      "SQL",
      "HTML & CSS",
    ],
  },
  {
    title: "Methodologies & Core Competencies",
    icon: Workflow,
    skills: [
      "Software Development Life Cycle (SDLC)",
      "Agile & Scrum Methodology",
      "Problem Solving & Analytical Thinking",
      "Documentation & Requirement Translation",
      "Cross-functional Collaboration",
      "Adaptability in Fast-paced Agile Environments",
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="relative">
      <div className="shell pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionHeader
          eyebrow="Skills"
          title={["Skills &", { tone: "Expertise" }]}
          lede="The methods, tools and competencies I use day to day."
        />

        <div className="grid md:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-16">
          {skillCategories.map((cat) => (
            <div key={cat.title} data-reveal>
              {/* Reserved at two lines, so a wrapping title (Methodologies & Core
                  Competencies) still closes its rule at the same height as the
                  single-line ones, and every column's list starts level. */}
              <div className="flex items-start gap-3 border-b border-foreground pb-5 min-h-[4.6rem] lg:min-h-[5.1rem]">
                <cat.icon aria-hidden="true" className="mt-1 w-5 h-5 shrink-0" strokeWidth={1.5} />
                <h3 className="font-display text-2xl lg:text-[1.75rem] leading-[1.1] tracking-[-0.03em] text-balance">
                  {cat.title}
                </h3>
              </div>
              <ul>
                {cat.skills.map((skill) => (
                  <li key={skill} className="group border-b border-border py-3.5 md:py-4">
                    <span className="block text-[15px] leading-snug transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
