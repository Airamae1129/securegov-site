import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus, KeyRound, Trash2, Power } from "lucide-react";
import { adminApi, errorText, type Role, type StaffUser } from "@/lib/adminApi";

const field =
  "w-full rounded-xl border border-[#DDD5EE] bg-white px-3.5 py-2.5 text-sm focus:border-sg-primary focus:outline-none focus:ring-2 focus:ring-sg-primary/15";

export function UsersPage({ me }: { me: StaffUser }) {
  const users = useQuery({ queryKey: ["admin", "users"], queryFn: adminApi.users });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="overflow-hidden rounded-2xl border border-[#E9E3F5] bg-white shadow-[0_6px_24px_rgba(34,10,67,0.04)]">
        <h2 className="border-b border-[#E9E3F5] px-6 py-4 font-heading text-[15px] font-bold">Staff accounts</h2>
        {users.isPending && <Loader2 className="m-6 h-5 w-5 animate-spin text-sg-primary" />}
        {users.isError && <p className="m-6 text-sm text-sg-red">{errorText(users.error)}</p>}
        <ul className="divide-y divide-[#F0ECF7]">
          {users.data?.map((u) => <UserRow key={u.id} user={u} isMe={u.id === me.id} />)}
        </ul>
        <p className="border-t border-[#F0ECF7] px-6 py-3 text-xs text-sg-muted">
          Admins manage staff; editors can answer messages. Resetting a password or changing a role signs that person out.
        </p>
      </section>
      <AddUserForm />
    </div>
  );
}

function UserRow({ user: u, isMe }: { user: StaffUser; isMe: boolean }) {
  const qc = useQueryClient();
  const [resetting, setResetting] = useState(false);
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const done = (msg = "") => {
    setNotice(msg);
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const update = useMutation({ mutationFn: (c: { role?: Role; active?: boolean }) => adminApi.updateUser(u.id, c), onSuccess: () => done() });
  const reset = useMutation({
    mutationFn: () => adminApi.resetPassword(u.id, password),
    onSuccess: () => { setResetting(false); setPassword(""); done("Password reset."); },
  });
  const remove = useMutation({ mutationFn: () => adminApi.deleteUser(u.id), onSuccess: () => done() });
  const error = update.error ?? reset.error ?? remove.error;

  return (
    <li className="px-6 py-4" data-testid={`admin-user-${u.email}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sg-tint text-xs font-bold text-sg-primary">
          {u.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {u.name} {isMe && <span className="font-normal text-sg-muted">(you)</span>}
          </p>
          <p className="truncate text-xs text-sg-muted">{u.email}</p>
        </div>
        {!u.active && <span className="rounded-md bg-sg-red-bg px-2 py-0.5 text-xs font-semibold text-sg-red">Deactivated</span>}
        <select
          value={u.role}
          disabled={isMe || update.isPending}
          onChange={(e) => update.mutate({ role: e.target.value as Role })}
          aria-label={`Role for ${u.name}`}
          className="rounded-lg border border-[#DDD5EE] bg-white px-2.5 py-1.5 text-sm disabled:opacity-60"
        >
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        <button onClick={() => setResetting((r) => !r)} className="rounded-lg p-2 text-sg-muted hover:bg-sg-tint hover:text-sg-primary" title="Reset password" aria-label={`Reset password for ${u.name}`}>
          <KeyRound className="h-4 w-4" />
        </button>
        {!isMe && (
          <>
            <button
              onClick={() => update.mutate({ active: !u.active })}
              className="rounded-lg p-2 text-sg-muted hover:bg-sg-tint hover:text-sg-primary"
              title={u.active ? "Deactivate" : "Reactivate"} aria-label={`${u.active ? "Deactivate" : "Reactivate"} ${u.name}`}
            >
              <Power className="h-4 w-4" />
            </button>
            <button
              onClick={() => { if (window.confirm(`Delete ${u.name}'s staff account? This can't be undone.`)) remove.mutate(); }}
              className="rounded-lg p-2 text-sg-muted hover:bg-sg-red-bg hover:text-sg-red"
              title="Delete" aria-label={`Delete ${u.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      {resetting && (
        <form
          onSubmit={(e) => { e.preventDefault(); if (password.length >= 10) reset.mutate(); }}
          className="mt-3 flex flex-wrap gap-2 pl-12"
        >
          <input
            type="password" autoComplete="new-password" minLength={10} required value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="New temporary password (10+ characters)"
            className={`${field} min-w-[220px] flex-1`} aria-label={`New password for ${u.name}`}
          />
          <button type="submit" disabled={reset.isPending} className="rounded-xl bg-sg-primary px-4 py-2 text-sm font-bold text-white hover:bg-sg-primary-600 disabled:opacity-60">
            Set password
          </button>
        </form>
      )}
      {(error || notice) && <p className={`mt-2 pl-12 text-xs ${error ? "text-sg-red" : "text-sg-green"}`}>{error ? errorText(error) : notice}</p>}
    </li>
  );
}

function AddUserForm() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", role: "editor" as Role, password: "" });
  const add = useMutation({
    mutationFn: () => adminApi.addUser(form),
    onSuccess: () => {
      setForm({ name: "", email: "", role: "editor", password: "" });
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!add.isPending) add.mutate();
  };

  return (
    <form onSubmit={submit} className="h-fit rounded-2xl border border-[#E9E3F5] bg-white p-6 shadow-[0_6px_24px_rgba(34,10,67,0.04)]" data-testid="admin-add-user">
      <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold"><UserPlus className="h-4 w-4 text-sg-primary" /> Add staff account</h2>
      <label className="mb-1.5 mt-5 block text-sm font-semibold" htmlFor="nu-name">Name</label>
      <input id="nu-name" required maxLength={120} value={form.name} onChange={set("name")} className={field} />
      <label className="mb-1.5 mt-3 block text-sm font-semibold" htmlFor="nu-email">Email</label>
      <input id="nu-email" type="email" required value={form.email} onChange={set("email")} className={field} />
      <label className="mb-1.5 mt-3 block text-sm font-semibold" htmlFor="nu-role">Role</label>
      <select id="nu-role" value={form.role} onChange={set("role")} className={field}>
        <option value="editor">Editor — answers messages</option>
        <option value="admin">Admin — also manages staff</option>
      </select>
      <label className="mb-1.5 mt-3 block text-sm font-semibold" htmlFor="nu-pw">Temporary password</label>
      <input id="nu-pw" type="password" autoComplete="new-password" required minLength={10} value={form.password} onChange={set("password")} className={field} />
      <p className="mt-1.5 text-xs text-sg-muted">Share it privately; they can change it under My account.</p>
      {add.isError && <p className="mt-3 text-sm text-sg-red">{errorText(add.error)}</p>}
      {add.isSuccess && <p className="mt-3 text-sm text-sg-green">Staff account created.</p>}
      <button type="submit" disabled={add.isPending} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sg-primary py-2.5 text-sm font-bold text-white hover:bg-sg-primary-600 disabled:opacity-60">
        {add.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Create account
      </button>
    </form>
  );
}
