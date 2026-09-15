import { Building2 } from "lucide-react";
import { SectionHeader } from "./ui/typography";

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

const pad = (n: number) => String(n).padStart(2, "0");

/*
 * A career record in three columns — when, what, and the detail — with each
 * responsibility numbered as a sub-clause of its role (4.1, 4.2 …). The date
 * column holds its place while a long role scrolls past on wide screens.
 */
const Experience = () => {
  return (
    <section id="experience" className="relative">
      <div className="shell pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionHeader
          index="03"
          eyebrow="Career"
          title={["Work", { tone: "Experience" }]}
          lede="Four analyst roles, each one closer to the systems a business actually runs on."
        />

        <ol className="border-t border-foreground/15">
          {experiences.map((exp, i) => {
            const n = experiences.length - i;
            const current = i === 0;
            return (
              <li
                key={exp.title + exp.duration}
                data-reveal
                className="grid grid-cols-12 gap-x-6 gap-y-6 border-b border-border py-10 md:py-16"
              >
                {/* Tablets share the section header's 3 / 9 grid; wide screens add a third column. */}
                <div className="col-span-12 md:col-span-3">
                  <div className="md:sticky md:top-24 flex flex-wrap md:flex-col items-center md:items-start gap-x-4 gap-y-3">
                    <span aria-hidden="true" className="font-mono text-[12px] md:text-[11px] text-muted-foreground">
                      R.{pad(n)}
                    </span>
                    <p className="font-mono text-[13px] text-foreground">{exp.duration}</p>
                    {current && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-2.5 py-1 label text-foreground">
                        <span aria-hidden="true" className="status-dot" />
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-9 lg:col-span-4">
                  <h3 className="display text-[2.1rem] sm:text-5xl lg:text-[3.25rem] leading-[0.95]">{exp.title}</h3>
                  <p className="mt-4 flex items-center gap-2 text-[15px] text-muted-foreground">
                    <Building2 aria-hidden="true" className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>{exp.company}</span>
                  </p>
                </div>

                <ul className="col-span-12 md:col-start-4 md:col-span-9 lg:col-start-auto lg:col-span-5 space-y-4">
                  {exp.points.map((point, j) => (
                    <li
                      key={j}
                      className="grid grid-cols-[2.5rem_1fr] gap-2 text-[15px] leading-relaxed text-muted-foreground text-pretty"
                    >
                      <span aria-hidden="true" className="font-mono text-[12px] md:text-[11px] text-foreground/70 pt-[5px]">
                        {n}.{j + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
