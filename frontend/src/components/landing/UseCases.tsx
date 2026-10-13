import { useState } from "react";
import { motion } from "motion/react";
import { useCases } from "@/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";

export function UseCases() {
  const [flipped, setFlipped] = useState<string | null>(null);

  return (
    <section id="use-cases" data-testid="use-cases-section" className="bg-sg-canvas py-28">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHeading
          eyebrow="USE CASES"
          title="Real problems. Solved in weeks, not quarters."
          sub="Tap a card to see how SecureGov handles it."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u, i) => {
            const isFlipped = flipped === u.id;
            return (
              <Reveal key={u.id} delay={i * 0.08}>
                <button
                  data-testid={`use-case-card-${u.id}`}
                  onClick={() => setFlipped(isFlipped ? null : u.id)}
                  aria-pressed={isFlipped}
                  className="group relative block h-[440px] w-full text-left [perspective:1200px]"
                >
                  <motion.div
                    className="relative h-full w-full [transform-style:preserve-3d]"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* front */}
                    <div className="absolute inset-0 flex flex-col rounded-2xl border border-[#E9E3F5] bg-white p-6 shadow-[0_8px_32px_rgba(34,10,67,0.06)] [backface-visibility:hidden]">
                      <p className="font-heading text-4xl font-extrabold text-sg-tint">0{i + 1}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {u.tags.map((t) => (
                          <span key={t} className="rounded-full bg-sg-tint px-2.5 py-0.5 font-mono text-[10px] font-semibold text-sg-primary">{t}</span>
                        ))}
                      </div>
                      <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-sg-text">{u.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-sg-muted">{u.problem}</p>
                      <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-sg-primary">
                        <ArrowLeftRight className="h-3.5 w-3.5" /> How SecureGov solves it
                      </span>
                    </div>
                    {/* back */}
                    <div className="absolute inset-0 flex flex-col rounded-2xl sg-gradient-bg p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="sg-eyebrow text-sg-violet-400">THE FIX</p>
                      <p className="mt-3 text-sm leading-relaxed text-sg-body-dark">{u.solution}</p>
                      <ul className="mt-4 space-y-2">
                        {u.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-xs leading-snug text-white/90">
                            <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-sg-violet-400" />{pt}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-4">
                        <p className="font-heading text-3xl font-extrabold">{u.stat}</p>
                        <p className="text-xs text-sg-body-dark/85">{u.statLabel}</p>
                      </div>
                    </div>
                  </motion.div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
