import { Target, Users, FileText, TrendingUp } from "lucide-react";
import { SectionHeader, ScrubText } from "./ui/typography";

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

const pad = (n: number) => String(n).padStart(2, "0");

const About = () => {
  return (
    <section id="about" className="relative">
      <div className="shell pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionHeader index="01" eyebrow="About Me" title={["Professional", { tone: "Summary" }]} />

        {/* The summary: its opening sentence as the statement, the rest as body. */}
        <div className="grid grid-cols-12 gap-x-6">
          <p
            data-scrub
            className="col-span-12 md:col-start-4 md:col-span-9 font-display text-[clamp(1.75rem,3.7vw,3.5rem)] leading-[1.06] tracking-[-0.035em] text-balance"
          >
            <ScrubText text="Technical Business Analyst with 2.5+ years of experience in requirements engineering, business analysis, and solution delivery." />
          </p>

          <div className="col-span-12 md:col-start-4 md:col-span-9 mt-10 md:mt-14 grid md:grid-cols-2 gap-6 md:gap-10 text-base md:text-[17px] leading-relaxed text-muted-foreground text-pretty">
            <p data-reveal>
              I leverage AI-powered tools and techniques to enhance requirement analysis, documentation quality, and
              process optimization.
            </p>
            <p data-reveal>
              Skilled in stakeholder management, business process analysis, and creating functional documentation and
              Change Requests — adept at translating business needs into clear, actionable solutions that drive
              operational efficiency and business value.
            </p>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-24 md:mt-36">
          <div className="flex items-end justify-between gap-6 pb-5">
            <h3 className="label text-foreground">Core capabilities</h3>
            <span aria-hidden="true" className="label">C.01 — C.04</span>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-foreground/15">
            {highlights.map((item, i) => (
              <li
                key={item.label}
                data-reveal
                className={`group relative flex min-h-[15rem] md:min-h-[18rem] flex-col justify-between gap-10 border-b border-border p-6 md:p-7 transition-colors duration-500 ease-out-expo hover:bg-foreground hover:text-background
                  ${i % 2 === 0 ? "sm:border-r" : ""} lg:border-r ${i === 3 ? "lg:border-r-0" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <item.icon aria-hidden="true" className="w-6 h-6 transition-transform duration-500 ease-out-expo group-hover:scale-110" strokeWidth={1.5} />
                  <span aria-hidden="true" className="font-mono text-[12px] md:text-[11px] text-muted-foreground group-hover:text-background/60">
                    C.{pad(i + 1)}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-xl md:text-2xl tracking-[-0.025em] leading-tight">{item.label}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-hover:text-background/70 transition-colors duration-500 text-pretty">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Domains */}
        <div className="mt-20 md:mt-28 grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-3">
            <h3 className="label text-foreground">Domain Expertise</h3>
            <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
              Sectors I have written requirements for, from discovery through sign-off.
            </p>
          </div>
          {/* A compact two-column register: six sectors read at a glance instead of filling a screen. */}
          <ul className="col-span-12 md:col-span-9 grid sm:grid-cols-2 gap-x-6 border-t border-foreground/15">
            {domains.map((d, i) => (
              <li
                key={d}
                data-reveal
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline border-b border-border py-4 md:py-5"
              >
                <span aria-hidden="true" className="font-mono text-[12px] md:text-[11px] text-muted-foreground">
                  {pad(i + 1)}
                </span>
                <span className="font-display text-xl md:text-2xl leading-tight tracking-[-0.025em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  {d}
                </span>
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-accent scale-0 transition-transform duration-500 ease-out-expo group-hover:scale-100"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
