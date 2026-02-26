import { motion } from "framer-motion";
import { Trophy, Award, Globe, Users } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const certifications = [
  { title: "NASA Space Apps Challenge", subtitle: "Global Finalist", year: "2023", icon: Globe, highlight: true },
  { title: "NASA Space Apps Challenge", subtitle: "Regional Champion", year: "2022", icon: Trophy, highlight: true },
  { title: "USAID Youth Social Leadership Program", subtitle: "Certificate of Completion", year: "2020", icon: Users, highlight: false },
  { title: "HRDI Conflict Management & Charismatic Feedback", subtitle: "Professional Certificate", year: "2020", icon: Award, highlight: false },
];

const Certifications = () => {
  return (
    <section id="certifications" className="section-padding">
      <div className="container mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Recognition</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Certifications & Awards</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {certifications.map((cert, i) => (
            <ScrollReveal key={cert.title + cert.year} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`glass rounded-2xl p-5 md:p-6 hover-glow relative overflow-hidden h-full ${cert.highlight ? "gradient-border" : ""}`}
              >
                {cert.highlight && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wider"
                  >
                    Featured
                  </motion.div>
                )}
                <div className="flex items-start gap-3 md:gap-4">
                  <motion.div
                    whileInView={{ rotate: [0, -10, 10, 0] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${cert.highlight ? "bg-accent/10" : "bg-primary/10"}`}
                  >
                    <cert.icon className={`w-5 h-5 md:w-6 md:h-6 ${cert.highlight ? "text-accent" : "text-primary"}`} />
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-sm md:text-base mb-1">{cert.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">{cert.subtitle}</p>
                    <p className="text-xs text-accent font-medium">{cert.year}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
