"use client";

/**
 * Gardes d'accès basées sur l'authentification.
 *
 * - `RequireAuth` : protège les routes /platform. Redirige vers /login si non
 *   authentifié (après connexion, l'utilisateur revient sur la page ciblée).
 * - `RequireGuest` : redirige les utilisateurs déjà authentifiés vers le chat.
 *
 * Aucune logique cloud ; repose sur le contexte d'authentification local.
 */

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

/** Destination principale après authentification. */
export const AUTH_REDIRECT_TARGET = "/platform/chat";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      // Mémorise la page ciblée pour y revenir après connexion.
      try {
        window.sessionStorage.setItem("agent-canvas:redirect", pathname);
      } catch {
        // ignore (mode privé / storage indisponible)
      }
      router.replace("/login");
    }
  }, [session, loading, router, pathname]);

  if (loading || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-sm text-muted-foreground">Chargement…</div>
      </div>
    );
  }

  return <>{children}</>;
}

export function RequireGuest({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (session) {
      // Si déjà authentifié, on redirige vers la cible mémorisée ou le chat.
      let target = AUTH_REDIRECT_TARGET;
      try {
        const stored = window.sessionStorage.getItem("agent-canvas:redirect");
        if (stored && stored.startsWith("/platform")) target = stored;
        window.sessionStorage.removeItem("agent-canvas:redirect");
      } catch {
        // ignore
      }
      router.replace(target);
    }
  }, [session, loading, router]);

  if (loading || session) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-sm text-muted-foreground">Redirection…</div>
      </div>
    );
  }

  return <>{children}</>;
}
