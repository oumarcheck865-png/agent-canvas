/**
 * Fournisseur IA par défaut d'Agent Canvas.
 *
 * Lit la configuration depuis `runtimeConfig` (variables d'environnement
 * NEXT_PUBLIC_AI_PROVIDER_*). Aucune clé n'est codée en dur : tout provient
 * de la configuration manuelle du propriétaire du projet.
 *
 * Tant que l'utilisateur n'a pas configuré de fournisseur, le provider par
 * défaut reste à l'état `unconfigured` — il n'émet aucune requête réseau.
 */

import { defineAIProvider, aiProviderRegistry } from "./registry";
import type { AIProvider, AIProviderStatus } from "./types";
import { runtimeConfig } from "../config";

/**
 * Statut du fournisseur par défaut.
 * `unconfigured` tant qu'aucun modèle/URL n'est renseigné (pas de requête).
 */
function defaultStatus(): AIProviderStatus {
  const { kind, baseUrl, model } = runtimeConfig.aiProvider;
  if (kind && baseUrl && model) return "ready";
  return "unconfigured";
}

/** Fournisseur IA par défaut d'Agent Canvas (issu de l'environnement). */
export const defaultAIProvider: AIProvider = defineAIProvider(
  {
    kind: (runtimeConfig.aiProvider.kind as AIProvider["config"]["kind"]) || "custom",
    id: "agent-canvas-default",
    label: "Agent Canvas — Fournisseur par défaut",
    baseUrl: runtimeConfig.aiProvider.baseUrl || undefined,
    models: runtimeConfig.aiProvider.model
      ? [{ id: runtimeConfig.aiProvider.model, label: runtimeConfig.aiProvider.model }]
      : [],
  },
  {
    status: defaultStatus,
  },
);

/**
 * Enregistre le fournisseur par défaut dans le registre.
 * À appeler une fois au démarrage de l'application.
 */
export function registerDefaultAIProvider(): void {
  aiProviderRegistry.register(defaultAIProvider);
}
