import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, RotateCcw, Send, CheckCircle2, Inbox } from "lucide-react";
import {
  adminApi,
  errorText,
  formatWhen,
  SOURCE_LABEL,
  type InboxMessage,
  type MessageStatus,
  type Source,
} from "@/lib/adminApi";

type SourceFilter = "all" | Source;
type StatusFilter = "all" | MessageStatus;

const SOURCE_TABS: { value: SourceFilter; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "contact", label: "Contact form" },
  { value: "chat", label: "Assistant chat" },
];
const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "Waiting" },
  { value: "answered", label: "Answered" },
];

export function MessagesPage() {
  const [source, setSource] = useState<SourceFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const messages = useQuery({
    queryKey: ["admin", "messages", source, status],
    queryFn: () => adminApi.messages(source, status),
    refetchInterval: 30_000,
  });

  return (
    <div className="space-y-5">
      <p className="text-sm text-sg-muted">
        Everything from the contact form and the SecureGov Assistant chat lands here. Replying to a chat message puts your
        answer straight into the visitor's chat window.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Segmented value={source} options={SOURCE_TABS} onChange={setSource} testId="admin-filter-source" />
        <Segmented value={status} options={STATUS_TABS} onChange={setStatus} testId="admin-filter-status" />
      </div>

      {messages.isPending && <Loader2 className="h-5 w-5 animate-spin text-sg-primary" aria-label="Loading messages" />}
      {messages.isError && <p className="rounded-xl bg-sg-red-bg p-4 text-sm text-sg-red">Couldn't load messages — {errorText(messages.error)}</p>}
      {messages.data?.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#DDD5EE] bg-white py-16 text-center">
          <Inbox className="h-8 w-8 text-sg-violet-400" />
          <p className="mt-3 font-semibold text-sg-text">No messages here</p>
          <p className="mt-1 text-sm text-sg-muted">New contact-form and chat messages will appear automatically.</p>
        </div>
      )}
      <div className="space-y-4">
        {messages.data?.map((m) => <MessageCard key={`${m.source}-${m.id}`} message={m} />)}
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  value, options, onChange, testId,
}: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; testId: string }) {
  return (
    <div className="inline-flex rounded-xl border border-[#E9E3F5] bg-white p-1" role="tablist" data-testid={testId}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            value === o.value ? "bg-sg-primary text-white" : "text-sg-muted hover:text-sg-primary"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MessageCard({ message: m }: { message: InboxMessage }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });

  const reply = useMutation({
    mutationFn: (body: string) => adminApi.reply(m, body),
    onSuccess: () => {
      setDraft("");
      refresh();
    },
  });
  const toggle = useMutation({
    mutationFn: () => adminApi.setStatus(m, m.status === "answered" ? "new" : "answered"),
    onSuccess: refresh,
  });

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (draft.trim() && !reply.isPending) reply.mutate(draft.trim());
  };

  const answered = m.status === "answered";
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E9E3F5] bg-white shadow-[0_6px_24px_rgba(34,10,67,0.04)]" data-testid={`admin-message-${m.id}`}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-[#F0ECF7] px-5 py-3.5">
        <p className="font-heading font-bold text-sg-text">{m.name}</p>
        <a href={`mailto:${m.email}`} className="text-sm text-sg-muted hover:text-sg-primary">{m.email}</a>
        <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
          m.source === "chat" ? "bg-sg-tint text-sg-primary" : "bg-[#EDE7FB] text-sg-primary-600"
        }`}>
          {SOURCE_LABEL[m.source]}
        </span>
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${answered ? "bg-sg-green-bg text-sg-green" : "bg-sg-amber-bg text-sg-amber"}`}>
          {answered ? "Answered" : "Waiting"}
        </span>
        <span className="ml-auto text-xs text-sg-muted">{formatWhen(m.created_at)}</span>
      </header>

      <div className="space-y-3 bg-sg-canvas/60 px-5 py-4">
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-sg-ink-900 px-4 py-3 text-sm text-white">
          {m.body && <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>}
          {m.details.length > 0 && (
            <>
              <p className="font-semibold">Demo request</p>
              <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[13px]">
                {m.details.map((d) => (
                  <div key={d.label} className="contents">
                    <dt className="text-sg-violet-300/80">{d.label}</dt>
                    <dd>{d.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
        {m.replies.map((r) => (
          <div key={r.id} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md border border-sg-primary/30 bg-white px-4 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-sg-primary">
              {r.by_name}, SecureGov · <span className="font-normal normal-case tracking-normal text-sg-muted">{formatWhen(r.at)}</span>
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-sg-text">{r.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex flex-wrap items-center gap-2 border-t border-[#F0ECF7] px-5 py-3.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={m.source === "chat" ? "Write your reply — the visitor sees it in their chat…" : "Write a reply note…"}
          aria-label={`Reply to ${m.name}`}
          maxLength={4000}
          className="min-w-[220px] flex-1 rounded-xl border border-[#DDD5EE] px-4 py-2.5 text-sm focus:border-sg-primary focus:outline-none focus:ring-2 focus:ring-sg-primary/15"
          data-testid={`admin-reply-input-${m.id}`}
        />
        <button
          type="submit" disabled={!draft.trim() || reply.isPending}
          className="flex items-center gap-2 rounded-xl bg-sg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sg-primary-600 disabled:opacity-50"
          data-testid={`admin-reply-send-${m.id}`}
        >
          {reply.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
        </button>
        <button
          type="button" onClick={() => toggle.mutate()} disabled={toggle.isPending}
          className="flex items-center gap-1.5 rounded-xl border border-[#DDD5EE] px-3.5 py-2.5 text-sm font-semibold text-sg-muted transition-colors hover:border-sg-primary hover:text-sg-primary"
        >
          {answered ? <><RotateCcw className="h-4 w-4" /> Reopen</> : <><CheckCircle2 className="h-4 w-4" /> Mark answered</>}
        </button>
        {m.source === "contact" && (
          <a
            href={`mailto:${m.email}?subject=${encodeURIComponent("Your SecureGov demo request")}`}
            className="flex items-center gap-1.5 rounded-xl border border-[#DDD5EE] px-3.5 py-2.5 text-sm font-semibold text-sg-muted transition-colors hover:border-sg-primary hover:text-sg-primary"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        )}
        {m.source === "contact" && (
          <p className="w-full text-[11px] text-sg-muted">Contact-form visitors don't see replies on the site — notes are kept here; use Email to reach them.</p>
        )}
        {(reply.isError || toggle.isError) && (
          <p className="w-full text-xs text-sg-red">{errorText(reply.error ?? toggle.error)}</p>
        )}
      </form>
    </article>
  );
}
