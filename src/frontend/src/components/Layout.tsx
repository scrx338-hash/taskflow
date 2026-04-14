import { Button } from "@/components/ui/button";
import { CheckSquare, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/use-auth";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, principal, logout } = useAuth();

  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}…${principal.slice(-3)}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <CheckSquare className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display text-lg font-semibold text-foreground tracking-tight">
                TaskFlow
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {isAuthenticated && shortPrincipal && (
                <div className="hidden sm:flex items-center gap-1.5 mr-1">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
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

      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
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
  );
}
