import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginIdle,
  } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const principal = identity?.getPrincipal().toText() ?? null;

  return {
    identity,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginIdle,
    loginStatus,
    principal,
    login,
    logout: clear,
  };
}
