import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings,
  Sparkles,
  ShieldAlert,
  X,
} from "lucide-react";

import { Logo } from "./Logo";
import { navItems, quickTips, readUsage, USAGE_LIMIT } from "@/lib/aion";
import { cn } from "@/lib/utils";

function UsageMeter() {
  const [used, setUsed] = useState(0);

  useEffect(() => {
    const sync = () => setUsed(readUsage());
    sync();
    window.addEventListener("aion:usage", sync);
    return () => window.removeEventListener("aion:usage", sync);
  }, []);

  const pct = Math.min(100, (used / USAGE_LIMIT) * 100);

  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-violet" /> AI Usage
        </span>
        <span>
          {used}/{USAGE_LIMIT}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundImage: "var(--gradient-aion)" }}
        />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Generations this session</p>
    </div>
  );
}

function TipCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % quickTips.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-violet">Quick tip</p>
      <p className="mt-1.5 min-h-10 text-xs leading-relaxed text-muted-foreground">{quickTips[i]}</p>
      <div className="mt-3 flex gap-1.5">
        {quickTips.map((tip, idx) => (
          <button
            key={tip}
            aria-label={`Tip ${idx + 1}`}
            onClick={() => setI(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              idx === i ? "w-5 bg-primary" : "w-1.5 bg-secondary",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarBody({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className={cn("flex h-full flex-col gap-6", collapsed ? "items-center p-3" : "p-6")}>
      <Link to="/" onClick={onNavigate} title="Back to dashboard">
        <Logo compact={collapsed} />
      </Link>

      <nav className="flex w-full flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              title={item.title}
              className={cn(
                "flex items-center gap-3 rounded-xl py-2.5 text-sm transition-colors",
                collapsed ? "justify-center px-0" : "px-3",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)]"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active && "text-violet")} />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="h-px w-full bg-sidebar-border" />

      <div className="w-full space-y-4">
        <Link
          to="/settings"
          onClick={onNavigate}
          title="Settings"
          className={cn(
            "flex items-center gap-3 rounded-xl py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground",
            collapsed ? "justify-center px-0" : "px-3",
          )}
        >
          <Settings className="h-4 w-4 shrink-0" /> {!collapsed && "Settings"}
        </Link>
        {!collapsed && (
          <>
            <UsageMeter />
            <TipCarousel />
          </>
        )}
      </div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="sticky bottom-0 z-20 mt-8 flex items-start gap-2 rounded-xl border border-border bg-card/90 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI:</span> AION generates
        drafts, not decisions. Review all output for accuracy, bias and confidentiality before
        sharing. Never enter sensitive personal data.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const stored = localStorage.getItem("aion:sidebar-collapsed");
    if (stored === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      localStorage.setItem("aion:sidebar-collapsed", v ? "0" : "1");
      return !v;
    });
  };

  return (
    <div className="min-h-screen w-full">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-[width] duration-300 lg:block",
          collapsed ? "w-[84px]" : "w-[280px]",
        )}
      >
        <SidebarBody collapsed={collapsed} />
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
          className="absolute -right-3.5 top-8 rounded-full border border-sidebar-border bg-card p-1.5 text-muted-foreground shadow-lg transition-colors hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>


      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          {pathname !== "/" && (
            <Link
              to="/"
              aria-label="Back to home"
              title="Back to home"
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <Logo compact />
        </div>
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-border p-2 text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-sidebar-border bg-sidebar">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[84px]" : "lg:pl-[280px]")}>
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          {pathname !== "/" && (
            <div className="mb-4 hidden items-center gap-2 lg:flex">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Home
              </Link>
            </div>
          )}
          {children}
          <footer className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            © 2026 AION – AI Workplace Productivity Assistant. Created by Shayla Courtney De Bruyn.
            All rights reserved. Built with precision and intelligence.
          </footer>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-border bg-background/95 backdrop-blur-xl sm:hidden">
        {navItems.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px]",
                active ? "text-violet" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
