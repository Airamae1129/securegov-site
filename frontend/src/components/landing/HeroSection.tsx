import { lazy, Suspense, useEffect, useState } from "react";
import { hero, overviewVideo } from "@/content";
import { OverviewVideo } from "./OverviewVideo";
import { Magnetic } from "./Magnetic";
import { Logo } from "./Logo";
import { scrollToId } from "@/lib/lenis";
import { ArrowRight, Play, X, ShieldCheck } from "lucide-react";

const ShieldSceneLazy = lazy(() => import("./ShieldScene"));

function StaticShield() {
  return (
    <div className="relative flex h-full items-center justify-center" aria-hidden="true">
      <div className="absolute h-72 w-72 rounded-full bg-sg-primary/40 blur-[110px]" />
      <div className="sg-spin-slow absolute h-[420px] w-[420px] rounded-full border border-sg-electric/25" />
      <div className="sg-spin-rev absolute h-[340px] w-[340px] rounded-full border border-dashed border-sg-violet-400/30" />
      <div className="sg-float sg-glow-pulse rounded-[2rem]">
        <Logo variant="white" withWordmark={false} className="[&_svg]:h-44 [&_svg]:w-44" />
      </div>
    </div>
  );
}

function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-sg-ink-950/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Product overview video"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-sg-violet-400/25 bg-sg-ink-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-sg-violet-400/15 px-5 py-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sg-violet-300">{overviewVideo.title}</p>
          <button data-testid="video-modal-close" onClick={onClose} aria-label="Close video" className="text-sg-violet-300 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <OverviewVideo autoPlay />
      </div>
    </div>
  );
}

export function HeroSection({ started, onDemo }: { started: boolean; onDemo: () => void }) {
  const [webgl, setWebgl] = useState(false);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    const ok =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.innerWidth >= 768 &&
      !!document.createElement("canvas").getContext("webgl");
    setWebgl(ok);
  }, []);

  return (
    <section data-testid="hero-section" className="sg-mesh-bg sg-hex-grid relative overflow-hidden pt-28 pb-10 md:pt-32">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sg-primary/30 blur-[140px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div className={started ? "sg-lines-in" : ""}>
          <p className="sg-eyebrow text-sg-violet-400">{hero.eyebrow}</p>
          <h1 className="mt-5 font-heading text-[clamp(40px,5.4vw,72px)] font-extrabold leading-[1.02] text-white">
            {hero.lines.map((l, i) => (
              <span key={i} className="sg-line-mask">
                <span className={i === 1 ? "text-sg-violet-400" : ""}>{l}</span>
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-sg-body-dark md:text-lg">{hero.sub}</p>
          <p className="mt-4 font-mono text-sm tracking-tight text-sg-electric">{hero.tagline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <button
                data-testid="hero-demo-button"
                onClick={onDemo}
                className="sg-shimmer inline-flex items-center gap-2 rounded-xl bg-sg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_40px_rgba(124,77,219,0.45)] transition-colors hover:bg-sg-primary-600"
              >
                Request Full Demo <ArrowRight className="h-4 w-4" />
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button
                data-testid="hero-assessment-button"
                onClick={() => scrollToId("cta")}
                className="inline-flex items-center gap-2 rounded-xl border border-sg-violet-400/40 px-7 py-3.5 text-sm font-semibold text-sg-violet-300 transition-colors hover:border-sg-violet-400 hover:text-white"
              >
                Start Free Assessment
              </button>
            </Magnetic>
            <button
              data-testid="hero-video-button"
              onClick={() => setVideo(true)}
              className="inline-flex items-center gap-2 text-sm font-medium text-sg-violet-300/90 transition-colors hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sg-violet-400/40">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>
              {overviewVideo.cta}
            </button>
          </div>

          <div className="mt-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-sg-violet-300/50" aria-hidden="true">
            <span className="sg-chev text-sg-violet-400">&gt;</span>
            <span className="sg-chev text-sg-violet-400">&gt;</span>
            <span className="sg-chev text-sg-violet-400">&gt;</span>
            <span className="sg-chev text-sg-violet-400">&gt;</span>
            <span className="ml-2">Scroll to explore</span>
          </div>
        </div>

        <div className="relative h-[420px] md:h-[540px]" data-testid="hero-3d-stage">
          {webgl ? (
            <Suspense fallback={<StaticShield />}>
              <ShieldSceneLazy />
            </Suspense>
          ) : (
            <StaticShield />
          )}
          {hero.cards.map((c, i) => (
            <div
              key={c.label}
              className="sg-glass sg-float absolute rounded-2xl px-4 py-3"
              style={{
                animationDelay: `${i * 1.1}s`,
                top: ["6%", "58%", "12%", "66%"][i],
                left: ["-2%", "2%", "auto", "auto"][i],
                right: ["auto", "auto", "0%", "4%"][i],
              }}
              data-testid={`hero-stat-card-${i}`}
            >
              <p className="text-[11px] uppercase tracking-wider text-sg-violet-300/70">{c.label}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-heading text-xl font-bold text-white">{c.value}</span>
                <span className="rounded-full bg-sg-amber-bg px-2 py-0.5 text-[10px] font-semibold text-sg-amber">{c.chip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-14 flex max-w-[1320px] items-center gap-3 px-5 md:px-8">
        <ShieldCheck className="h-4 w-4 text-sg-violet-400" />
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sg-violet-300/60">
          ISO 27001 &amp; ISO 42001 certified · Hosted in EU data centres
        </p>
      </div>

      <VideoModal open={video} onClose={() => setVideo(false)} />
    </section>
  );
}
