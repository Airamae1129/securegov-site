import { useEffect, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, scrollToId } from "@/lib/lenis";
import { Loader } from "@/components/landing/Loader";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { HeaderNav } from "@/components/landing/HeaderNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { FrameworkMarquee } from "@/components/landing/FrameworkMarquee";
import { ProblemStory } from "@/components/landing/ProblemStory";
import { SolutionHub } from "@/components/landing/SolutionHub";
import { CapabilitiesBento } from "@/components/landing/CapabilitiesBento";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductTour } from "@/components/landing/ProductTour";
import { UseCases } from "@/components/landing/UseCases";
import { SecurityTrust } from "@/components/landing/SecurityTrust";
import { Pricing } from "@/components/landing/Pricing";
import { CtaSection } from "@/components/landing/CtaSection";
import { Roadmap } from "@/components/landing/Roadmap";
import { Footer } from "@/components/landing/Footer";
import { CookieBanner } from "@/components/landing/CookieBanner";
import { SupportChat } from "@/components/landing/SupportChat";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    let rafId = 0;
    const raf = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); setLenis(null); };
  }, []);

  useEffect(() => {
    if (loaded) ScrollTrigger.refresh();
  }, [loaded]);

  const goDemo = () => scrollToId("cta");

  return (
    <div className="min-h-screen bg-sg-ink-950">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <ScrollProgress />
      <CustomCursor />
      <HeaderNav onDemo={goDemo} />
      <main>
        <HeroSection started={loaded} onDemo={goDemo} />
        <FrameworkMarquee />
        <ProblemStory />
        <SolutionHub />
        <CapabilitiesBento />
        <HowItWorks />
        <ProductTour />
        <UseCases />
        <SecurityTrust />
        <Pricing />
        <CtaSection />
        <Roadmap />
      </main>
      <Footer />
      <CookieBanner />
      <SupportChat />
    </div>
  );
}
