// Admin-side API types and calls. Interfaces mirror the FastAPI routes in
// backend/routers/auth.py and backend/routers/admin.py — keep them in sync by hand.
import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

export type Role = "admin" | "editor";
export type Source = "contact" | "chat";
export type MessageStatus = "new" | "answered";

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  created_at: string | null;
}

export interface Reply {
  id: string;
  body: string;
  by_name: string;
  at: string;
}

export interface InboxMessage {
  id: string;
  source: Source;
  name: string;
  email: string;
  body: string | null;
  details: { label: string; value: string }[];
  status: MessageStatus;
  created_at: string;
  replies: Reply[];
}

export interface Stats {
  waiting: number;
  answered: number;
  total: number;
  contact: number;
  chat: number;
  staff: number;
  series: { date: string; contact: number; chat: number }[];
  email_alerts: { enabled: boolean; recipients: string[] };
}

export const SOURCE_LABEL: Record<Source, string> = {
  contact: "Contact form",
  chat: "Assistant chat",
};

export const adminApi = {
  me: () => apiGet<StaffUser>("/auth/me"),
  login: (email: string, password: string) => apiPost<StaffUser>("/auth/login", { email, password }),
  changePassword: (current_password: string, new_password: string) =>
    apiPost<{ ok: true }>("/auth/password", { current_password, new_password }),

  stats: () => apiGet<Stats>("/admin/stats"),
  messages: (source: "all" | Source, status: "all" | MessageStatus) =>
    apiGet<InboxMessage[]>(`/admin/messages?source=${source}&status=${status}`),
  reply: (m: InboxMessage, body: string) => apiPost<InboxMessage>(`/admin/messages/${m.source}/${m.id}/reply`, { body }),
  setStatus: (m: InboxMessage, status: MessageStatus) =>
    apiPatch<InboxMessage>(`/admin/messages/${m.source}/${m.id}`, { status }),

  users: () => apiGet<StaffUser[]>("/admin/users"),
  addUser: (u: { email: string; name: string; role: Role; password: string }) => apiPost<StaffUser>("/admin/users", u),
  updateUser: (id: string, changes: { role?: Role; active?: boolean }) => apiPatch<StaffUser>(`/admin/users/${id}`, changes),
  resetPassword: (id: string, password: string) => apiPost<{ ok: true }>(`/admin/users/${id}/password`, { password }),
  deleteUser: (id: string) => apiDelete<{ ok: true }>(`/admin/users/${id}`),
};

/** FastAPI error bodies are `{detail: string}` or a 422 `{detail: [{msg}]}` — turn either into one line. */
export function errorText(err: unknown, fallback = "Something went wrong — please try again."): string {
  const body = (err as { body?: { detail?: unknown } } | null)?.body;
  const detail = body?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0] && typeof detail[0] === "object" && "msg" in detail[0]) {
    return String((detail[0] as { msg: string }).msg).replace(/^Value error, /, "");
  }
  return fallback;
}

export function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
