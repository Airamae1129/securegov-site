import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav } from "@/content";
import { scrollToId } from "@/lib/lenis";
import { Menu, X, ArrowRight } from "lucide-react";

export function HeaderNav({ onDemo }: { onDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Hysteresis: separate on/off thresholds so smooth-scroll hovering near one value can't flicker the bar.
    const onScroll = () => setScrolled((s) => (s ? window.scrollY > 20 : window.scrollY > 60));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      data-testid="main-nav"
      className={`fixed left-0 right-0 z-[80] transition-[padding,top] duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
      // Sits below the cookie consent bar while it's showing (see CookieBanner).
      style={{ top: "var(--sg-consent-h, 0px)" }}
    >
      {/* Radius and border width never change; only colours, spacing and width animate, so the
          bar fades in as a pill instead of popping in as a square on scroll. */}
      <div
        className={`flex items-center justify-between rounded-2xl border px-5 transition-[background-color,border-color,max-width,margin,padding] duration-500 ease-out md:mx-auto ${
          scrolled
            ? "mx-3 max-w-[1320px] border-sg-violet-400/20 bg-sg-ink-950/80 py-2.5 backdrop-blur-2xl md:px-6 lg:max-w-[1240px]"
            : "mx-0 max-w-[1320px] border-transparent bg-transparent py-0 md:px-8"
        }`}
      >
        <button
          data-testid="nav-logo-button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <Logo variant="white" />
        </button>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {nav.map((n) => (
            <button
              key={n.href}
              data-testid={`nav-link-${n.href}`}
              onClick={() => go(n.href)}
              className="text-sm text-sg-violet-300/80 transition-colors hover:text-white"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            data-testid="nav-demo-button"
            onClick={onDemo}
            className="sg-shimmer group inline-flex items-center gap-2 rounded-xl bg-sg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sg-primary-600"
          >
            Request Full Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="mx-3 mt-2 rounded-2xl border border-sg-violet-400/20 bg-sg-ink-950/95 p-5 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((n) => (
              <button
                key={n.href}
                data-testid={`nav-mobile-link-${n.href}`}
                onClick={() => go(n.href)}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-sg-violet-300 transition-colors hover:bg-sg-primary/30 hover:text-white"
              >
                {n.label}
              </button>
            ))}
            <button
              data-testid="nav-mobile-demo-button"
              onClick={() => { setOpen(false); onDemo(); }}
              className="mt-2 rounded-xl bg-sg-primary px-4 py-3 text-sm font-semibold text-white"
            >
              Request Full Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
