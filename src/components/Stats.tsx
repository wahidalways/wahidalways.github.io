// Figures are drawn from the CV — 2.5+ years in the profile, six entries under
// Domain Knowledge, four entries under Certifications & Awards — except the role
// count, which includes the US Bangla Airlines role that post-dates the CV.
// Each carries a one-line note, so a modest figure reads as evidence rather
// than as a number set large for its own sake.
const stats = [
  { value: "2.5", suffix: "+", label: "Years Experience", note: "In business analysis since Feb 2024" },
  { value: "6", suffix: "", label: "Domains Covered", note: "HRIS, payroll, ATS, e-commerce, logistics, healthcare" },
  { value: "4", suffix: "", label: "Analyst Roles Held", note: "From intern to Business Analyst at US Bangla Airlines" },
  { value: "4", suffix: "", label: "Awards & Certifications", note: "Including NASA Space Apps Global Finalist, 2023" },
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
              className={`flex flex-col py-8 md:py-10 border-border
                ${i % 2 === 0 ? "border-r pr-5 md:pr-8" : "pl-5 md:pl-8"}
                ${i < 2 ? "border-b lg:border-b-0" : ""}
                lg:px-8 lg:first:pl-0 lg:last:pr-0 ${i < 3 ? "lg:border-r" : "lg:border-r-0"}`}
            >
              {/* Two label lines reserved, so figures line up across a row even where one label wraps. */}
              <dt className="flex min-h-[27px] items-start justify-between gap-3">
                <span className="label text-balance">{stat.label}</span>
                <span aria-hidden="true" className="font-mono text-[12px] md:text-[11px] text-muted-foreground">
                  0{i + 1}
                </span>
              </dt>
              {/* Both dd's stay direct children of the group — a wrapper div here is invalid dl markup. */}
              <dd className="pt-6 md:pt-8 display tabular-nums text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.85]">
                <span data-counter={stat.value}>{stat.value}</span>
                {stat.suffix && <span className="text-accent-ink">{stat.suffix}</span>}
              </dd>
              <dd className="mt-3 max-w-[26ch] text-[13px] leading-snug text-muted-foreground text-pretty">
                {stat.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Stats;
