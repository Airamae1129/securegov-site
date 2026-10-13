import { useState, type FormEvent } from "react";
import { roadmapItems } from "@/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { motion } from "motion/react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function Roadmap() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const notify = (e: FormEvent) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <section id="roadmap" data-testid="roadmap-section" className="relative overflow-hidden bg-sg-ink-950 py-28">
      <div className="sg-scanline" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHeading
          dark
          eyebrow="COMING SOON"
          title="Where SecureGov goes next"
          sub="Already in the lab — shipping to customers quarter by quarter."
        />

        <div className="relative mt-16">
          <motion.div
            aria-hidden="true"
            className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-sg-violet-400 via-sg-electric to-transparent md:left-0 md:top-[7px] md:h-px md:w-full md:bg-gradient-to-r"
            initial={{ scaleY: 0, scaleX: 0 }}
            whileInView={{ scaleY: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ transformOrigin: "top left" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
            {roadmapItems.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.14}>
                <div className="relative pl-8 md:pl-0 md:pt-10" data-testid={`roadmap-item-${i}`}>
                  <span className="sg-glow-pulse absolute left-0 top-0 h-[15px] w-[15px] rounded-full border-2 border-sg-electric bg-sg-ink-950" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sg-violet-400/40 bg-sg-ink-900 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sg-violet-400">
                    <Sparkles className="h-3 w-3" /> Coming soon · {r.quarter}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-bold text-white">{r.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-16">
          {done ? (
            <p data-testid="notify-success" className="inline-flex items-center gap-2 text-sm text-sg-body-dark">
              <CheckCircle2 className="h-4 w-4 text-sg-green" /> Noted — we'll let you know when these ship.
            </p>
          ) : (
            <form onSubmit={notify} className="flex max-w-md gap-3" data-testid="notify-form">
              <label htmlFor="notify-email" className="sr-only">Email for roadmap updates</label>
              <input id="notify-email" data-testid="notify-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Get notified — work email"
                className="flex-1 rounded-xl border border-sg-violet-400/25 bg-sg-ink-900/70 px-4 py-3 text-sm text-white placeholder:text-sg-violet-300/40 focus:border-sg-violet-400" />
              <button type="submit" data-testid="notify-submit"
                className="sg-shimmer rounded-xl bg-sg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sg-primary-600">
                Notify me
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
