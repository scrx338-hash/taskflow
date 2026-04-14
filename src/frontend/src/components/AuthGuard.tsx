import type { ReactNode } from "react";
import { useAuth } from "../hooks/use-auth";
import { PageLoader } from "./ui/LoadingSpinner";

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
