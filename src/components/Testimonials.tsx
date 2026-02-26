import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    quote: "Nayem's ability to translate complex business requirements into clear, actionable specifications is exceptional. His documentation quality significantly reduced our development rework.",
    name: "Team Lead",
    role: "TechnoNext Software Limited",
  },
  {
    quote: "Working with Nayem on the HRIS project was a great experience. He ensured every stakeholder was aligned and the deliverables were always on time and well-documented.",
    name: "Project Manager",
    role: "US Bangla Airlines",
  },
  {
    quote: "His process automation initiatives saved us countless hours of manual work. Nayem brings both analytical rigor and a collaborative spirit to every project.",
    name: "Senior Developer",
    role: "TechnoNext Software Limited",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">What People Say</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 md:p-8 hover-glow relative h-full"
              >
                <Quote className="w-7 h-7 md:w-8 md:h-8 text-primary/15 absolute top-5 right-5 md:top-6 md:right-6" />
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-5 md:mb-6 relative z-10">
                  "{item.quote}"
                </p>
                <div className="border-t border-border pt-3 md:pt-4">
                  <p className="font-heading font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
