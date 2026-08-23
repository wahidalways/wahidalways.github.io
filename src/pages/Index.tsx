import { useState, useCallback, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Preloader, { shouldShowPreloader } from "@/components/Preloader";
import { m } from "framer-motion";

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
  // Resolved once, before the first render, so a returning visitor never pays
  // for a splash frame — and never pays for the fade-in that follows it either.
  const [loading, setLoading] = useState(shouldShowPreloader);

  const handlePreloaderComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Preloader onComplete={handlePreloaderComplete} />}
      <m.div
        initial={{ opacity: loading ? 0 : 1 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-background"
      >
        {/*
          * The header carries eight nav links, a theme toggle, a colour picker
          * and a resume menu. Without this, every keyboard and screen-reader
          * visitor tabs through all of them before reaching any content.
          */}
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="main">
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
      </m.div>
    </>
  );
};

export default Index;
