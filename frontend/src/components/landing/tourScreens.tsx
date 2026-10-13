import { useEffect, useRef, useState, type ReactNode } from "react";
import { chatScripts } from "@/content";
import {
  LayoutDashboard, Activity, Bell, Layers, BarChart3, Bot, ShieldCheck, ClipboardCheck,
  CheckCircle2, AlertTriangle, XCircle, ChevronRight,
} from "lucide-react";

/* ---------- shared bits ---------- */
function Chip({ tone, children }: { tone: "green" | "amber" | "red" | "purple"; children: ReactNode }) {
  const map = {
    green: "bg-sg-green-bg text-sg-green",
    amber: "bg-sg-amber-bg text-sg-amber",
    red: "bg-white text-sg-red ring-1 ring-sg-red",
    purple: "bg-sg-tint text-sg-primary",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[tone]}`}>{children}</span>;
}

function Hotspot({ label, className }: { label: string; className: string }) {
  return (
    <span className={`group/h absolute z-20 ${className}`}>
      <span className="sg-hotspot relative block h-3.5 w-3.5 cursor-help rounded-full bg-sg-violet-400 ring-2 ring-white/70" />
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-48 -translate-x-1/2 rounded-lg bg-sg-ink-950 px-3 py-2 text-[11px] leading-snug text-white opacity-0 shadow-xl transition-opacity group-hover/h:opacity-100">
        {label}
      </span>
    </span>
  );
}

function Bar({ pct, tone = "bg-sg-primary" }: { pct: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-sg-tint">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Donut({ pct, color = "#4C1B8C", size = 44 }: { pct: number; color?: string; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEE9FF" strokeWidth="5" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="#1B1523">{pct}%</text>
    </svg>
  );
}

function Card({ title, action, children, className = "", hotspot }: { title?: string; action?: string; children: ReactNode; className?: string; hotspot?: { label: string; className: string } }) {
  return (
    <div className={`relative rounded-xl border border-[#E9E3F5] bg-white p-4 shadow-[0_4px_20px_rgba(34,10,67,0.04)] ${className}`}>
      {hotspot && <Hotspot label={hotspot.label} className={hotspot.className} />}
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-sg-text">{title}</p>
          {action && <span className="cursor-pointer text-xs font-medium text-sg-primary hover:underline">{action}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- screens ---------- */
export function DashboardScreen() {
  const mods = [
    { icon: Layers, t: "Requirements Consolidation", d: "One framework across 7 regimes" },
    { icon: Activity, t: "Risk & Readiness", d: "Honest scores, live posture" },
    { icon: BarChart3, t: "Strategy & Roadmap", d: "Your 12-month plan" },
    { icon: Bot, t: "Virtual Cyber Advisor", d: "Ask anything, any time" },
    { icon: ShieldCheck, t: "Frameworks", d: "ISO 27001 · CyFun · NIS2 · CRA" },
    { icon: ClipboardCheck, t: "Self-Assessment", d: "7 of 9 sections complete" },
  ];
  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-sg-text">Jump to any module</h3>
          <p className="text-xs text-sg-muted">Demo Company Ltd · Last assessment 3 days ago</p>
        </div>
        <Chip tone="green">On track</Chip>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {mods.map((m, i) => (
          <Card key={m.t} hotspot={i === 0 ? { label: "Every obligation merged into one prioritised control set.", className: "-right-1 -top-1" } : undefined}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sg-tint">
              <m.icon className="h-4.5 w-4.5 h-[18px] w-[18px] text-sg-primary" strokeWidth={1.8} />
            </div>
            <p className="mt-3 text-sm font-semibold text-sg-text">{m.t}</p>
            <p className="mt-0.5 text-xs text-sg-muted">{m.d}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function MonitoringScreen() {
  const regs = [
    { n: "NIS2", s: 41, t: "amber" as const }, { n: "GDPR", s: 63, t: "green" as const },
    { n: "ISO 27001", s: 52, t: "amber" as const }, { n: "CRA", s: 18, t: "red" as const },
  ];
  const lacking = [
    { r: "Multi-factor authentication for remote access", n: "NIS2 Art. 21", l: "Critical", s: "Not demonstrated" },
    { r: "Incident response plan tested annually", n: "ISO 27001 A.5.26", l: "High", s: "Pending" },
    { r: "Supplier security reviews", n: "GDPR Art. 28", l: "Medium", s: "Active" },
    { r: "Cryptography policy", n: "NIS2 Art. 21", l: "High", s: "Pending" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Card
        className="lg:col-span-2"
        title="Assurance score"
        hotspot={{ label: "Honest scoring: a floor, not a ceiling — the gap is what we haven't asked about yet.", className: "right-3 top-3" }}
      >
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="font-heading text-4xl font-extrabold text-sg-red">6.3% <span className="text-base font-semibold">assured</span></p>
            <div className="mt-2"><Chip tone="red">Not demonstrated</Chip></div>
          </div>
          <div className="min-w-[220px] flex-1 space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-[11px] text-sg-muted"><span>Of what we measured</span><span>50%</span></div>
              <Bar pct={50} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-[11px] text-sg-muted"><span>How much we can measure</span><span>12.5%</span></div>
              <Bar pct={12.5} tone="bg-sg-electric" />
            </div>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-sg-canvas p-3 text-xs leading-relaxed text-sg-muted">
          This is a floor, not a ceiling. The gap is what we haven't asked about yet — not something you are failing.
        </p>
        <p className="mt-3 text-xs font-semibold text-sg-text">What would move it most</p>
        <ul className="mt-2 space-y-1.5 text-xs text-sg-muted">
          {["Complete the access-control section", "Upload your incident response plan", "Answer 4 supplier questions"].map((x) => (
            <li key={x} className="flex items-center gap-2"><ChevronRight className="h-3 w-3 text-sg-primary" />{x}</li>
          ))}
        </ul>
      </Card>

      <div className="space-y-3">
        <Card title="Compliance Index">
          <div className="flex items-center gap-4">
            <Donut pct={78} size={64} />
            <div>
              <Chip tone="amber">Medium</Chip>
              <p className="mt-1.5 text-[11px] leading-snug text-sg-muted">Up 6 points this month across all frameworks.</p>
            </div>
          </div>
        </Card>
        <Card title="Why these apply" hotspot={{ label: "Every regulation comes with its reasoning — no black box.", className: "right-3 top-3" }}>
          <ul className="space-y-1.5 text-[11px] text-sg-muted">
            <li className="flex gap-1.5"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-sg-green" />NIS2 — 50+ staff, essential-services supply chain</li>
            <li className="flex gap-1.5"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-sg-green" />GDPR — processing EU personal data</li>
            <li className="flex gap-1.5"><AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-sg-amber" />2 rules cannot be checked yet</li>
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:col-span-3 lg:grid-cols-4">
        {regs.map((r) => (
          <Card key={r.n}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-sg-text">{r.n}</p>
              <Chip tone={r.t}>{r.t === "red" ? "Critical" : r.t === "amber" ? "Medium" : "Active"}</Chip>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-sg-text">{r.s}%</p>
            <div className="mt-1.5"><Bar pct={r.s} tone={r.t === "red" ? "bg-sg-red" : r.t === "amber" ? "bg-sg-amber" : "bg-sg-green"} /></div>
          </Card>
        ))}
      </div>

      <Card className="lg:col-span-3" title="Top Lacking Requirements" action="See All">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E3F5] text-[10px] uppercase tracking-wider text-sg-muted">
                <th className="pb-2 pr-4 font-medium">Requirement</th><th className="pb-2 pr-4 font-medium">Needed for</th><th className="pb-2 pr-4 font-medium">Level</th><th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lacking.map((r) => (
                <tr key={r.r} className="border-b border-[#E9E3F5]/60 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-sg-text">{r.r}</td>
                  <td className="py-2.5 pr-4 text-sg-muted">{r.n}</td>
                  <td className="py-2.5 pr-4"><Chip tone={r.l === "Critical" ? "red" : r.l === "High" ? "amber" : "purple"}>{r.l}</Chip></td>
                  <td className="py-2.5"><Chip tone={r.s === "Active" ? "green" : r.s === "Pending" ? "amber" : "red"}>{r.s}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function AlertsScreen() {
  const [reg, setReg] = useState(0);
  const regs = ["NIS2", "GDPR", "DORA"];
  const domains = [
    { n: "Governance", f: 3, p: 62 }, { n: "Security", f: 8, p: 41 },
    { n: "Incident", f: 2, p: 70 }, { n: "Supervision", f: 0, p: 100 }, { n: "Enforcement", f: 1, p: 85 },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-sg-text">Alert Center</h3>
          <p className="text-xs text-sg-muted">Open findings by regulation and domain</p>
        </div>
        <span className="font-mono text-xs text-sg-muted">{regs[reg]} · {reg + 1}/{regs.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {domains.map((d, i) => (
          <Card key={d.n} hotspot={i === 1 ? { label: "Findings are grouped by domain so you always know who owns the fix.", className: "-right-1 -top-1" } : undefined}>
            <Donut pct={Math.max(4, d.p - reg * 9)} size={44} color={d.f > 5 ? "#DC2626" : d.f > 0 ? "#B7791F" : "#15803D"} />
            <p className="mt-2 text-xs font-semibold text-sg-text">{d.n}</p>
            <p className="text-[11px] text-sg-muted">{Math.max(0, d.f - reg)} findings</p>
          </Card>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Regulation">
        {regs.map((r, i) => (
          <button
            key={r}
            role="tab"
            aria-selected={reg === i}
            data-testid={`alerts-dot-${r.toLowerCase()}`}
            onClick={() => setReg(i)}
            className={`h-2 rounded-full transition-all ${reg === i ? "w-6 bg-sg-primary" : "w-2 bg-sg-violet-400/40 hover:bg-sg-violet-400"}`}
            aria-label={r}
          />
        ))}
      </div>
    </div>
  );
}

export function FrameworksScreen() {
  const frameworks = [
    { n: "ISO 27001", d: "Information security management", pct: 72, c: "93 Annex A controls", tone: "green" as const, chip: "On track" },
    { n: "CyFun", d: "CyberFundamentals · Important level", pct: 64, c: "Basic → Essential levels", tone: "purple" as const, chip: "In progress" },
    { n: "NIS2", d: "Incl. national transposition", pct: 58, c: "Art. 21 risk measures", tone: "amber" as const, chip: "Gaps found" },
    { n: "Cyber Resilience Act", d: "Products with digital elements", pct: 41, c: "Annex I requirements", tone: "amber" as const, chip: "Early stage" },
  ];
  return (
    <div>
      <h3 className="mb-1 font-heading text-lg font-bold text-sg-text">Frameworks</h3>
      <p className="mb-4 text-xs text-sg-muted">Every framework in scope, measured against one shared control set.</p>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {frameworks.map((f, i) => (
          <Card key={f.n} hotspot={i === 0 ? { label: "Readiness per framework — one control can count towards several at once.", className: "-right-1 -top-1" } : undefined}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-sg-text">{f.n}</p>
                <p className="mt-0.5 text-[11px] text-sg-muted">{f.d}</p>
              </div>
              <Donut pct={f.pct} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-sg-muted">{f.c}</span>
              <Chip tone={f.tone}>{f.chip}</Chip>
            </div>
          </Card>
        ))}
      </div>
      <Card title="Framework mapping" hotspot={{ label: "Implement MFA once — it evidences ISO 27001, CyFun, NIS2 and the CRA at the same time.", className: "right-3 top-3" }}>
        <svg viewBox="0 0 640 260" className="w-full" role="img" aria-label="Diagram: MFA control maps to ISO 27001, CyFun, NIS2 and the Cyber Resilience Act">
          <defs>
            <linearGradient id="sg-sankey" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4C1B8C" /><stop offset="1" stopColor="#0A84FF" />
            </linearGradient>
          </defs>
          {[28, 96, 164, 232].map((y2, i) => (
            <path
              key={i}
              d={`M 210 130 C 330 130, 330 ${y2}, 430 ${y2}`}
              fill="none" stroke="url(#sg-sankey)" strokeWidth="9" strokeOpacity="0.35" strokeLinecap="round"
              className="sankey-flow"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
          <style>{`@keyframes sankeypulse { 0%,100% { stroke-opacity: .18; } 50% { stroke-opacity: .55; } } .sankey-flow { animation: sankeypulse 2.8s ease-in-out infinite; }`}</style>
          <g>
            <rect x="20" y="96" width="190" height="68" rx="12" fill="#4C1B8C" />
            <text x="115" y="124" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">Multi-Factor Auth</text>
            <text x="115" y="144" textAnchor="middle" fill="#CFC4E4" fontSize="10">SecureGov control SG-AC-04</text>
          </g>
          {[
            { y: 4, t: "ISO 27001 Annex A", s: "A.5.17 Authentication" },
            { y: 72, t: "CyFun", s: "Identity & access control" },
            { y: 140, t: "NIS2 Article 21", s: "21(2)(j) MFA / crypto" },
            { y: 208, t: "Cyber Resilience Act", s: "Annex I · access control" },
          ].map((n) => (
            <g key={n.t}>
              <rect x="430" y={n.y} width="190" height="48" rx="10" fill="#fff" stroke="#E9E3F5" />
              <rect x="430" y={n.y} width="5" height="48" rx="2.5" fill="#4C1B8C" />
              <text x="448" y={n.y + 20} fill="#1B1523" fontSize="12" fontWeight="700">{n.t}</text>
              <text x="448" y={n.y + 37} fill="#6E608A" fontSize="10">{n.s}</text>
            </g>
          ))}
        </svg>
      </Card>
    </div>
  );
}

export function AdvisorScreen() {
  const [active, setActive] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const play = (key: string) => {
    if (timer.current) clearInterval(timer.current);
    setActive(key); setText(""); setDone(false);
    const full = chatScripts[key].a;
    let i = 0;
    timer.current = setInterval(() => {
      i += 3;
      setText(full.slice(0, i));
      if (i >= full.length) { if (timer.current) clearInterval(timer.current); setDone(true); }
    }, 24);
  };

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full sg-gradient-bg">
          <Bot className="h-4.5 w-4.5 h-[18px] w-[18px] text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sg-text">Virtual Cyber Advisor</p>
          <p className="text-[11px] text-sg-muted">Demo responses are illustrative.</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {Object.entries(chatScripts).map(([k, s]) => (
          <button
            key={k}
            data-testid={`chat-chip-${k}`}
            onClick={() => play(k)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              active === k ? "border-sg-primary bg-sg-primary text-white" : "border-sg-primary/30 bg-white text-sg-primary hover:bg-sg-tint"
            }`}
          >
            {s.q}
          </button>
        ))}
      </div>

      <div className="min-h-[220px] flex-1 rounded-xl border border-[#E9E3F5] bg-sg-canvas p-4">
        {active === null ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Bot className="h-8 w-8 text-sg-violet-400" />
            <p className="max-w-xs text-xs text-sg-muted">Pick a suggestion above to see how the Advisor drafts policies, summarises risks and maps controls.</p>
          </div>
        ) : (
          <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-white p-4 shadow-sm">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-sg-primary">{chatScripts[active].q}</p>
            <p className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-sg-text">
              {text}
              {!done && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-sg-primary align-middle" />}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2" title="Full assistant available in a live demo">
        <input
          data-testid="chat-input-disabled"
          disabled
          placeholder="Full assistant available in a live demo"
          className="flex-1 cursor-not-allowed rounded-lg border border-[#E9E3F5] bg-sg-canvas px-3.5 py-2.5 text-xs text-sg-muted"
        />
        <span className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg bg-sg-violet-400/40 text-white">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

export const SCREEN_META = [
  { id: "dashboard", label: "Dashboard", group: "OVERVIEW", icon: LayoutDashboard },
  { id: "monitoring", label: "Monitoring", group: "OVERVIEW", icon: Activity },
  { id: "alerts", label: "Alert Center", group: "OVERVIEW", icon: Bell },
  { id: "frameworks", label: "Frameworks", group: "COMPLIANCE", icon: Layers },
  { id: "advisor", label: "Virtual Advisor", group: "AI", icon: Bot },
] as const;

export type ScreenId = (typeof SCREEN_META)[number]["id"];

export function TourScreen({ id }: { id: ScreenId }) {
  switch (id) {
    case "dashboard": return <DashboardScreen />;
    case "monitoring": return <MonitoringScreen />;
    case "alerts": return <AlertsScreen />;
    case "frameworks": return <FrameworksScreen />;
    case "advisor": return <AdvisorScreen />;
  }
}

export { XCircle };
