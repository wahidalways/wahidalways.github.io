import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "./ui/typography";

const EMAIL = "nayemwahid05@gmail.com";

/*
 * Set VITE_CONTACT_ENDPOINT to a form backend (Formspree, Web3Forms, Basin —
 * anything that accepts a JSON POST) and the form submits in place. Leave it
 * unset and it falls back to handing the message to the visitor's mail client.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

type Status = "idle" | "sending";

const formatDhakaTime = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" }).format(new Date());

/** The visitor's reply-time expectation, answered before they ask. */
const useDhakaTime = () => {
  const [time, setTime] = useState(formatDhakaTime);
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatDhakaTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};

const Contact = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const time = useDhakaTime();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast.success("Email copied", { description: EMAIL });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.info("Copy is blocked here", { description: `Write to ${EMAIL} directly.` });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      toast.error("Please complete every field.");
      return;
    }

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      toast.info("Opening your email app…", {
        description: "No mail app? Write to " + EMAIL + " directly.",
      });
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      form.reset();
      toast.success("Message sent.", { description: "Thanks — I will get back to you shortly." });
    } catch {
      toast.error("That did not go through.", {
        description: `Please email ${EMAIL} directly and I will pick it up.`,
      });
    } finally {
      setStatus("idle");
    }
  };

  const details = [
    { term: "Location", value: "Dhaka, Bangladesh" },
    { term: "Local time", value: `${time} · GMT+6` },
    { term: "LinkedIn", value: "in/nayemwahid", href: "https://linkedin.com/in/nayemwahid", label: "LinkedIn" },
    { term: "X (Twitter)", value: "@mrbrainaxes", href: "https://twitter.com/mrbrainaxes", label: "X (Twitter)" },
  ];

  return (
    <section id="contact" className="relative">
      <div className="shell pt-20 md:pt-28 pb-20 md:pb-28">
        <SectionHeader
          index="08"
          eyebrow="Contact"
          title={["Let's", { tone: "Connect" }]}
          lede="Interested in collaborating or have a project in mind? I'd love to hear from you."
        />

        <div className="grid grid-cols-12 gap-x-6 gap-y-16">
          <div data-reveal className="col-span-12 md:col-span-5">
            <p className="label">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              className="group mt-2 inline-block py-2 font-display text-[clamp(1.5rem,5.4vw,2.6rem)] md:text-[clamp(1.25rem,2.6vw,2.6rem)] leading-tight tracking-[-0.035em] break-all"
            >
              <span className="link-draw">{EMAIL}</span>
            </a>
            <div className="mt-5">
              <button
                type="button"
                onClick={copyEmail}
                className="-my-4 inline-flex items-center gap-2 py-4 label text-foreground hover:text-accent-ink transition-colors cursor-pointer"
              >
                {copied ? <Check aria-hidden="true" className="w-3.5 h-3.5" /> : <Copy aria-hidden="true" className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy address"}
              </button>
            </div>

            <dl className="mt-12 border-t border-foreground/15">
              {details.map((d) => (
                <div key={d.term} className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b border-border py-4">
                  <dt className="label">{d.term}</dt>
                  <dd className="text-[15px]">
                    {d.href ? (
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${d.label} (opens in a new tab)`}
                        className="group -my-3 inline-flex items-center gap-1.5 py-3 hover:text-accent-ink transition-colors"
                      >
                        <span className="link-draw">{d.label}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <form data-reveal onSubmit={handleSubmit} className="col-span-12 md:col-start-7 md:col-span-6">
            <div className="flex items-center justify-between border-b border-foreground pb-3">
              <p className="label text-foreground">Project brief</p>
              <p className="label">All fields required</p>
            </div>

            <div className="mt-8 space-y-9">
              <div>
                <label htmlFor="name" className="label block">
                  01 — Name
                </label>
                <input id="name" name="name" required autoComplete="name" className="field" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="label block">
                  02 — Email
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" className="field" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="label block">
                  03 — Message
                </label>
                <textarea id="message" name="message" required rows={4} className="field resize-none" placeholder="Tell me about your project..." />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn btn-accent mt-10 h-14 w-full sm:w-auto px-8 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? (
                <>
                  <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send Message
                  <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
