import { useState, type FormEvent } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { adminApi, errorText } from "@/lib/adminApi";
import { beginSession } from "@/lib/session";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await adminApi.login(email, password);
      beginSession();
      // Hard reload, mirroring endSession(): the cleared cache detaches the `me` query this
      // page is waiting on, and a fresh load re-reads the session cookie cleanly.
      window.location.assign(window.location.pathname);
    } catch (err) {
      setError(errorText(err, "Could not reach the server — please try again."));
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-xl border border-[#DDD5EE] bg-white px-4 py-3 text-sm text-sg-text placeholder:text-sg-muted/60 focus:border-sg-primary focus:outline-none focus:ring-2 focus:ring-sg-primary/15";

  return (
    <div className="flex min-h-screen bg-white">
      {/* brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-sg-ink-950 p-12 lg:flex">
        <div className="sg-hex-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-sg-primary/40 blur-[120px]" aria-hidden="true" />

        <div className="relative flex items-center gap-3">
          <Logo variant="white" withWordmark={false} className="[&_svg]:h-10 [&_svg]:w-10" />
          <div className="leading-tight">
            <p className="font-heading text-lg font-extrabold tracking-[0.12em] text-white">SECUREGOV</p>
            <p className="font-mono text-[10px] tracking-[0.28em] text-sg-violet-400">ADMIN CONSOLE</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] text-white">
            Run the demo site
            <br />
            <span className="text-sg-violet-400">from one place.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-sg-body-dark/85">
            Demo requests from the contact form and conversations from the SecureGov Assistant — every visitor message is
            answered here.
          </p>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-sg-violet-300/70">
          <ShieldCheck className="h-4 w-4 text-sg-violet-400" /> SecureGov staff only · sessions expire after 12 hours
        </p>
      </div>

      {/* sign-in form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm" data-testid="admin-login-form">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo variant="color" withWordmark={false} className="[&_svg]:h-9 [&_svg]:w-9" />
            <p className="font-heading text-lg font-extrabold tracking-[0.12em] text-sg-primary">SECUREGOV</p>
          </div>
          <h2 className="font-heading text-3xl font-extrabold text-sg-text">Sign in</h2>
          <p className="mt-1.5 text-sm text-sg-muted">Use your SecureGov staff account.</p>

          <label htmlFor="admin-email" className="mb-1.5 mt-8 block text-sm font-semibold text-sg-text">Email</label>
          <input
            id="admin-email" type="email" autoComplete="username" required value={email}
            onChange={(e) => setEmail(e.target.value)} className={field} data-testid="admin-login-email"
          />
          <label htmlFor="admin-password" className="mb-1.5 mt-4 block text-sm font-semibold text-sg-text">Password</label>
          <input
            id="admin-password" type="password" autoComplete="current-password" required value={password}
            onChange={(e) => setPassword(e.target.value)} className={field} data-testid="admin-login-password"
          />

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-sg-red-bg px-3.5 py-2.5 text-sm text-sg-red" data-testid="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={busy} data-testid="admin-login-submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sg-primary to-sg-primary-600 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgba(124,77,219,0.35)] transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
          <p className="mt-5 text-xs text-sg-muted">Forgotten password? An administrator can reset it under Users.</p>
        </form>
      </div>
    </div>
  );
}
