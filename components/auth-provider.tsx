"use client";

/**
 * Fournisseur de contexte d'authentification Agent Canvas.
 *
 * Expose la session courante et les actions d'authentification aux composants
 * client. S'appuie sur `authService` (implémentation locale par défaut,
 * remplaçable par un backend). Aucune logique cloud.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  authService,
  type AuthCredentials,
  type AuthSession,
} from "@/src/services/auth";

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<AuthSession>;
  signUp: (credentials: AuthCredentials) => Promise<AuthSession>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // On part de `null` côté serveur puis on synchronise côté client pour éviter
  // les écarts d'hydrdration liés à localStorage.
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(authService.getSession());
    setLoading(false);
    const unsubscribe = authService.subscribe(setSession);
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    return authService.signIn(credentials);
  }, []);

  const signUp = useCallback(async (credentials: AuthCredentials) => {
    return authService.signUp(credentials);
  }, []);

  const signOut = useCallback(() => {
    authService.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, loading, signIn, signUp, signOut }),
    [session, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook d'accès au contexte d'authentification. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  }
  return ctx;
}
