import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Send, UserRound, ArrowRight, Loader2, Bot } from "lucide-react";
import { site, supportChat } from "@/content";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { scrollToId } from "@/lib/lenis";

type Faq = (typeof supportChat.faqs)[number];
// `staff` marks a reply written by a SecureGov team member in the admin inbox.
interface Msg { id: number; from: "bot" | "user"; text: string; action?: string | null; staff?: string }
interface SupportResponse { id: string; message: string; thread_token: string }
interface ThreadReply { id: string; body: string; by_name: string; at: string }
interface ThreadResponse { id: string; message: string; created_at: string; replies: ThreadReply[] }

// The visitor's last "talk to a person" conversation, so staff replies can reach this
// browser later. `seen` counts replies already shown, for the unread badge.
interface Thread { id: string; token: string; seen: number }
const THREAD_KEY = "sg-chat-thread";

function readThread(): Thread | null {
  try {
    const t = JSON.parse(localStorage.getItem(THREAD_KEY) ?? "null") as Thread | null;
    return t && typeof t.id === "string" && typeof t.token === "string" ? { ...t, seen: t.seen ?? 0 } : null;
  } catch {
    return null;
  }
}

function writeThread(t: Thread | null) {
  try {
    if (t) localStorage.setItem(THREAD_KEY, JSON.stringify(t));
    else localStorage.removeItem(THREAD_KEY);
  } catch {
    // storage blocked: replies still show while this page stays open
  }
}

const actionLabels: Record<string, string> = {
  "product-tour": "Take the product tour",
  features: "See all features",
  pricing: "View pricing",
  "how-it-works": "See how it works",
  security: "Security details",
  "use-cases": "See use cases",
};

const normalise = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Keywords must start at a word boundary ("fee" must not match "coffee"); stems like "certif" may run on.
const has = (text: string, k: string) => new RegExp(`(^|[^a-z0-9])${escapeRe(k)}`).test(text);
const isPersonal = (text: string) => supportChat.personalKeywords.some((k) => has(normalise(text), k));

// Keyword routing, no real AI: account/billing/incident questions always go to a person,
// otherwise the FAQ with the most keyword hits wins, and no hit at all hands off too.
function route(text: string): Faq | "person" {
  const t = normalise(text);
  if (isPersonal(t)) return "person";
  let best: Faq | null = null;
  let bestScore = 0;
  for (const f of supportChat.faqs) {
    const score = f.keywords.filter((k) => has(t, k)).length;
    if (score > bestScore) { best = f; bestScore = score; }
  }
  return best ?? "person";
}

let nextId = 1;

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "bot", text: supportChat.greeting }]);
  const [asked, setAsked] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [handoff, setHandoff] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [thread, setThread] = useState<Thread | null>(readThread);
  const [threadMsg, setThreadMsg] = useState("");
  const [replies, setReplies] = useState<ThreadReply[]>([]);
  const shown = useRef(new Set<string>());

  // Poll the visitor's conversation for staff replies: often while the chat is open, rarely while closed.
  const threadId = thread?.id;
  const threadToken = thread?.token;
  useEffect(() => {
    if (!threadId || !threadToken) return;
    let stopped = false;
    const load = async () => {
      try {
        const t = await apiGet<ThreadResponse>(`/support-messages/${threadId}/thread?token=${encodeURIComponent(threadToken)}`);
        if (stopped) return;
        setThreadMsg(t.message);
        setReplies(t.replies);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          writeThread(null);
          setThread(null);
        }
      }
    };
    load();
    const timer = window.setInterval(load, open ? 20_000 : 60_000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [threadId, threadToken, open]);

  // While open, show the conversation and any staff replies not yet on screen, and mark them read.
  useEffect(() => {
    if (!open || !thread) return;
    const add: Omit<Msg, "id">[] = [];
    if (threadMsg && !shown.current.has("origin")) {
      shown.current.add("origin");
      add.push({ from: "user", text: threadMsg });
    }
    for (const r of replies) {
      if (shown.current.has(r.id)) continue;
      shown.current.add(r.id);
      add.push({ from: "bot", text: r.body, staff: r.by_name });
    }
    if (add.length) setMsgs((p) => [...p, ...add.map((m) => ({ ...m, id: nextId++ }))]);
    if (replies.length !== thread.seen) {
      const t = { ...thread, seen: replies.length };
      writeThread(t);
      setThread(t);
    }
  }, [open, thread, threadMsg, replies]);

  const unread = !open && thread ? Math.max(0, replies.length - thread.seen) : 0;

  // A fresh bot answer scrolls to its own top so the options below don't push it out of view.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const last = msgs[msgs.length - 1];
    const lastEl = el.querySelector<HTMLElement>(`[data-msg="${last.id}"]`);
    const top = !typing && last.from === "bot" && lastEl && msgs.length > 1 && !handoff
      ? lastEl.offsetTop - 12
      : el.scrollHeight;
    el.scrollTo({ top, behavior: "smooth" });
  }, [msgs, typing, handoff]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("sg-open-chat", openChat);
    return () => window.removeEventListener("sg-open-chat", openChat);
  }, []);

  const push = (m: Omit<Msg, "id">) => setMsgs((p) => [...p, { ...m, id: nextId++ }]);

  const botReply = (text: string, action?: string | null, then?: () => void) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push({ from: "bot", text, action });
      then?.();
    }, 700);
  };

  const askFaq = (f: Faq) => {
    if (typing) return;
    setHandoff(false);
    push({ from: "user", text: f.q });
    setAsked((a) => (a.includes(f.id) ? a : [...a, f.id]));
    botReply(f.a, f.action);
  };

  const askPerson = (userText = "Talk to a person instead", intro = supportChat.handoffIntro) => {
    if (typing) return;
    push({ from: "user", text: userText });
    botReply(intro, null, () => setHandoff(true));
  };

  const submitTyped = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    const hit = route(text);
    if (hit === "person") {
      setNote((n) => n || text);
      askPerson(text, isPersonal(text) ? supportChat.handoffIntro : supportChat.fallback);
    } else {
      setHandoff(false);
      push({ from: "user", text });
      setAsked((a) => (a.includes(hit.id) ? a : [...a, hit.id]));
      botReply(hit.a, hit.action);
    }
  };

  const submitHandoff = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await apiPost<SupportResponse>("/support-messages", {
        name, email, message: note, consent,
      });
      setHandoff(false);
      setSent(true);
      push({ from: "user", text: note });
      push({ from: "bot", text: res.message });
      // Remember the conversation so a staff reply from the admin inbox lands back here.
      const t = { id: res.id, token: res.thread_token, seen: 0 };
      shown.current = new Set(["origin"]);
      writeThread(t);
      setThread(t);
      setReplies([]);
    } catch (err) {
      push({
        from: "bot",
        text: err instanceof ApiError && err.status === 422
          ? "Please check your details and try again."
          : `I couldn't send that just now — please email ${site.email} or call ${site.phone} and the team will help.`,
      });
    } finally {
      setSending(false);
    }
  };

  const goTo = (id: string) => {
    if (window.innerWidth < 640) setOpen(false);
    scrollToId(id);
  };

  const remaining = supportChat.faqs.filter((f) => !asked.includes(f.id));
  const field =
    "w-full rounded-lg border border-sg-violet-400/25 bg-sg-ink-950/70 px-3 py-2 text-sm text-white placeholder:text-sg-violet-300/40 focus:border-sg-violet-400 focus:outline-none";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="support-chat-panel"
            role="dialog"
            aria-label={`Chat with ${supportChat.agent}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-[88] flex h-[min(620px,calc(100dvh-8rem))] w-[min(390px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-sg-violet-400/25 bg-sg-ink-950 shadow-2xl shadow-black/50 sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-sg-violet-400/15 bg-sg-ink-900 px-4 py-3.5">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sg-violet-400 to-sg-primary font-heading text-base font-bold text-white">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-bold leading-tight text-white">{supportChat.agent}</p>
                <p className="flex items-center gap-1.5 text-[11px] leading-snug text-sg-violet-300/80">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                  {supportChat.status}
                </p>
              </div>
              <button
                data-testid="support-chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-1.5 text-sg-violet-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conversation + options */}
            <div ref={scrollRef} data-lenis-prevent className="relative flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
              {msgs.map((m) => (
                <div key={m.id} data-msg={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-md bg-sg-primary text-white"
                        : m.staff
                          ? "rounded-bl-md border border-sg-violet-400/50 bg-sg-primary/25 text-white"
                          : "rounded-bl-md border border-sg-violet-400/15 bg-white/[0.06] text-sg-body-dark"
                    }`}
                    data-testid={m.staff ? "support-staff-reply" : undefined}
                  >
                    {m.staff && (
                      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-sg-violet-400">
                        {m.staff} · SecureGov team
                      </span>
                    )}
                    {m.text}
                    {m.action && actionLabels[m.action] && (
                      <button
                        onClick={() => goTo(m.action!)}
                        className="mt-2 flex items-center gap-1 text-xs font-semibold text-sg-violet-400 transition-colors hover:text-white"
                      >
                        {actionLabels[m.action]} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start" aria-label="Assistant is typing">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-sg-violet-400/15 bg-white/[0.06] px-4 py-3">
                    <span className="sg-typing-dot h-1.5 w-1.5 rounded-full bg-sg-violet-300" />
                    <span className="sg-typing-dot h-1.5 w-1.5 rounded-full bg-sg-violet-300" />
                    <span className="sg-typing-dot h-1.5 w-1.5 rounded-full bg-sg-violet-300" />
                  </div>
                </div>
              )}

              {handoff && !typing && (
                <form onSubmit={submitHandoff} data-testid="support-handoff-form"
                  className="space-y-2.5 rounded-2xl border border-sg-violet-400/25 bg-sg-ink-900/70 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <UserRound className="h-3.5 w-3.5 text-sg-violet-400" /> Message the team
                  </p>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    aria-label="Your name" maxLength={120} className={field} data-testid="support-handoff-name" />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email"
                    aria-label="Work email" className={field} data-testid="support-handoff-email" />
                  <textarea required value={note} onChange={(e) => setNote(e.target.value)} placeholder="How can we help?"
                    aria-label="Your message" rows={3} maxLength={2000} className={`${field} resize-none`} data-testid="support-handoff-message" />
                  <label className="flex items-start gap-2 text-[11px] leading-snug text-sg-violet-300/80">
                    <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 accent-sg-violet-400" data-testid="support-handoff-consent" />
                    I agree to CyberHealth using these details to reply to my message (GDPR).
                  </label>
                  <button type="submit" disabled={sending} data-testid="support-handoff-submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-sg-primary py-2 text-sm font-semibold text-white transition-colors hover:bg-sg-primary-600 disabled:opacity-60">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send to the team
                  </button>
                </form>
              )}

              {!typing && !handoff && (
                <div className="space-y-2 pt-1" data-testid="support-chat-options">
                  {remaining.map((f) => (
                    <button
                      key={f.id}
                      data-testid={`support-faq-${f.id}`}
                      onClick={() => askFaq(f)}
                      className="block w-full rounded-xl border border-sg-violet-400/25 bg-white/[0.03] px-3.5 py-2.5 text-left text-sm font-semibold text-white transition-colors hover:border-sg-violet-400 hover:bg-sg-primary/30"
                    >
                      {f.q}
                    </button>
                  ))}
                  {!sent && (
                    <button
                      data-testid="support-talk-to-person"
                      onClick={() => askPerson()}
                      className="block w-full rounded-xl border border-sg-amber/60 bg-sg-amber/10 px-3.5 py-2.5 text-left text-sm font-semibold text-amber-200 transition-colors hover:border-amber-300 hover:bg-sg-amber/20"
                    >
                      Talk to a person instead
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-sg-violet-400/15 bg-sg-ink-900/60 px-3 pb-3 pt-2.5">
              <form onSubmit={submitTyped} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  aria-label="Type your question"
                  maxLength={500}
                  data-testid="support-chat-input"
                  className={field}
                />
                <button type="submit" aria-label="Send" disabled={!input.trim() || typing}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sg-primary text-white transition-colors hover:bg-sg-primary-600 disabled:opacity-40">
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-2 text-[11px] leading-snug text-sg-violet-300/50">{supportChat.footnote}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        data-testid="support-chat-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : `Chat with ${supportChat.agent}`}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-[88] flex h-14 w-14 items-center justify-center rounded-full bg-sg-primary text-white shadow-xl shadow-sg-primary/40 transition-transform hover:scale-105 hover:bg-sg-primary-600 sm:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && unread > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-sg-ink-950 bg-sg-amber px-1 text-[10px] font-bold text-white"
            data-testid="support-chat-unread"
            aria-label={`${unread} new ${unread === 1 ? "reply" : "replies"} from the team`}
          >
            {unread}
          </span>
        )}
        {!open && unread === 0 && <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-sg-ink-950 bg-emerald-400" aria-hidden="true" />}
      </button>
    </>
  );
}
