import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { problem } from "@/content";
import { SectionHeading } from "./SectionHeading";
import { Logo } from "./Logo";

gsap.registerPlugin(ScrollTrigger);

export function ProblemStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [simple, setSimple] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    setSimple(reduced || mobile);
    if (reduced || mobile || !ref.current) return;

    const ctx = gsap.context(() => {
      const chips = gsap.utils.toArray<HTMLElement>(".ps-chip");
      chips.forEach((chip) => {
        gsap.set(chip, {
          x: gsap.utils.random(-420, 420),
          y: gsap.utils.random(-260, 260),
          rotation: gsap.utils.random(-40, 40),
          opacity: 0,
        });
      });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top top", end: "+=850", scrub: 0.8, pin: true },
      });
      tl.to(chips, { opacity: 1, duration: 0.15, stagger: 0.04 })
        .to(chips, {
          x: () => gsap.utils.random(-90, 90),
          y: () => gsap.utils.random(-60, 60),
          rotation: () => gsap.utils.random(-14, 14),
          duration: 0.45,
          stagger: 0.03,
          ease: "power2.inOut",
        })
        .to(chips, { scale: 0, opacity: 0, duration: 0.25, stagger: 0.02, ease: "power2.in" }, "+=0.1")
        .fromTo(".ps-shield", { scale: 0.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }, "-=0.1")
        .fromTo(".ps-caption", { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.25 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section data-testid="problem-section" className="sg-gradient-bg relative overflow-hidden">
      <div className="sg-hex-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div ref={ref} className="relative flex min-h-screen flex-col items-center justify-center px-5 py-16 md:py-20">
        <SectionHeading dark eyebrow={problem.eyebrow} title={problem.title} sub={problem.body} align="center" />

        <div className="relative mt-8 flex h-[220px] w-full max-w-4xl items-center justify-center md:h-[280px]">
          {simple ? (
            <div className="flex max-w-2xl flex-wrap items-center justify-center gap-3">
              {problem.chips.map((c) => (
                <span key={c} className="rounded-full border border-sg-violet-400/30 bg-sg-ink-900/70 px-4 py-2 text-sm text-sg-body-dark">
                  {c}
                </span>
              ))}
            </div>
          ) : (
            problem.chips.map((c, i) => (
              <span
                key={c}
                className="ps-chip absolute rounded-full border border-sg-violet-400/40 bg-sg-ink-900/85 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
                style={{ zIndex: i }}
              >
                {c}
              </span>
            ))
          )}

          <div className={`ps-shield absolute flex flex-col items-center ${simple ? "relative mt-8 hidden md:flex" : "opacity-0"}`}>
            <div className="sg-glow-pulse rounded-[2rem]">
              <Logo variant="white" withWordmark={false} className="[&_svg]:h-28 [&_svg]:w-28" />
            </div>
          </div>
        </div>

        <div className={`ps-caption text-center ${simple ? "" : "opacity-0"}`}>
          <div className="mb-3 flex items-center justify-center gap-1 font-heading text-2xl font-bold text-sg-violet-400" aria-hidden="true">
            <span className="sg-chev">&gt;</span><span className="sg-chev">&gt;</span><span className="sg-chev">&gt;</span><span className="sg-chev">&gt;</span>
          </div>
          <p className="font-heading text-3xl font-extrabold text-white md:text-4xl">{problem.resolution}</p>
          <p className="mx-auto mt-3 max-w-xl text-sg-body-dark">{problem.resolutionSub}</p>
        </div>
      </div>
    </section>
  );
}
