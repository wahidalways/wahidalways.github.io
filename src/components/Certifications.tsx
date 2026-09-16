import { Trophy, Award, Globe, Users } from "lucide-react";
import { SectionHeader } from "./ui/typography";

const certifications = [
  { title: "NASA Space Apps Challenge", subtitle: "Global Finalist", year: "2023", icon: Globe, highlight: true },
  { title: "NASA Space Apps Challenge", subtitle: "Regional Champion & Global Nominee", year: "2022", icon: Trophy, highlight: true },
  { title: "USAID Youth Social Leadership Program", subtitle: "Certificate of Completion", year: "2020", icon: Users, highlight: false },
  { title: "HRDI Conflict Management & Charismatic Feedback", subtitle: "Professional Certificate", year: "2020", icon: Award, highlight: false },
];

/*
 * The two NASA results are the headline, so they get the room: large panels
 * led by the result itself (what was achieved) with the programme and year
 * beneath. The two certificates follow as ruled entries.
 */
const Certifications = () => {
  const featured = certifications.filter((c) => c.highlight);
  const others = certifications.filter((c) => !c.highlight);

  return (
    <section id="certifications" className="relative">
      <div className="shell pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionHeader index="06" eyebrow="Recognition" title={["Certifications &", { tone: "Awards" }]} />

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {featured.map((cert) => (
            <article
              key={cert.title + cert.year}
              data-reveal
              className="group relative flex min-h-[18rem] md:min-h-[24rem] flex-col justify-between gap-10 overflow-hidden rounded-[10px] border border-border bg-card p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-2.5 py-1 font-mono text-[12px] md:text-[10px] font-medium uppercase tracking-label text-accent-foreground">
                  Featured
                </span>
                <cert.icon aria-hidden="true" className="w-7 h-7 transition-transform duration-700 ease-out-expo group-hover:rotate-12" strokeWidth={1.25} />
              </div>

              <div>
                <p className="display text-[2.6rem] sm:text-5xl lg:text-[4rem] leading-[0.95] text-balance">
                  {cert.subtitle}
                  <span aria-hidden="true" className="inline-block h-[0.16em] w-[0.16em] ml-[0.06em] bg-accent" />
                </p>
                <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-border pt-5">
                  <h3 className="font-display text-xl md:text-2xl tracking-[-0.03em] leading-tight">{cert.title}</h3>
                  <span className="shrink-0 font-mono text-[13px] tabular-nums text-muted-foreground">{cert.year}</span>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[2px] bg-accent origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
            </article>
          ))}
        </div>

        <ul className="mt-10 md:mt-14 border-t border-foreground/15">
          {others.map((cert) => (
            <li
              key={cert.title + cert.year}
              data-reveal
              className="group grid grid-cols-12 items-baseline gap-x-6 gap-y-2 border-b border-border py-6 md:py-8"
            >
              <span className="col-span-3 md:col-span-2 font-mono text-[13px] text-foreground">{cert.year}</span>
              <div className="col-span-9 md:col-span-6 flex items-baseline gap-3">
                <cert.icon aria-hidden="true" className="w-4 h-4 shrink-0 translate-y-0.5 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="font-display text-xl md:text-2xl tracking-[-0.025em] leading-tight transition-transform duration-500 ease-out-expo md:group-hover:translate-x-2">
                  {cert.title}
                </h3>
              </div>
              <p className="col-span-9 col-start-4 md:col-start-auto md:col-span-4 md:text-right text-[15px] text-muted-foreground">
                {cert.subtitle}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Certifications;
