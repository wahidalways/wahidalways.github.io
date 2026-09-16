// Figures are drawn from the CV (2.5+ years in the profile, six entries under
// Domain Knowledge, four entries under Certifications & Awards) except the role
// count, which includes the US Bangla Airlines role that post-dates the CV.
// Each carries a one-line note, so a modest figure reads as evidence rather
// than as a number set large for its own sake.
const stats = [
  { value: "2.5", suffix: "+", label: "Years Experience", note: "In business analysis since Feb 2024" },
  { value: "6", suffix: "", label: "Domains Covered", note: "HRIS, payroll, ATS, e-commerce, logistics, healthcare" },
  { value: "4", suffix: "", label: "Analyst Roles Held", note: "From intern to Business Analyst at US Bangla Airlines" },
  { value: "4", suffix: "", label: "Awards & Certifications", note: "Including NASA Space Apps Global Finalist, 2023" },
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

/*
 * The figures render as their real values. page-motion counts them up from zero
 * when motion is allowed and writes the true value back if it is torn down, so
 * a visitor with reduced motion (or no JavaScript) reads the right number.
 */
const Stats = () => {
  return (
    <section aria-label="Career in numbers" className="band-ink bg-background text-foreground">
      <div className="shell">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col py-8 md:py-10 border-border
                ${i % 2 === 0 ? "border-r pr-5" : "pl-5"}
                ${i < 2 ? "border-b md:border-b-0" : ""}
                md:px-5 lg:px-8 md:first:pl-0 md:last:pr-0 ${i < 3 ? "md:border-r" : "md:border-r-0"}`}
            >
              {/* Two label lines reserved, so figures line up across a row even where one label wraps. */}
              <dt className="flex min-h-[27px] items-start justify-between gap-3">
                <span className="label text-balance">{stat.label}</span>
                <span aria-hidden="true" className="font-mono text-[12px] md:text-[11px] text-muted-foreground">
                  0{i + 1}
                </span>
              </dt>
              {/* Both dd's stay direct children of the group: a wrapper div here is invalid dl markup. */}
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

        {/* Domains: one more line of the same band, not a second section. */}
        <div className="border-t border-border pt-8 md:pt-10 pb-10 md:pb-14">
          <span className="label text-muted-foreground">Domain Expertise</span>
          <ul className="mt-5 grid sm:grid-cols-2 gap-x-6">
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

export default Stats;
