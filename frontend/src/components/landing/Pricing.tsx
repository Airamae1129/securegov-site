import { pricing } from "@/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { scrollToId } from "@/lib/lenis";
import { BadgeCheck, ArrowRight } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" data-testid="pricing-section" className="sg-mesh-bg relative overflow-hidden py-28">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHeading
          dark
          eyebrow="PRICING"
          title="Expert solutions, priced for non-experts"
          sub="Start free. Upgrade when your programme grows."
          align="center"
        />
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {pricing.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <div
                data-testid={`pricing-card-${p.name.toLowerCase()}`}
                className={`flex h-full flex-col rounded-2xl p-7 ${
                  p.highlighted
                    ? "sg-border-trace sg-glass sg-glow-pulse"
                    : "sg-glass"
                }`}
              >
                {p.highlighted && (
                  <span className="mb-4 w-fit rounded-full bg-sg-violet-400 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-sg-ink-950">
                    Most popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold text-white">{p.name}</h3>
                <p className="mt-1 text-xs text-sg-body-dark/85">{p.desc}</p>
                <p className="mt-5 font-heading text-3xl font-extrabold text-white">{p.price}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-sg-body-dark">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sg-violet-400" />{f}
                    </li>
                  ))}
                </ul>
                <Magnetic strength={0.15} className="mt-8 w-full">
                  <button
                    data-testid={`pricing-cta-${p.name.toLowerCase()}`}
                    onClick={() => scrollToId("cta")}
                    className={`sg-shimmer inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                      p.highlighted
                        ? "bg-white text-sg-primary hover:bg-sg-tint"
                        : "border border-sg-violet-400/40 text-white hover:border-sg-violet-400"
                    }`}
                  >
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </button>
                </Magnetic>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
