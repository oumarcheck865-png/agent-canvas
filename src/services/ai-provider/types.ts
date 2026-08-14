/**
 * Types et contrats de la AI Provider Layer.
 *
 * Ces interfaces décrivent ce qu'un fournisseur IA doit exposer pour pouvoir
 * être branché à la plateforme. Elles sont volontairement minimales et
 * indépendantes de toute implémentation (OpenHands inclus) afin de garder la
 * liberté de connecter plus tard un modèle personnalisé.
 */

/** Grandes familles de fournisseurs reconnus par la couche. */
export type AIProviderKind =
  | "openai"
  | "anthropic"
  | "custom"
  | "self-hosted";

/** État courant d'un fournisseur au sein du registre. */
export type AIProviderStatus = "unconfigured" | "ready" | "error";

/** Message unitaire d'une conversation (rôle + contenu). */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Métadonnées d'un modèle proposé par un fournisseur. */
export interface ModelInfo {
  id: string;
  label: string;
  contextWindow?: number;
}

/** Configuration d'un fournisseur (clés/API/cloud viendront plus tard). */
export interface AIProviderConfig {
  kind: AIProviderKind;
  /** Identifiant stable du fournisseur dans le registre. */
  id: string;
  /** Libellé affichable. */
  label: string;
  /** Point d'accès optionnel (non renseigné tant qu'aucun modèle n'est branché). */
  baseUrl?: string;
  /** Liste des modèles exposés (vide tant que non configuré). */
  models?: ModelInfo[];
}

/** Requête de complétion envoyée à un fournisseur. */
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

/** Réponse renvoyée par un fournisseur. */
export interface ChatCompletionResponse {
  model: string;
  message: ChatMessage;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
  };
}

/**
 * Contrat qu'un fournisseur IA doit implémenter pour être enregistré.
 * À ce stade, aucune implémentation n'est fournie — seules les méthodes
 * sont définies pour préparer le branchement futur.
 */
export interface AIProvider {
  readonly config: AIProviderConfig;
  status(): AIProviderStatus;
  listModels?(): Promise<ModelInfo[]>;
  complete?(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
