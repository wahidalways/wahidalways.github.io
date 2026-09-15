import { ArrowUp, ArrowUpRight } from "lucide-react";
import { SplitText } from "./ui/typography";

const sections = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const elsewhere = [
  { label: "LinkedIn", href: "https://linkedin.com/in/nayemwahid", external: true },
  { label: "X (Twitter)", href: "https://twitter.com/mrbrainaxes", external: true },
  { label: "Email", href: "mailto:nayemwahid05@gmail.com", external: false },
  { label: "CV (PDF)", href: "/Wahiduzzaman_Nayem_CV.pdf", external: true },
];

const Footer = () => {
  return (
    <footer className="band-ink relative overflow-hidden bg-background text-foreground">
      <div className="shell pt-20 md:pt-28">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-6">
            <p className="label">Next step</p>
            <a href="#contact" className="group mt-5 block display text-[clamp(2.5rem,5.2vw,5rem)] leading-[0.95]">
              Start a{" "}
              {/* The arrow belongs to the last word; never let it wrap onto a line alone. */}
              <span className="whitespace-nowrap">
                {/* Highlighted in the signal, like a marker stroke over the invitation. */}
                <span className="bg-accent text-accent-foreground px-[0.06em] box-decoration-clone">conversation</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-2 inline-block align-[-0.06em] w-[0.62em] h-[0.62em] text-accent-ink transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1"
                  strokeWidth={1.25}
                />
              </span>
            </a>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-3">
            <p className="label">Index</p>
            {/* On phones each link gets a full 44px row to tap; on desktop the list tightens up. */}
            <ul className="mt-3 md:mt-5 md:space-y-2.5">
              {sections.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="group inline-flex py-3 md:py-0 text-[15px] text-muted-foreground hover:text-foreground">
                    <span className="link-draw">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-3">
            <p className="label">Elsewhere</p>
            <ul className="mt-3 md:mt-5 md:space-y-2.5">
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex py-3 md:py-0 text-[15px] text-muted-foreground hover:text-foreground"
                  >
                    <span className="link-draw">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The mark, once more, at the scale of the page — proportions match Wordmark. */}
      <div className="shell mt-16 md:mt-24">
        <p
          aria-hidden="true"
          data-split
          className="display select-none whitespace-nowrap font-semibold text-[28vw] xl:text-[25rem] leading-[0.8] tracking-[-0.05em] pb-[0.14em]"
        >
          <SplitText parts={["MWN"]} />
          <span className="split-mask">
            <span className="split-word">
              <span className="inline-block w-[0.21em] h-[0.21em] ml-[0.08em] bg-accent" />
            </span>
          </span>
        </p>
      </div>

      <div className="relative border-t border-border">
        <div className="shell flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6 pb-24 md:pb-6 text-[13px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Md. Wahiduzzaman Nayem. All rights reserved.</p>
          <p>
            Designed & Developed by{" "}
            {/* Padded to a 44px tap target, with the padding cancelled so the line keeps its height. */}
            <a
              href="https://github.com/wahidalways"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit group -my-3 inline-flex items-center gap-1 py-3 text-foreground transition-colors hover:text-accent-ink"
            >
              <span className="link-draw">wahidalways</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only">(GitHub, opens in a new tab)</span>
            </a>
          </p>
          <a href="#" className="-my-3 inline-flex items-center gap-1.5 self-start py-3 text-foreground hover:text-accent-ink transition-colors">
            Back to top
            <ArrowUp aria-hidden="true" className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
