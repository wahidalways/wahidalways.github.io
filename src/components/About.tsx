import { SectionHeader, ScrubText } from "./ui/typography";

// Moved out of the hero, which was carrying too much text for a first view.
const facts = [
  { term: "Currently at", value: "US Bangla Airlines", note: "since Aug 2026" },
  { term: "Based in", value: "Dhaka, Bangladesh", note: "23.81° N, 90.41° E" },
  { term: "Status", value: "Open to conversations", status: true },
];

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

          <p
            data-reveal
            className="col-span-12 md:col-start-4 md:col-span-9 mt-10 md:mt-14 max-w-2xl text-base md:text-[17px] leading-relaxed text-muted-foreground text-pretty"
          >
            I leverage AI-powered tools to speed up requirement analysis and documentation, without losing the
            precision a spec needs to go from discovery to stakeholder sign-off.
          </p>

          <dl className="col-span-12 md:col-start-4 md:col-span-9 mt-10 md:mt-14 grid grid-cols-3 gap-x-6 gap-y-6 border-t border-foreground/15 pt-8">
            {facts.map((item) => (
              <div key={item.term} data-reveal>
                <dt className="label text-muted-foreground">{item.term}</dt>
                <dd className="mt-1.5 flex items-center gap-2 text-[15px] leading-snug text-foreground">
                  {item.status && <span aria-hidden="true" className="status-dot shrink-0" />}
                  <span>
                    {item.value}
                    {item.note && <span className="block font-mono text-[11px] text-muted-foreground mt-0.5">{item.note}</span>}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default About;
