import { useCallback, useRef, useState } from "react";
import SmoothScroll from "@/lib/smooth-scroll";
import { usePageMotion } from "@/lib/page-motion";
import Preloader, { shouldShowPreloader } from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingShare from "@/components/FloatingShare";

/*
 * Sections are imported eagerly. Lazy-loading them saved a few kilobytes but
 * made the page's height change after first layout, and every ScrollTrigger —
 * the pinned case studies above all — measures positions against that height.
 */
const Index = () => {
  // Resolved once before the first render, so a returning visitor never sees a
  // splash frame at all.
  const [loading, setLoading] = useState(shouldShowPreloader);
  const handlePreloaderComplete = useCallback(() => setLoading(false), []);

  const pageRef = useRef<HTMLDivElement>(null);
  usePageMotion(pageRef);

  return (
    <>
      {loading && <Preloader onComplete={handlePreloaderComplete} />}
      <SmoothScroll />

      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />

      <div ref={pageRef} className="relative bg-background">
        <main id="main">
          <Hero ready={!loading} />
          <About />
          <Stats />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Certifications />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>

      <BackToTop />
      <FloatingShare />
    </>
  );
};

export default Index;
