import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Inbox, FileText, MessageCircle, CheckCircle2, Users, ArrowRight, Mail } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminApi } from "@/lib/adminApi";

const CONTACT_COLOR = "#4C1B8C";
const CHAT_COLOR = "#A98BF0";

export function DashboardPage() {
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: adminApi.stats, refetchInterval: 30_000 });
  const s = stats.data;

  const cards = [
    { icon: Inbox, value: s?.waiting, label: "Waiting messages", sub: s ? `${s.total} total` : "", accent: true },
    { icon: FileText, value: s?.contact, label: "Contact form", sub: "Demo requests" },
    { icon: MessageCircle, value: s?.chat, label: "Assistant chat", sub: "Talk-to-a-person" },
    { icon: CheckCircle2, value: s?.answered, label: "Answered", sub: "" },
    { icon: Users, value: s?.staff, label: "Staff accounts", sub: "" },
  ];

  const series = (s?.series ?? []).map((d) => ({
    ...d,
    label: new Date(`${d.date}T00:00:00`).toLocaleDateString(undefined, { day: "2-digit", month: "short" }),
  }));
  const max = Math.max(1, s?.contact ?? 0, s?.chat ?? 0);

  if (stats.isError) {
    return <p className="rounded-xl bg-sg-red-bg p-4 text-sm text-sg-red">Couldn't load the dashboard. Check the database connection and refresh.</p>;
  }

  return (
    <div className="space-y-6">
      {s && (
        <p
          data-testid="admin-email-alerts"
          className={`flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            s.email_alerts.enabled ? "border-sg-green/20 bg-sg-green-bg text-sg-green" : "border-sg-amber/25 bg-sg-amber-bg text-sg-amber"
          }`}
        >
          <Mail className="h-4 w-4 shrink-0" />
          {s.email_alerts.enabled ? (
            <>Email alerts are on — new inquiries are emailed to <strong>{s.email_alerts.recipients.join(", ")}</strong>.</>
          ) : (
            <>Email alerts are off. Set the SMTP settings (SMTP_HOST, SMTP_FROM, NOTIFY_EMAILS…) on the server to get an email for every new inquiry.</>
          )}
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-[#E9E3F5] bg-white p-5 shadow-[0_6px_24px_rgba(34,10,67,0.04)]" data-testid={`admin-stat-${c.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.accent ? "bg-sg-primary text-white" : "bg-sg-tint text-sg-primary"}`}>
              <c.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
            <p className="mt-4 font-heading text-3xl font-extrabold text-sg-text">{c.value ?? "–"}</p>
            <p className="text-sm font-medium text-sg-muted">{c.label}</p>
            {c.sub && <p className="text-[11px] text-sg-muted/70">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-[#E9E3F5] bg-white shadow-[0_6px_24px_rgba(34,10,67,0.04)]">
          <h2 className="border-b border-[#E9E3F5] px-6 py-4 font-heading text-[15px] font-bold text-sg-text">Messages received — last 14 days</h2>
          <div className="h-72 px-3 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE9FF" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6E608A" }} tickLine={false} axisLine={{ stroke: "#E9E3F5" }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6E608A" }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#F4F0FD" }} contentStyle={{ borderRadius: 12, border: "1px solid #E9E3F5", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="contact" name="Contact form" stackId="m" fill={CONTACT_COLOR} radius={[0, 0, 0, 0]} maxBarSize={28} />
                <Bar dataKey="chat" name="Assistant chat" stackId="m" fill={CHAT_COLOR} radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E9E3F5] bg-white p-6 shadow-[0_6px_24px_rgba(34,10,67,0.04)]">
          <h2 className="font-heading text-[15px] font-bold text-sg-text">Messages by source</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: "Contact form", value: s?.contact ?? 0, color: CONTACT_COLOR },
              { label: "Assistant chat", value: s?.chat ?? 0, color: CHAT_COLOR },
            ].map((r) => (
              <div key={r.label} className="grid grid-cols-[110px_1fr_28px] items-center gap-3 text-sm">
                <span className="font-medium text-sg-text">{r.label}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-sg-tint">
                  <span className="block h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: r.color }} />
                </span>
                <span className="text-right font-bold text-sg-text">{r.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-sg-muted">Includes answered messages. Reply to them under Messages.</p>
          <Link to="/admin/messages" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sg-primary hover:text-sg-primary-600">
            Open messages <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
