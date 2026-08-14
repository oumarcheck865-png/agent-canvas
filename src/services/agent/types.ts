/**
 * Couche d'abstraction du runtime agent.
 *
 * Pont vers le runtime OpenHands. Le runtime agent (exécution, communication,
 * gestion d'événements, exécution des tâches) vit côté agent-server OpenHands
 * et n'est PAS réécrit ici. Cette interface prépare uniquement le branchement
 * futur des opérations agent (envoi de message, contrôle d'état, métriques).
 *
 * Rien n'est supprimé ni modifié côté OpenHands.
 */

/** État d'exécution d'un agent (reflète AgentState OpenHands). */
export type AgentRuntimeState =
  | "loading"
  | "idle"
  | "running"
  | "paused"
  | "stopped"
  | "finished"
  | "error"
  | "awaiting_user_input";

/** Résumé d'une conversation agent. */
export interface AgentConversationSummary {
  id: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
  state?: AgentRuntimeState;
}

/** Contrat d'un contrôleur de runtime agent (branchement futur). */
export interface AgentRuntimeController {
  getState(conversationId: string): Promise<AgentRuntimeState>;
  sendMessage(conversationId: string, message: string): Promise<void>;
  stop(conversationId: string): Promise<void>;
  listConversations(): Promise<AgentConversationSummary[]>;
}
