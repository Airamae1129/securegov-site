import { frameworks } from "@/content";

export function FrameworkMarquee() {
  const items = [...frameworks, ...frameworks];
  return (
    <div
      data-testid="framework-marquee"
      className="relative overflow-hidden border-y border-sg-violet-400/15 bg-sg-ink-950 py-6"
      aria-label={`Frameworks covered: ${frameworks.join(", ")}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-sg-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-sg-ink-950 to-transparent" />
      <div className="sg-marquee-track flex w-max items-center gap-12">
        {items.map((f, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="font-heading text-2xl font-bold tracking-wide text-white/30 transition-colors duration-300 hover:text-sg-violet-400 md:text-3xl">
              {f}
            </span>
            <svg viewBox="0 0 100 100" className="h-5 w-5 text-sg-primary-600/60" aria-hidden="true">
              <path d="M50 4 L88 19 V50 C88 74 72 88 50 96 C28 88 12 74 12 50 V19 Z" fill="none" stroke="currentColor" strokeWidth="8" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
