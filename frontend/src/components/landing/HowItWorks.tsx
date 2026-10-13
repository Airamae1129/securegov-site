import { motion } from "motion/react";
import { howItWorks } from "@/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section id="how-it-works" data-testid="how-it-works-section" className="relative overflow-hidden bg-white py-28">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="From first question to audit-ready in five steps"
          sub="No consultants. No spreadsheets. Just answers."
        />
        <div className="relative mt-16">
          <motion.div
            aria-hidden="true"
            className="absolute left-[26px] top-0 h-full w-px origin-top bg-gradient-to-b from-sg-primary via-sg-violet-400 to-sg-electric md:left-0 md:top-[26px] md:h-px md:w-full md:origin-left"
            initial={{ scaleY: 0, scaleX: 0 }}
            whileInView={{ scaleY: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <ol className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-6">
            {howItWorks.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.15}>
                <li className="relative pl-16 md:pl-0 md:pt-16">
                  <span
                    className="absolute left-0 top-0 flex h-[52px] w-[52px] items-center justify-center rounded-2xl sg-gradient-bg font-heading text-lg font-extrabold text-white shadow-[0_8px_28px_rgba(124,77,219,0.4)] md:left-0"
                    aria-hidden="true"
                  >
                    {s.step}
                  </span>
                  <h3 className="font-heading text-base font-bold text-sg-text">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sg-muted">{s.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
