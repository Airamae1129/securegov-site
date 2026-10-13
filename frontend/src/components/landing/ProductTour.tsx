import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import { Logo } from "./Logo";
import { OverviewVideo } from "./OverviewVideo";
import { SCREEN_META, TourScreen, type ScreenId } from "./tourScreens";
import { Bell, Lock, Building2, Users } from "lucide-react";

const GROUPS = ["OVERVIEW", "COMPLIANCE", "AI"] as const;

export function ProductTour() {
  const [screen, setScreen] = useState<ScreenId>("dashboard");
  const active = SCREEN_META.find((s) => s.id === screen)!;

  return (
    <section id="product-tour" data-testid="product-tour-section" className="sg-gradient-bg relative overflow-hidden py-28">
      <div className="sg-hex-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1320px] px-5 md:px-8">
        <SectionHeading
          dark
          eyebrow="GUIDED PRODUCT TOUR"
          title="This is the real product. Fictional data only."
          sub="Click through the actual SecureGov interface — every screen you see is what your team would use. Demo Company Ltd, Demo User."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 overflow-hidden rounded-2xl border border-sg-violet-400/30 shadow-[0_0_120px_rgba(124,77,219,0.45)]"
          data-testid="app-shell"
        >
          {/* browser chrome */}
          <div className="flex items-center gap-3 border-b border-sg-violet-400/15 bg-sg-ink-950 px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-sg-red/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-sg-amber/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-sg-green/70" />
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-sg-ink-900 px-3 py-1 font-mono text-[10px] text-sg-violet-300/70">
              <Lock className="h-2.5 w-2.5" /> app.securegov.eu — demo
            </span>
          </div>

          <div className="flex min-h-[620px] flex-col md:flex-row">
            {/* sidebar */}
            <aside className="hidden w-56 shrink-0 flex-col bg-sg-ink-900 p-4 md:flex" aria-label="Demo app navigation">
              <Logo variant="white" className="mb-6 [&_svg]:h-7 [&_svg]:w-7 [&_span_span]:text-sm" />
              {GROUPS.map((g) => (
                <div key={g} className="mb-4">
                  <p className="mb-1.5 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-sg-violet-300/50">{g}</p>
                  {SCREEN_META.filter((s) => s.group === g).map((s) => (
                    <button
                      key={s.id}
                      data-testid={`tour-nav-${s.id}`}
                      onClick={() => setScreen(s.id)}
                      aria-current={screen === s.id ? "page" : undefined}
                      className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                        screen === s.id ? "bg-sg-primary-600 font-semibold text-white" : "text-sg-violet-300/75 hover:bg-sg-primary/30 hover:text-white"
                      }`}
                    >
                      <s.icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                      {s.label}
                    </button>
                  ))}
                </div>
              ))}
              <div className="mb-4 opacity-45">
                <p className="mb-1.5 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-sg-violet-300/50">ORGANISATION</p>
                {[{ i: Building2, l: "Company Profile" }, { i: Users, l: "User Management" }].map((x) => (
                  <div key={x.l} className="mb-0.5 flex cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-sg-violet-300/75" title="Available in the full product">
                    <x.i className="h-4 w-4 shrink-0" strokeWidth={1.8} />{x.l}
                  </div>
                ))}
              </div>
              <div className="mt-auto border-t border-sg-violet-400/15 pt-3">
                <div className="flex items-center gap-2.5 px-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sg-primary text-[11px] font-bold text-white">DU</span>
                  <div>
                    <p className="text-xs font-semibold text-white">Demo User</p>
                    <p className="text-[10px] text-sg-violet-300/60">Demo Company Ltd</p>
                  </div>
                </div>
                <p className="mt-3 px-2 font-mono text-[9px] text-sg-violet-300/40">SecureGov 4.1.0</p>
              </div>
            </aside>

            {/* main */}
            <div className="flex min-w-0 flex-1 flex-col bg-sg-canvas">
              <div className="flex items-center justify-between border-b border-[#E9E3F5] bg-white px-5 py-3">
                <nav className="text-[11px] text-sg-muted" aria-label="Breadcrumb">
                  Home <span className="mx-1">›</span> {active.group === "AI" ? "Advisor" : active.label} <span className="mx-1">›</span> <span className="font-medium text-sg-text">Overview</span>
                </nav>
                <div className="flex items-center gap-3">
                  <span className="hidden text-xs text-sg-muted sm:block">Welcome back, Demo User</span>
                  <span className="relative">
                    <Bell className="h-4 w-4 text-sg-muted" />
                    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-sg-red" />
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sg-primary text-[10px] font-bold text-white md:hidden">DU</span>
                </div>
              </div>

              {/* mobile screen picker */}
              <div className="flex gap-2 overflow-x-auto border-b border-[#E9E3F5] bg-white px-4 py-2.5 md:hidden" role="tablist" aria-label="Demo screens">
                {SCREEN_META.map((s) => (
                  <button
                    key={s.id}
                    data-testid={`tour-nav-mobile-${s.id}`}
                    onClick={() => setScreen(s.id)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium ${
                      screen === s.id ? "bg-sg-primary text-white" : "bg-sg-tint text-sg-primary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-x-hidden p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screen}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    data-testid={`tour-screen-${screen}`}
                  >
                    <TourScreen id={screen} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="border-t border-[#E9E3F5] px-5 py-2 text-right font-mono text-[9px] text-sg-muted/60">SecureGov 4.1.0 · demo environment · fictional data</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-20 max-w-4xl"
          data-testid="tour-overview-video"
        >
          <p className="sg-eyebrow text-center text-sg-violet-400">PREFER TO WATCH?</p>
          <h3 className="mt-3 text-center font-heading text-2xl font-bold text-white sm:text-3xl">
            See SecureGov in action
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-sg-body-dark/90">
            Onboard, consolidate, measure, act and prove — the whole journey in one short overview.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-sg-violet-400/30 shadow-[0_0_80px_rgba(124,77,219,0.35)]">
            <OverviewVideo />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
