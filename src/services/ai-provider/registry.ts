/**
 * Registre des fournisseurs IA.
 *
 * Le registre permet d'enregistrer et de résoudre des fournisseurs par
 * identifiant. Il ne connecte aucun modèle pour le moment : c'est un point
 * d'extension qui sera utilisé plus tard pour brancher un modèle IA
 * personnalisé, des clés API propriétaires ou un cloud privé.
 *
 * Aucune connexion existante n'est supprimée et les workflows agents OpenHands
 * ne sont pas modifiés par cette couche.
 */

import type {
  AIProvider,
  AIProviderConfig,
} from "./types";

export class AIProviderRegistry {
  private readonly providers = new Map<string, AIProvider>();

  /** Inscrit un fournisseur (écrase un homonyme). */
  register(provider: AIProvider): void {
    this.providers.set(provider.config.id, provider);
  }

  /** Retire un fournisseur du registre. */
  unregister(id: string): void {
    this.providers.delete(id);
  }

  /** Récupère un fournisseur par identifiant. */
  resolve(id: string): AIProvider | undefined {
    return this.providers.get(id);
  }

  /** Liste tous les fournisseurs enregistrés. */
  list(): AIProvider[] {
    return [...this.providers.values()];
  }

  /** Indique si au moins un fournisseur est configuré. */
  hasAny(): boolean {
    return this.providers.size > 0;
  }
}

/** Instance singleton partagée du registre. */
export const aiProviderRegistry = new AIProviderRegistry();

/** Helper pour déclarer un fournisseur typé sans instancier le registre. */
export function defineAIProvider(
  config: AIProviderConfig,
  implementation?: Partial<Omit<AIProvider, "config">>,
): AIProvider {
  return {
    config,
    status: implementation?.status ?? (() => "unconfigured" as const),
    ...(implementation?.listModels ? { listModels: implementation.listModels } : {}),
    ...(implementation?.complete ? { complete: implementation.complete } : {}),
    ...(implementation?.stream ? { stream: implementation.stream } : {}),
  };
}

/** Garde-fou type pour valider qu'un objet est une config de fournisseur. */
export function isAIProviderConfig(
  value: unknown,
): value is AIProviderConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    "id" in value &&
    "label" in value
  );
}
