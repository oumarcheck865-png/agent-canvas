"use client";

import { useMemo } from "react";
import { isAgentServerConfigured } from "@/backend";
import { aiProviderRegistry, registerDefaultAIProvider } from "@/src/services/ai-provider";

/**
 * État de connexion de la plateforme Agent Canvas.
 *
 * Reflète la configuration runtime (agent-server + AI provider) sans émettre
 * de requête réseau. Utilisé par le workspace pour afficher l'état
 * « prêt / à configurer ».
 */
export function usePlatformStatus() {
  // S'assure que le fournisseur IA par défaut est enregistré (idempotent).
  useMemo(() => {
    registerDefaultAIProvider();
  }, []);

  const agentConfigured = isAgentServerConfigured();
  const aiProvider = aiProviderRegistry.resolve("agent-canvas-default");
  const aiReady = aiProvider?.status() === "ready";

  return {
    agentConfigured,
    aiReady,
    /** La plateforme est pleinement opérationnelle si runtime + IA sont prêts. */
    ready: agentConfigured && aiReady,
  };
}
