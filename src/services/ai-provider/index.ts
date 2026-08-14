/**
 * AI Provider Layer — couche de séparation pour le fournisseur IA.
 *
 * Objectif (Étape 4 de l'intégration progressive) :
 * Créer une couche d'abstraction qui permettra, plus tard, de brancher :
 *   - un modèle IA personnalisé ;
 *   - des clés API propriétaires ;
 *   - un cloud privé ;
 *   - des configurations sur mesure.
 *
 * Pour le moment :
 *   - Aucun modèle IA n'est connecté.
 *   - Aucune connexion existante n'est supprimée.
 *   - Les workflows agents OpenHands ne sont pas modifiés.
 *
 * Cette couche ne fait que définir des contrats (interfaces/types) et un
 * registre de fournisseurs. L'implémentation concrète viendra dans une phase
 * ultérieure, une fois validée par l'utilisateur.
 */

export type {
  AIProvider,
  AIProviderConfig,
  AIProviderKind,
  AIProviderStatus,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatMessage,
  ModelInfo,
} from "./types";

export {
  defineAIProvider,
  isAIProviderConfig,
  aiProviderRegistry,
  AIProviderRegistry,
} from "./registry";
