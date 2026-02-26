import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import BABackground from "./BABackground";

const education = [
  { degree: "Master of Business Administration (Professional)", institution: "Bangladesh University of Professionals (BUP)", year: "Sep 2025 – Ongoing", gpa: "N/A" },
  { degree: "B.Sc. in Software Engineering (Major: Data Science)", institution: "Daffodil International University", year: "Jan 2020 – Feb 2024", gpa: "3.73 / 4.00" },
  { degree: "HSC", institution: "Cumilla Shikkha Board Govt. Model College", year: "2017 – 2019", gpa: "4.75 / 5.00" },
  { degree: "SSC", institution: "A. Malek Institution", year: "2012 – 2017", gpa: "5.00 / 5.00" },
];

const Education = () => {
  return (
    <section id="education" className="section-padding relative overflow-hidden">
      <BABackground density="light" />
      <div className="container mx-auto relative z-10">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Education</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Academic Background</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {education.map((edu, i) => (
            <ScrollReveal key={edu.degree} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-5 md:p-6 hover-glow h-full"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <motion.div
                    whileInView={{ rotate: [0, -10, 10, 0] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                  >
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-sm md:text-base mb-1 leading-snug">{edu.degree}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">{edu.institution}</p>
                    <p className="text-xs text-accent font-medium">{edu.year}</p>
                    {edu.gpa !== "N/A" && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Award className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs md:text-sm font-medium text-foreground">CGPA: {edu.gpa}</span>
                      </div>
                    )}
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

export default Education;
