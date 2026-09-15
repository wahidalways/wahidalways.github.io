import { SectionHeader } from "./ui/typography";

const education = [
  { degree: "Master of Business Administration (Professional)", institution: "Bangladesh University of Professionals (BUP)", year: "Sep 2025 – Ongoing" },
  { degree: "B.Sc. in Software Engineering (Major: Data Science)", institution: "Daffodil International University", year: "Jan 2020 – Feb 2024" },
  { degree: "HSC", institution: "Cumilla Shikkha Board Govt. Model College", year: "2017 – 2019" },
  { degree: "SSC", institution: "A. Malek Institution", year: "2012 – 2017" },
];

/* An academic record, set as a table: period, qualification, institution. */
const Education = () => {
  return (
    <section id="education" className="relative">
      <div className="shell pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionHeader index="05" eyebrow="Education" title={["Academic", { tone: "Background" }]} />

        <div
          aria-hidden="true"
          className="hidden lg:grid grid-cols-12 gap-x-6 border-b border-foreground pb-3"
        >
          <span className="label col-span-2">Period</span>
          <span className="label col-span-6">Qualification</span>
          <span className="label col-span-4">Institution</span>
        </div>

        <ol className="border-t border-foreground lg:border-t-0">
          {education.map((edu) => (
            <li
              key={edu.degree}
              data-reveal
              className="group grid grid-cols-1 lg:grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-border py-7 md:py-9"
            >
              <p className="lg:col-span-2 font-mono text-[13px] text-foreground">{edu.year}</p>
              <h3 className="lg:col-span-6 font-display text-2xl md:text-[2rem] leading-[1.1] tracking-[-0.03em] text-balance transition-transform duration-500 ease-out-expo lg:group-hover:translate-x-2">
                {edu.degree}
              </h3>
              <p className="lg:col-span-4 text-[15px] text-muted-foreground">{edu.institution}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Education;
