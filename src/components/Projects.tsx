import { useRef } from "react";
import { gsap, ScrollTrigger, ensureGsap, useIsoLayoutEffect } from "@/lib/gsap";
import { SectionHeader } from "./ui/typography";
import CaseSchematic, { type SchematicKind } from "./CaseSchematic";

const projects: {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  impact: string;
  tags: string[];
  schematic: SchematicKind;
}[] = [
  {
    title: "CartUp",
    subtitle: "E-commerce Platform",
    problem: "Complex e-commerce requirements needed clear documentation and stakeholder alignment.",
    solution: "Prepared comprehensive SRS, CR, and user stories for CartUp platform development.",
    impact: "Enhanced development efficiency and improved documentation accuracy for e-commerce features.",
    tags: ["SRS", "CR", "E-commerce", "User Stories"],
    schematic: "funnel",
  },
  {
    title: "HRIS, Payroll & ATS",
    subtitle: "Workforce Management Systems",
    problem: "Workforce management needed integrated analysis across HR operations, payroll and hiring.",
    solution: "Led requirement, gap and impact analysis and produced BRD, SRS and PRD documentation in Agile sprints.",
    impact: "Improved data integrity and reporting accuracy across HR operations.",
    tags: ["HRIS", "Payroll", "ATS", "BRD / SRS / PRD"],
    schematic: "tree",
  },
  {
    title: "Foodi",
    subtitle: "Food Delivery Platform",
    problem: "Food delivery platform needed process optimization and requirement analysis.",
    solution: "Assisted in requirement gathering and process analysis for food delivery workflows.",
    impact: "Improved workflow clarity and supported smooth solution adoption.",
    tags: ["Process Analysis", "Documentation", "Food Delivery"],
    schematic: "route",
  },
  {
    title: "Meditrip",
    subtitle: "Healthcare & Medical Travel",
    problem: "Complex medical travel platform required detailed requirement documentation.",
    solution: "Supported requirement analysis for medical travel and accommodation features.",
    impact: "Enhanced understanding of travel/accommodation platform requirements.",
    tags: ["Travel Platform", "Requirement Analysis"],
    schematic: "journey",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

// Wide and tall enough that a pinned strip of cards is comfortable to read.
const HORIZONTAL_QUERY = "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/*
 * On a large screen with motion allowed, the section pins and the case files
 * travel sideways as you scroll — reading four studies becomes one continuous
 * gesture instead of a wall of cards. Everywhere else it is a plain grid. The
 * horizontal layout is opt-in via a class GSAP adds, so a failed script leaves
 * the readable grid, never a strip of cards scrolled out of reach.
 */
const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;
    ensureGsap();

    const mm = gsap.matchMedia();
    mm.add(HORIZONTAL_QUERY, () => {
      section.classList.add("is-horizontal");
      const viewport = track.parentElement as HTMLElement;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      // The counter's text is replaced only when the case number changes.
      // Rewriting it every frame swapped its text node each time and forced
      // layout on every scroll frame of the pinned section.
      let shownIndex = 1;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (self) => {
            const idx = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1);
            if (idx !== shownIndex && counterRef.current) {
              shownIndex = idx;
              counterRef.current.textContent = pad(idx);
            }
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      ScrollTrigger.refresh();
      return () => section.classList.remove("is-horizontal");
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="cases band-ink relative bg-background text-foreground overflow-x-clip">
      <div className="shell pt-20 md:pt-28">
        <SectionHeader
          index="04"
          eyebrow="Portfolio"
          title={["Featured", { tone: "Projects" }]}
          lede="Four case files. Each one starts with a problem statement and ends with what changed."
          className="!pb-10 md:!pb-14"
        />
      </div>

      <div ref={pinRef} className="cases-pin">
        <div className="shell w-full">
          <div className="cases-progress mb-6 items-center gap-6">
            <span className="label text-foreground whitespace-nowrap">
              Case <span ref={counterRef}>01</span> / {pad(projects.length)}
            </span>
            <span aria-hidden="true" className="relative h-px flex-1 bg-border overflow-hidden">
              <span ref={barRef} className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
            </span>
            <span className="label whitespace-nowrap">Scroll</span>
          </div>

          <div className="cases-viewport">
            <div ref={trackRef} className="cases-track grid lg:grid-cols-2 gap-5 md:gap-6">
              {projects.map((project, i) => (
                <article
                  key={project.title}
                  data-reveal
                  className="case-card group relative flex flex-col overflow-hidden rounded-[10px] border border-border bg-card"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-border px-5 md:px-7 py-3.5">
                    <span className="label text-foreground">CF-{pad(i + 1)}</span>
                    <span className="label text-right">{project.subtitle}</span>
                  </div>

                  <div className="case-body grid flex-1 gap-8 md:gap-10 p-5 md:p-7">
                    <div className="flex flex-col justify-between gap-8">
                      <div>
                        <h3 className="display text-[2.6rem] sm:text-6xl xl:text-7xl leading-[0.9] text-balance">
                          {project.title}
                        </h3>
                        <ul aria-label="Tags" className="mt-5 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-border px-2.5 py-1 font-mono text-[12px] md:text-[10px] uppercase tracking-label text-muted-foreground"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="max-w-md pt-2">
                        <CaseSchematic kind={project.schematic} />
                      </div>
                    </div>

                    <dl className="flex flex-col">
                      {[
                        { k: "Challenge", v: project.problem },
                        { k: "Solution", v: project.solution },
                        { k: "Impact", v: project.impact, strong: true },
                      ].map((row) => (
                        <div key={row.k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-border py-4 md:py-5">
                          <dt className={`label flex items-center gap-2 h-fit ${row.strong ? "text-foreground" : ""}`}>
                            {row.strong && <span aria-hidden="true" className="w-1.5 h-1.5 bg-accent" />}
                            {row.k}
                          </dt>
                          <dd
                            className={`text-[15px] leading-relaxed text-pretty ${
                              row.strong ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {row.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-accent origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 md:h-28" />
    </section>
  );
};

export default Projects;
