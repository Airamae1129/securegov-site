import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { modules } from "@/content";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

// Modules sit evenly on a circle around the engine; the whole orbit turns while each card
// counter-rotates so its text stays upright. On narrow screens the cards switch to big
// module numbers (the readable list below carries the names).
const W = 800;
const H = 540;
const C = { x: W / 2, y: H / 2 };
const R = 200;
const POS = modules.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / modules.length;
  return { x: C.x + R * Math.cos(a), y: C.y + R * Math.sin(a) };
});

export function SolutionHub() {
  const ref = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const compact = scale < 0.7;

  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<SVGLineElement>(".hub-line").forEach((p, i) => {
        gsap.fromTo(
          p,
          { strokeDasharray: R, strokeDashoffset: R },
          {
            strokeDashoffset: 0,
            duration: 1.1,
            delay: i * 0.18,
            ease: "power2.out",
            scrollTrigger: { trigger: ref.current, start: "top 65%" },
          }
        );
      });
      gsap.fromTo(
        ".hub-pill",
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1, scale: 1, duration: 0.7, stagger: 0.16, ease: "back.out(1.8)",
          scrollTrigger: { trigger: ref.current, start: "top 65%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-sg-canvas py-28" data-testid="solution-hub-section">
      <style>{`
        /* The orbit always turns: no hover pause and no reduced-motion opt-out, by design request. */
        @keyframes hub-orbit { to { transform: rotate(360deg); } }
        .hub-orbit { transform-origin: ${C.x}px ${C.y}px; animation: hub-orbit 30s linear infinite; }
        .hub-upright { animation: hub-orbit 30s linear infinite reverse; }
        @keyframes hubdash { to { stroke-dashoffset: -124; } }
        .hub-pulse { animation: hubdash 2.6s linear infinite; opacity: .8; }
      `}</style>
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHeading
          eyebrow="THE SOLUTION"
          title="Four modules. One AI engine."
          sub="SecureGov runs your whole governance programme from one hub — not four piecemeal tools."
        />

        {/* The stage is drawn at a fixed 800×540 and scaled to fit, so the orbit shows (and turns) on every screen. */}
        <div ref={fitRef} className="mx-auto mt-10 w-full max-w-[800px]" style={{ height: H * scale }}>
        <div ref={ref} className="hub-stage relative origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx={C.x} cy={C.y} r={R} fill="none" stroke="#4C1B8C" strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="3 7" />
            <circle cx={C.x} cy={C.y} r={R + 46} fill="none" stroke="#0A84FF" strokeOpacity="0.08" strokeWidth="1" />
          </svg>

          <div className="hub-orbit absolute inset-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="hubgrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2={H}>
                  <stop offset="0" stopColor="#7C4DDB" />
                  <stop offset="1" stopColor="#0A84FF" />
                </linearGradient>
              </defs>
              {POS.map((p, i) => (
                <line key={i} className="hub-line" x1={C.x} y1={C.y} x2={p.x} y2={p.y}
                  stroke="url(#hubgrad)" strokeWidth="2" strokeLinecap="round" />
              ))}
              {POS.map((p, i) => (
                <line key={`pulse-${i}`} x1={C.x} y1={C.y} x2={p.x} y2={p.y}
                  stroke="#A98BF0" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 120"
                  className="hub-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
              ))}
            </svg>

            {modules.map((m, i) => (
              <div key={m.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: POS[i].x, top: POS[i].y }}>
                <div className="hub-upright">
                  {compact ? (
                    <div
                      className="hub-pill flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-sg-primary/15 bg-white shadow-[0_10px_36px_rgba(34,10,67,0.10)]"
                      data-testid={`module-pill-${m.id}`}
                      aria-label={`Module ${m.id}: ${m.name}`}
                    >
                      <p className="font-heading text-6xl font-extrabold text-sg-primary">{m.id}</p>
                    </div>
                  ) : (
                    <div
                      className="hub-pill w-52 rounded-xl border border-sg-primary/15 bg-white p-3.5 shadow-[0_10px_36px_rgba(34,10,67,0.10)]"
                      data-testid={`module-pill-${m.id}`}
                    >
                      <p className="font-mono text-[10px] tracking-[0.18em] text-sg-primary-600">MODULE {m.id}</p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-sg-text">{m.name}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`sg-glow-pulse absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full sg-gradient-bg text-center shadow-2xl ${
              compact ? "h-48 w-48" : "h-32 w-32"
            }`}
            style={{ left: C.x, top: C.y }}
          >
            <span className={`font-heading font-extrabold tracking-wider text-white ${compact ? "text-2xl" : "text-sm"}`}>SECUREGOV</span>
            <span className={`font-mono tracking-[0.2em] text-sg-violet-300 ${compact ? "text-base" : "text-[10px]"}`}>AI ENGINE</span>
          </div>
        </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {modules.map((m) => (
            <Reveal key={m.id}>
              <div className="flex h-full gap-4 rounded-xl border border-sg-primary/15 bg-white p-5" data-testid={`module-pill-mobile-${m.id}`}>
                <span className="font-mono text-xs tracking-[0.18em] text-sg-primary-600">{m.id}</span>
                <div>
                  <p className="font-semibold text-sg-text">{m.name}</p>
                  <p className="mt-1 text-sm text-sg-muted">{m.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-12 hidden max-w-4xl grid-cols-4 gap-6 lg:grid">
          {modules.map((m) => (
            <div key={m.id} className="text-center">
              <p className="font-mono text-[10px] tracking-[0.18em] text-sg-primary-600">MODULE {m.id}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-sg-muted">{m.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
