import { useState, useCallback, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Preloader from "@/components/Preloader";
import { motion } from "framer-motion";

const About = lazy(() => import("@/components/About"));
const Stats = lazy(() => import("@/components/Stats"));
const Skills = lazy(() => import("@/components/Skills"));
const Experience = lazy(() => import("@/components/Experience"));
const Projects = lazy(() => import("@/components/Projects"));
const Education = lazy(() => import("@/components/Education"));
const Certifications = lazy(() => import("@/components/Certifications"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));
const BackToTop = lazy(() => import("@/components/BackToTop"));
const FloatingShare = lazy(() => import("@/components/FloatingShare"));

const Index = () => {
  const [loading, setLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Preloader onComplete={handlePreloaderComplete} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={null}>
            <About />
            <Stats />
            <Skills />
            <Experience />
            <Projects />
            <Education />
            <Certifications />
            <Testimonials />
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
          <BackToTop />
          <FloatingShare />
        </Suspense>
      </motion.div>
    </>
  );
};

export default Index;
