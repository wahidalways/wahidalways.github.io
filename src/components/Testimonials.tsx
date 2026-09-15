import { SectionHeader } from "./ui/typography";

const testimonials = [
  {
    quote: "Nayem's ability to translate complex business requirements into clear, actionable specifications is exceptional. His documentation quality significantly reduced our development rework.",
    name: "Team Lead",
    role: "TechnoNext Software Limited",
  },
  {
    quote: "Working with Nayem on the HRIS project was a great experience. He ensured every stakeholder was aligned and the deliverables were always on time and well-documented.",
    name: "Project Manager",
    role: "TechnoNext Software Limited",
  },
  {
    quote: "His process automation initiatives saved us countless hours of manual work. Nayem brings both analytical rigor and a collaborative spirit to every project.",
    name: "Senior Developer",
    role: "TechnoNext Software Limited",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

const Testimonials = () => {
  return (
    <section id="testimonials" className="band-ink relative bg-background text-foreground">
      <div className="shell pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionHeader index="07" eyebrow="Testimonials" title={["What People", { tone: "Say" }]} />

        <div className="grid md:grid-cols-3 border-t border-foreground/15">
          {testimonials.map((item, i) => (
            <figure
              key={item.name}
              data-reveal
              className={`flex flex-col justify-between gap-10 border-b border-border py-10 md:py-12 md:border-b-0
                ${i > 0 ? "md:border-l md:pl-8 lg:pl-10" : ""} ${i < testimonials.length - 1 ? "md:pr-8 lg:pr-10" : ""}`}
            >
              <div>
                <span aria-hidden="true" className="block font-display text-8xl leading-[0.55] text-accent-ink">
                  &ldquo;
                </span>
                <blockquote className="mt-6 font-display text-[1.3rem] md:text-[1.35rem] lg:text-[1.55rem] leading-[1.32] tracking-[-0.02em] text-pretty">
                  {item.quote}
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid place-items-center w-10 h-10 rounded-full bg-foreground text-background font-mono text-[11px] font-medium"
                >
                  {initials(item.name)}
                </span>
                <span>
                  <span className="block text-[15px] text-foreground">{item.name}</span>
                  <span className="label mt-1 block normal-case tracking-normal text-[12px]">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
