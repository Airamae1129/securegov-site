import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { adminApi, errorText } from "@/lib/adminApi";

export function AccountPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");
  const change = useMutation({
    mutationFn: () => adminApi.changePassword(current, next),
    onSuccess: () => {
      setCurrent("");
      setNext("");
      setConfirm("");
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (next !== confirm) return setLocalError("The new passwords don't match.");
    if (next.length < 10) return setLocalError("Use at least 10 characters.");
    change.mutate();
  };

  const field =
    "w-full rounded-xl border border-[#DDD5EE] bg-white px-4 py-2.5 text-sm focus:border-sg-primary focus:outline-none focus:ring-2 focus:ring-sg-primary/15";

  return (
    <form onSubmit={submit} className="max-w-md rounded-2xl border border-[#E9E3F5] bg-white p-6 shadow-[0_6px_24px_rgba(34,10,67,0.04)]">
      <h2 className="font-heading text-lg font-bold text-sg-text">Change password</h2>
      <p className="mt-1 text-sm text-sg-muted">Changing it signs you out on every other device.</p>
      <label className="mb-1.5 mt-5 block text-sm font-semibold" htmlFor="pw-current">Current password</label>
      <input id="pw-current" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
      <label className="mb-1.5 mt-4 block text-sm font-semibold" htmlFor="pw-new">New password</label>
      <input id="pw-new" type="password" autoComplete="new-password" required minLength={10} value={next} onChange={(e) => setNext(e.target.value)} className={field} />
      <label className="mb-1.5 mt-4 block text-sm font-semibold" htmlFor="pw-confirm">Confirm new password</label>
      <input id="pw-confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
      {(localError || change.isError) && <p className="mt-4 text-sm text-sg-red">{localError || errorText(change.error)}</p>}
      {change.isSuccess && (
        <p className="mt-4 flex items-center gap-2 text-sm text-sg-green"><CheckCircle2 className="h-4 w-4" /> Password updated.</p>
      )}
      <button type="submit" disabled={change.isPending} className="mt-6 flex items-center gap-2 rounded-xl bg-sg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-sg-primary-600 disabled:opacity-60">
        {change.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Update password
      </button>
    </form>
  );
}
