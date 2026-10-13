import { useState, type FormEvent } from "react";
import { cta, site } from "@/content";
import { apiPost } from "@/lib/api";
import { Reveal } from "./Reveal";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";
import { Mail, Phone, FileDown, CheckCircle2, Loader2 } from "lucide-react";

interface DemoResponse { id: string; message: string }

export function CtaSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState(cta.sizes[1]);
  const [picked, setPicked] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const toggle = (f: string) =>
    setPicked((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await apiPost<DemoResponse>("/demo-requests", {
        name, work_email: email, company, company_size: size, frameworks: picked, consent,
      });
      setMsg(res.message);
      setState("done");
    } catch (err) {
      setMsg(
        err instanceof Error && err.name === "ApiError"
          ? "Please check the form and try again."
          : `Could not reach the server — email us at ${site.email} instead.`
      );
      setState("error");
    }
  };

  return (
    <section id="cta" data-testid="cta-section" className="sg-gradient-bg relative overflow-hidden py-28">
      <div className="sg-hex-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] opacity-25" aria-hidden="true">
        <div className="sg-float">
          <Logo variant="white" withWordmark={false} className="[&_svg]:h-80 [&_svg]:w-80" />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1320px] gap-14 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="sg-eyebrow text-sg-violet-400">GET STARTED</p>
            <h2 className="mt-4 font-heading text-4xl font-extrabold leading-[1.06] text-white sm:text-5xl">
              {cta.title}
            </h2>
            <p className="mt-4 text-xl font-medium text-sg-violet-400">{cta.sub}</p>
          </Reveal>

          <div className="mt-10 space-y-4">
            <Reveal delay={0.1}>
              <a
                data-testid="cta-download-overview"
                href="#cta"
                onClick={(e) => e.preventDefault()}
                className="sg-glass group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-sg-violet-400/50"
                title="Request the overview via the form"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sg-primary">
                  <FileDown className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Download the SecureGov overview</p>
                  <p className="text-xs text-sg-body-dark/85">Request it via the form.</p>
                </div>
              </a>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="sg-glass flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-8">
                <p className="text-sm font-semibold text-white">Contact CyberHealth</p>
                <a data-testid="cta-email-link" href={`mailto:${site.email}`} className="flex items-center gap-2 text-sm text-sg-violet-300 transition-colors hover:text-white">
                  <Mail className="h-4 w-4" /> {site.email}
                </a>
                <a data-testid="cta-phone-link" href={`tel:${site.phoneHref}`} className="flex items-center gap-2 text-sm text-sg-violet-300 transition-colors hover:text-white">
                  <Phone className="h-4 w-4" /> {site.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="sg-glass rounded-2xl p-7">
            {state === "done" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center" data-testid="demo-form-success">
                <span className="sg-glow-pulse flex h-16 w-16 items-center justify-center rounded-full bg-sg-primary">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </span>
                <h3 className="mt-6 font-heading text-2xl font-bold text-white">Request received</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-sg-body-dark">{msg}</p>
              </div>
            ) : (
              <form onSubmit={submit} data-testid="demo-request-form">
                <h3 className="font-heading text-xl font-bold text-white">Book a live demo</h3>
                <p className="mt-1 text-xs text-sg-body-dark/85">Thirty minutes, your regulations, your questions.</p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-name" className="mb-1.5 block text-xs font-medium text-sg-violet-300">Name</label>
                    <input id="demo-name" data-testid="demo-form-name" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-sg-violet-400/25 bg-sg-ink-950/60 px-3.5 py-2.5 text-sm text-white placeholder:text-sg-violet-300/40 focus:border-sg-violet-400" placeholder="Jane Murphy" />
                  </div>
                  <div>
                    <label htmlFor="demo-email" className="mb-1.5 block text-xs font-medium text-sg-violet-300">Work email</label>
                    <input id="demo-email" data-testid="demo-form-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-sg-violet-400/25 bg-sg-ink-950/60 px-3.5 py-2.5 text-sm text-white placeholder:text-sg-violet-300/40 focus:border-sg-violet-400" placeholder="jane@company.eu" />
                  </div>
                  <div>
                    <label htmlFor="demo-company" className="mb-1.5 block text-xs font-medium text-sg-violet-300">Company</label>
                    <input id="demo-company" data-testid="demo-form-company" required value={company} onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-lg border border-sg-violet-400/25 bg-sg-ink-950/60 px-3.5 py-2.5 text-sm text-white placeholder:text-sg-violet-300/40 focus:border-sg-violet-400" placeholder="Company Ltd" />
                  </div>
                  <div>
                    <label htmlFor="demo-size" className="mb-1.5 block text-xs font-medium text-sg-violet-300">Company size</label>
                    <select id="demo-size" data-testid="demo-form-size" value={size} onChange={(e) => setSize(e.target.value)}
                      className="w-full rounded-lg border border-sg-violet-400/25 bg-sg-ink-950/60 px-3.5 py-2.5 text-sm text-white focus:border-sg-violet-400">
                      {cta.sizes.map((s) => <option key={s} value={s}>{s} staff</option>)}
                    </select>
                  </div>
                </div>

                <fieldset className="mt-5">
                  <legend className="mb-2 text-xs font-medium text-sg-violet-300">Frameworks of interest</legend>
                  <div className="flex flex-wrap gap-2">
                    {cta.frameworkOptions.map((f) => (
                      <button type="button" key={f} data-testid={`demo-form-framework-${f.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                        onClick={() => toggle(f)} aria-pressed={picked.includes(f)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                          picked.includes(f) ? "border-sg-violet-400 bg-sg-violet-400 text-sg-ink-950" : "border-sg-violet-400/30 text-sg-violet-300 hover:border-sg-violet-400"
                        }`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-sg-violet-300/80" data-testid="demo-form-consent-label">
                  <input type="checkbox" data-testid="demo-form-consent" required checked={consent} onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-sg-violet-400/40 accent-[#A98BF0]" />
                  I consent to CyberHealth contacting me about this demo request, in line with GDPR. No newsletters, no reselling.
                </label>

                {state === "error" && (
                  <p data-testid="demo-form-error" className="mt-4 rounded-lg bg-sg-red-bg px-3.5 py-2.5 text-xs font-medium text-sg-red">{msg}</p>
                )}

                <Magnetic strength={0.12} className="mt-6 w-full">
                  <button type="submit" data-testid="demo-form-submit" disabled={state === "sending"}
                    className="sg-shimmer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-sg-primary transition-colors hover:bg-sg-tint disabled:opacity-60">
                    {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {state === "sending" ? "Sending…" : "Book a live demo"}
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
