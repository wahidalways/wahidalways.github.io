// Figures are drawn from the CV — 2.5+ years in the profile, six entries under
// Domain Knowledge, four entries under Certifications & Awards — except the role
// count, which includes the US Bangla Airlines role that post-dates the CV.
const stats = [
  { value: "2.5", suffix: "+", label: "Years Experience" },
  { value: "6", suffix: "", label: "Domains Covered" },
  { value: "4", suffix: "", label: "Analyst Roles Held" },
  { value: "4", suffix: "", label: "Awards & Certifications" },
];

/*
 * The figures render as their real values. page-motion counts them up from zero
 * when motion is allowed and writes the true value back if it is torn down, so
 * a visitor with reduced motion — or no JavaScript — reads the right number.
 */
const Stats = () => {
  return (
    <section aria-label="Career in numbers" className="band-ink bg-background text-foreground">
      <div className="shell">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-between gap-10 md:gap-16 py-8 md:py-14 border-border
                ${i % 2 === 0 ? "border-r pr-5 md:pr-8" : "pl-5 md:pl-8"}
                ${i < 2 ? "border-b lg:border-b-0" : ""}
                lg:px-8 lg:first:pl-0 lg:last:pr-0 ${i < 3 ? "lg:border-r" : "lg:border-r-0"}`}
            >
              <dt className="flex items-start justify-between gap-3">
                <span className="label text-balance">{stat.label}</span>
                <span aria-hidden="true" className="font-mono text-[11px] text-muted-foreground">
                  0{i + 1}
                </span>
              </dt>
              <dd className="display tabular-nums text-[clamp(3.75rem,10.5vw,9rem)] leading-[0.8]">
                <span data-counter={stat.value}>{stat.value}</span>
                {stat.suffix && <span className="text-accent-ink">{stat.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Stats;
