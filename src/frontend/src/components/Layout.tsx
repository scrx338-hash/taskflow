import { Button } from "@/components/ui/button";
import {
  BriefcaseIcon,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserIcon,
  X,
  ZapIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Category } from "../types/task";

interface LayoutProps {
  children: ReactNode;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
}

const NAV_ITEMS = [
  { key: "all", label: "All Tasks", icon: LayoutDashboard },
  { key: Category.Work, label: "Work", icon: BriefcaseIcon },
  { key: Category.Personal, label: "Personal", icon: UserIcon },
  { key: Category.Urgent, label: "Urgent", icon: ZapIcon },
];

function Sidebar({
  activeCategory,
  onCategoryChange,
  categoryCounts,
  onClose,
}: {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
  onClose?: () => void;
}) {
  return (
    <nav className="flex flex-col h-full py-4 px-3 gap-1">
      <div className="flex items-center justify-between px-2 pb-4 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/40">
            <CheckSquare className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-base font-semibold text-foreground tracking-tight">
            TaskFlow
          </span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
        Categories
      </p>

      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const count = categoryCounts[key] ?? 0;
        const isActive = activeCategory === key;
        return (
          <button
            key={key}
            type="button"
            data-ocid={`sidebar-category-${key.toLowerCase()}`}
            onClick={() => {
              onCategoryChange(key);
              onClose?.();
            }}
            className={`group flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? "bg-primary/25 border border-primary/40 text-primary shadow-sm shadow-primary/10 backdrop-blur-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
            />
            <span className="flex-1 text-left font-medium">{label}</span>
            {count > 0 && (
              <span
                className={`text-[10px] tabular-nums font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                  isActive
                    ? "bg-primary/30 text-primary"
                    : "bg-white/10 text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function Layout({
  children,
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, principal, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}…${principal.slice(-3)}`
    : null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen bg-black/30 backdrop-blur-xl border-r border-white/10">
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          categoryCounts={categoryCounts}
        />
      </aside>

      {/* Mobile Sidebar Drawer Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          tabIndex={-1}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-background/95 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-ocid="mobile-sidebar"
      >
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          categoryCounts={categoryCounts}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/30 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 sm:px-6">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                  data-ocid="sidebar-toggle"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                {/* Brand visible only on mobile (sidebar hidden) */}
                <div className="flex lg:hidden items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 border border-primary/40">
                    <CheckSquare className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-display text-base font-semibold text-foreground tracking-tight">
                    TaskFlow
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {isAuthenticated && shortPrincipal && (
                  <div className="hidden sm:flex items-center gap-1.5 mr-1">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                      <span className="text-[9px] font-bold text-primary">
                        {shortPrincipal.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {shortPrincipal}
                    </span>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="Toggle theme"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  data-ocid="theme-toggle"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="Sign out"
                    onClick={logout}
                    data-ocid="sign-out-btn"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full overflow-auto">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-black/20 border-t border-white/10 py-4">
          <div className="px-4 sm:px-6">
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
