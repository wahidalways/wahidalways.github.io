import { SectionHeader } from "./ui/typography";

const education = [
  { degree: "Master of Business Administration (Professional)", institution: "Bangladesh University of Professionals (BUP)", year: "Sep 2025 – Ongoing", gpa: "N/A" },
  { degree: "B.Sc. in Software Engineering (Major: Data Science)", institution: "Daffodil International University", year: "Jan 2020 – Feb 2024", gpa: "3.73 / 4.00" },
  { degree: "HSC", institution: "Cumilla Shikkha Board Govt. Model College", year: "2017 – 2019", gpa: "4.75 / 5.00" },
  { degree: "SSC", institution: "A. Malek Institution", year: "2012 – 2017", gpa: "5.00 / 5.00" },
];

/* An academic record, set as a table: period, qualification, institution, result. */
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
          <span className="label col-span-5">Qualification</span>
          <span className="label col-span-3">Institution</span>
          <span className="label col-span-2 text-right">Result</span>
        </div>

        <ol className="border-t border-foreground lg:border-t-0">
          {education.map((edu) => (
            <li
              key={edu.degree}
              data-reveal
              className="group grid grid-cols-2 lg:grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-border py-7 md:py-9"
            >
              <p className="order-1 col-span-1 lg:col-span-2 font-mono text-[13px] text-foreground">{edu.year}</p>
              <h3 className="order-3 lg:order-2 col-span-2 lg:col-span-5 font-display text-2xl md:text-[2rem] leading-[1.1] tracking-[-0.03em] text-balance transition-transform duration-500 ease-out-expo lg:group-hover:translate-x-2">
                {edu.degree}
              </h3>
              <p className="order-4 lg:order-3 col-span-2 lg:col-span-3 text-[15px] text-muted-foreground">{edu.institution}</p>
              <p className="order-2 lg:order-4 col-span-1 lg:col-span-2 text-right font-mono text-[13px]">
                {edu.gpa !== "N/A" ? (
                  <>
                    <span className="text-muted-foreground">CGPA </span>
                    <span className="text-foreground">{edu.gpa}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">In progress</span>
                )}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Education;
