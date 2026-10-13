import { securityPoints, securityTagline } from "@/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Logo } from "./Logo";
import { BadgeCheck, Lock, ShieldCheck, Compass, ServerCog, Bot, Landmark } from "lucide-react";

const ICONS = [Lock, ShieldCheck, Compass, ServerCog, Bot, Landmark];

// Fixed badge positions around the shield (no orbit): each one floats gently on its own beat.
const BADGES = [
  { b: "ISO 27001", top: "8%", left: "50%" },
  { b: "ISO 42001", top: "32%", left: "92%" },
  { b: "NIS2", top: "78%", left: "84%" },
  { b: "GDPR", top: "78%", left: "16%" },
  { b: "EU HOSTED", top: "32%", left: "8%" },
];

export function SecurityTrust() {
  return (
    <section id="security" data-testid="security-section" className="relative overflow-hidden bg-sg-ink-950 py-28">
      <style>{`
        @keyframes sec-ripple { 0% { transform: scale(.55); opacity: .55; } 100% { transform: scale(1.35); opacity: 0; } }
        .sec-ripple { animation: sec-ripple 4.2s cubic-bezier(.2,.6,.3,1) infinite; }
        @keyframes sec-bob { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-10px); } }
        .sec-badge { animation: sec-bob 4.8s ease-in-out infinite; }
        @keyframes sec-scan { 0% { top: 12%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 88%; opacity: 0; } }
        .sec-scan { animation: sec-scan 3.6s ease-in-out infinite; }
        @keyframes sec-check { 0%, 70%, 100% { opacity: .35; } 80% { opacity: 1; } }
        .sec-check { animation: sec-check 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .sec-ripple, .sec-badge, .sec-scan, .sec-check { animation: none; } }
      `}</style>
      <div className="sg-hex-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-sg-primary/25 blur-[130px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              dark
              eyebrow="SECURITY & TRUST"
              title="Governance you can defend"
              sub="We hold ourselves to the same standard we help you reach."
            />
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {securityPoints.map((p, i) => {
                const Icon = ICONS[i];
                return (
                  <Reveal key={p.title} delay={i * 0.06} className="h-full">
                    <div className="sg-glass flex h-full gap-3.5 rounded-xl p-4" data-testid={`security-point-${i}`}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sg-primary/50">
                        <Icon className="h-[18px] w-[18px] text-sg-violet-400" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{p.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-sg-body-dark/85">{p.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.2}>
              <p className="mt-10 font-heading text-lg font-bold text-sg-violet-400">{securityTagline}</p>
            </Reveal>
          </div>

          <Reveal className="hidden lg:block">
            <div className="relative mx-auto flex h-[440px] w-[440px] items-center justify-center" aria-hidden="true">
              <div className="absolute h-72 w-72 rounded-full bg-sg-primary/40 blur-[100px]" />
              {[0, 1.4, 2.8].map((d) => (
                <span key={d} className="sec-ripple absolute h-[380px] w-[380px] rounded-full border border-sg-violet-400/40" style={{ animationDelay: `${d}s` }} />
              ))}
              <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-[2.5rem] border border-sg-violet-400/30 bg-sg-ink-900/70 shadow-[0_0_60px_rgba(124,77,219,0.45)]">
                <Logo variant="white" withWordmark={false} className="[&_svg]:h-28 [&_svg]:w-28" />
                <span className="sec-scan absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-sg-electric to-transparent shadow-[0_0_12px_#0A84FF]" />
              </div>
              {BADGES.map((x, i) => (
                <span
                  key={x.b}
                  className="sec-badge absolute flex items-center gap-1.5 rounded-full border border-sg-violet-400/40 bg-sg-ink-900/90 px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-sg-violet-300"
                  style={{ top: x.top, left: x.left, animationDelay: `${i * 0.7}s` }}
                >
                  <BadgeCheck className="sec-check h-3 w-3 text-sg-electric" style={{ animationDelay: `${i}s` }} />{x.b}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
