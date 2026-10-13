import { useEffect, useState } from "react";

export function Loader({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, 620);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div
      data-testid="intro-loader"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sg-ink-950 ${leaving ? "sg-loader-out" : ""}`}
      role="status"
      aria-label="Loading SecureGov"
    >
      <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden="true">
        <path
          d="M50 4 L88 19 V50 C88 74 72 88 50 96 C28 88 12 74 12 50 V19 Z"
          fill="none" stroke="#A98BF0" strokeWidth="3" strokeLinejoin="round" className="sg-draw"
        />
        <g fill="none" stroke="#7C4DDB" strokeWidth="2.4" className="sg-draw-2">
          <circle cx="50" cy="52" r="23" />
          <ellipse cx="50" cy="52" rx="10.5" ry="23" />
          <path d="M28 44.5 H72 M28 59.5 H72" />
        </g>
        <g fill="none" stroke="#FFFFFF" strokeWidth="3" className="sg-draw-3">
          <rect x="41.5" y="52" width="17" height="15" rx="3" />
          <path d="M44.5 52 v-5 a5.5 5.5 0 0 1 11 0 v5" />
        </g>
      </svg>
      <div className="mt-6 flex overflow-hidden font-heading text-xl font-extrabold tracking-[0.3em] text-white" aria-hidden="true">
        {"SECUREGOV".split("").map((c, i) => (
          <span
            key={i}
            className="inline-block animate-[sg-line-up_0.5s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
            style={{ animationDelay: `${0.9 + i * 0.05}s`, transform: "translateY(110%)" }}
          >
            {c}
          </span>
        ))}
      </div>
      <button
        data-testid="loader-skip-button"
        onClick={() => setLeaving(true)}
        className="absolute bottom-8 font-mono text-xs uppercase tracking-[0.22em] text-sg-violet-300/60 transition-colors hover:text-sg-violet-300"
      >
        Skip intro
      </button>
    </div>
  );
}
