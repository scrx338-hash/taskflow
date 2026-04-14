import { Button } from "@/components/ui/button";
import { CheckSquare, Globe, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/use-auth";

const features = [
  {
    icon: Shield,
    title: "Private by default",
    description:
      "Your tasks are isolated to your identity — nobody else can see them.",
  },
  {
    icon: Globe,
    title: "Internet Identity",
    description: "Sign in securely without passwords. No email required.",
  },
  {
    icon: Zap,
    title: "Permanent storage",
    description: "Tasks persist on-chain. They'll be there when you come back.",
  },
];

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="flex h-14 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
              <CheckSquare className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-semibold text-foreground tracking-tight">
              TaskFlow
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/20 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />

            <div className="relative text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "backOut" }}
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 shadow-lg shadow-primary/10"
              >
                <CheckSquare className="h-8 w-8 text-primary" />
              </motion.div>

              <h1 className="font-display text-3xl font-semibold text-foreground mb-2 tracking-tight">
                Welcome to TaskFlow
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Your personal, private task manager — secure, persistent, and
                yours alone.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] font-semibold transition-smooth gap-2"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="login-btn"
            >
              {isLoggingIn ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Connecting…
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              No password. No email. Just your Internet Identity.
            </p>
          </div>

          {/* Features */}
          <div className="mt-6 space-y-2.5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.25 + i * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="flex items-start gap-3 rounded-xl bg-muted/40 border border-border/50 px-4 py-3 hover:bg-muted/60 transition-colors"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <f.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {f.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
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
  );
}
