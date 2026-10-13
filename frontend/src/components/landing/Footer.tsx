import { site, nav } from "@/content";
import { Logo } from "./Logo";
import { scrollToId } from "@/lib/lenis";
import { Mail, Phone, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-sg-violet-400/15 bg-sg-ink-950 py-16">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo variant="white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-sg-body-dark/85">
              AI-powered governance automation for policies, risks, controls and evidence for businesses operating in Europe. No cybersecurity team? No problem.
            </p>
            <div className="mt-6 space-y-2 text-sm text-sg-violet-300/80">
              <a href={`https://${site.url}`} className="flex items-center gap-2 transition-colors hover:text-white"><Globe className="h-4 w-4" /> {site.url}</a>
              <a href={`mailto:${site.email}`} data-testid="footer-email" className="flex items-center gap-2 transition-colors hover:text-white"><Mail className="h-4 w-4" /> {site.email}</a>
              <a href={`tel:${site.phoneHref}`} data-testid="footer-phone" className="flex items-center gap-2 transition-colors hover:text-white"><Phone className="h-4 w-4" /> {site.phone}</a>
            </div>
          </div>
          <div>
            <p className="sg-eyebrow text-sg-violet-400">Product</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <button data-testid={`footer-link-${n.href}`} onClick={() => scrollToId(n.href)} className="text-sm text-sg-violet-300/70 transition-colors hover:text-white">
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="sg-eyebrow text-sg-violet-400">Company</p>
            <ul className="mt-4 space-y-2.5">
              {["About", "Terms", "Privacy"].map((l) => (
                <li key={l}>
                  <a href="#" onClick={(e) => e.preventDefault()} data-testid={`footer-legal-${l.toLowerCase()}`} className="text-sm text-sg-violet-300/70 transition-colors hover:text-white" title="Coming soon">
                    {l}
                  </a>
                </li>
              ))}
              <li>
                <button
                  data-testid="footer-cookie-settings"
                  onClick={() => { localStorage.removeItem("sg-consent"); window.dispatchEvent(new Event("sg-cookie-reset")); }}
                  className="text-sm text-sg-violet-300/70 transition-colors hover:text-white"
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-sg-violet-400/15 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-sg-violet-300/50">© {site.year} {site.name} / {site.company}. Public demo — fictional data only.</p>
          <button
            data-testid="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-sg-violet-300/70 transition-colors hover:text-white"
            aria-label="Back to top"
          >
            Back to top
            <span className="flex flex-col leading-none text-sg-violet-400">
              <span className="sg-chev rotate-[-90deg]">&gt;</span>
              <span className="sg-chev -mt-1 rotate-[-90deg]">&gt;</span>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
