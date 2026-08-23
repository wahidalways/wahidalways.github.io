import { useState } from "react";
import { m } from "framer-motion";
import { Mail, MapPin, Linkedin, Twitter, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";

const EMAIL = "nayemwahid05@gmail.com";

/*
 * Set VITE_CONTACT_ENDPOINT to a form backend (Formspree, Web3Forms, Basin —
 * anything that accepts a JSON POST) and the form submits in place. Leave it
 * unset and it falls back to handing the message to the visitor's mail client.
 *
 * The fallback is genuinely worse: it does nothing at all for someone using
 * webmail with no registered mailto handler, and it leaves no record on your
 * side of who tried to reach you. Treat it as a stopgap, not the destination.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

type Status = "idle" | "sending";

const Contact = () => {
  const [status, setStatus] = useState<Status>("idle");

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
      // Every interpolated value is encoded. The original encoded only the body,
      // so a name containing & or # silently truncated the whole message.
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      toast("Opening your email app…", {
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

  const fieldClass =
    "w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <section id="contact" className="section-padding bg-secondary/30 relative overflow-hidden">
      <BABackground density="light" />
      <div className="container mx-auto relative z-10">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Contact</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Let's Connect</h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm md:text-base">
            Interested in collaborating or have a project in mind? I'd love to hear from you.
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ScrollReveal direction="left" delay={0.1} className="space-y-4 md:space-y-6">
            <m.a whileHover={{ y: -3 }} href={`mailto:${EMAIL}`} className="flex items-center gap-3 md:gap-4 glass rounded-xl p-4 md:p-5 hover-glow block">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail aria-hidden="true" className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-xs md:text-sm truncate">{EMAIL}</p>
              </div>
            </m.a>

            <div className="flex items-center gap-3 md:gap-4 glass rounded-xl p-4 md:p-5">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin aria-hidden="true" className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Location</p>
                <p className="font-medium text-xs md:text-sm">Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4">
              <m.a
                whileHover={{ y: -3 }}
                href="https://linkedin.com/in/nayemwahid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 glass rounded-xl p-3 md:p-4 hover-glow text-xs md:text-sm font-medium"
              >
                <Linkedin aria-hidden="true" className="w-4 h-4 text-primary" /> LinkedIn
              </m.a>
              <m.a
                whileHover={{ y: -3 }}
                href="https://twitter.com/mrbrainaxes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 glass rounded-xl p-3 md:p-4 hover-glow text-xs md:text-sm font-medium"
              >
                <Twitter aria-hidden="true" className="w-4 h-4 text-primary" /> X (Twitter)
              </m.a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <form className="glass rounded-2xl p-6 md:p-8 space-y-4 md:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="text-xs md:text-sm font-medium mb-1.5 block">Name</label>
                <input id="name" name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="text-xs md:text-sm font-medium mb-1.5 block">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="text-xs md:text-sm font-medium mb-1.5 block">Message</label>
                <textarea id="message" name="message" required rows={4} className={`${fieldClass} resize-none`} placeholder="Tell me about your project..." />
              </div>
              <m.button
                whileHover={status === "idle" ? { y: -2 } : undefined}
                whileTap={status === "idle" ? { y: 0 } : undefined}
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-heading font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 aria-hidden="true" className="w-4 h-4 anim-loop anim-spin" style={{ "--dur": "1s" } as React.CSSProperties} />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send aria-hidden="true" className="w-4 h-4" /> Send Message
                  </>
                )}
              </m.button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
