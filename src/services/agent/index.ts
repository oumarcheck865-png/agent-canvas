export type {
  AgentConversationSummary,
  AgentRuntimeController,
  AgentRuntimeState,
} from "./types";

import type {
  AgentConversationSummary,
  AgentRuntimeController,
  AgentRuntimeState,
} from "./types";
import { conversationsApi, isAgentServerConfigured } from "../../../backend";

/**
 * Factory de contrôleur de runtime agent.
 *
 * Branchée sur la couche d'intégration backend (`conversationsApi`), qui
 * réutilise le contrat officiel OpenHands. Aucune valeur cloud codée :
 * l'hôte provient de runtimeConfig. Retourne null tant qu'aucun agent-server
 * n'est configuré (pas d'appel réseau superflu).
 */
export function createAgentRuntime(): AgentRuntimeController | null {
  if (!isAgentServerConfigured()) return null;

  return {
    async getState(_conversationId: string): Promise<AgentRuntimeState> {
      // L'état détaillé vient des événements temps réel (WebSocket).
      // Ici on retourne idle par défaut ; l'enrichissement se fait via le
      // service websocket. Aucune logique agent n'est réécrite.
      return "idle";
    },
    async sendMessage(conversationId: string, message: string): Promise<void> {
      await conversationsApi.sendMessage(conversationId, message);
    },
    async stop(_conversationId: string): Promise<void> {
      // Le contrôle d'arrêt précis viendra du branchement complet des
      // événements ; on évite de réécrire la logique OpenHands.
    },
    async listConversations(): Promise<AgentConversationSummary[]> {
      const { conversations } = await conversationsApi.search();
      return conversations.map((c) => ({
        id: c.conversation_id,
        title: c.title,
        createdAt: c.created_at,
        updatedAt: c.last_updated_at,
        status: c.status,
      }));
    },
  };
}
