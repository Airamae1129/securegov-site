import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, Inbox, Users, KeyRound, LogOut, ExternalLink, Menu, X, Loader2 } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { adminApi, type StaffUser } from "@/lib/adminApi";
import { endSession } from "@/lib/session";
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";
import { MessagesPage } from "./MessagesPage";
import { UsersPage } from "./UsersPage";
import { AccountPage } from "./AccountPage";

const NAV = [
  { to: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { to: "messages", label: "Messages", icon: Inbox, adminOnly: false },
  { to: "users", label: "Users", icon: Users, adminOnly: true },
  { to: "account", label: "My account", icon: KeyRound, adminOnly: false },
];

const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  messages: "Messages",
  users: "Users",
  account: "My account",
};

export default function AdminApp() {
  const me = useQuery({ queryKey: ["admin", "me"], queryFn: adminApi.me, retry: false });

  useEffect(() => {
    const prev = document.title;
    document.title = "SecureGov Admin";
    return () => { document.title = prev; };
  }, []);

  if (me.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sg-ink-950">
        <Loader2 className="h-6 w-6 animate-spin text-sg-violet-400" aria-label="Loading" />
      </div>
    );
  }
  if (me.isError || !me.data) return <LoginPage />;
  return <AdminShell user={me.data} />;
}

function AdminShell({ user }: { user: StaffUser }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const section = location.pathname.split("/")[2] || "dashboard";
  const nav = NAV.filter((n) => !n.adminOnly || user.role === "admin");

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-sg-canvas text-sg-text lg:flex">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sg-ink-950 transition-transform duration-300 lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between px-5 pb-6 pt-6">
          <div className="flex items-center gap-2.5">
            <Logo variant="white" withWordmark={false} className="[&_svg]:h-8 [&_svg]:w-8" />
            <div className="leading-tight">
              <p className="font-heading text-[15px] font-extrabold tracking-[0.12em] text-white">SECUREGOV</p>
              <p className="font-mono text-[10px] tracking-[0.24em] text-sg-violet-400">ADMIN</p>
            </div>
          </div>
          <button className="text-sg-violet-300 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={`/admin/${n.to}`}
              data-testid={`admin-nav-${n.to}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-sg-primary to-sg-primary-600 font-semibold text-white shadow-[0_6px_24px_rgba(124,77,219,0.35)]"
                    : "text-sg-body-dark/80 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <n.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 pb-5 pt-4">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-[11px] text-sg-violet-300/70">
            {user.email} · {user.role}
          </p>
          <button
            data-testid="admin-sign-out"
            onClick={() => endSession("/admin")}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2 text-sm font-semibold text-white transition-colors hover:border-sg-violet-400 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      {menuOpen && <div className="fixed inset-0 z-30 bg-sg-ink-950/60 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      {/* main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E9E3F5] bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="text-sg-text lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-heading text-xl font-extrabold text-sg-text">{TITLES[section] ?? "Admin"}</h1>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-sg-muted transition-colors hover:text-sg-primary">
            View site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </header>

        <main className="px-5 py-6 md:px-8 md:py-8">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="users" element={user.role === "admin" ? <UsersPage me={user} /> : <Navigate to="/admin/dashboard" replace />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
