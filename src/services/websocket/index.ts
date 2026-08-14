export type {
  AgentEvent,
  AgentWebSocketClient,
  AgentWebSocketOptions,
  WebSocketConnectionStatus,
} from "./types";

import type { AgentWebSocketClient } from "./types";

/**
 * Factory de client WebSocket agent.
 *
 * Retourne `null` tant qu'aucune implémentation n'est branchée. Lors de la
 * phase de branchement futur, on connectera ici le client OpenHands
 * (`vendor/OpenHands/src/hooks/use-websocket.ts`) ou un adaptateur dédié,
 * sans toucher au moteur OpenHands.
 */
export function createAgentWebSocket(): AgentWebSocketClient | null {
  return null;
}
