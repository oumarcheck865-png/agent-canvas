export type {
  AgentEvent,
  AgentWebSocketClient,
  AgentWebSocketOptions,
  WebSocketConnectionStatus,
} from "./types";

import type {
  AgentEvent,
  AgentWebSocketClient,
  WebSocketConnectionStatus,
} from "./types";
import { AgentSocket, type AgentSocketStatus } from "../../../backend/agent-server-socket";

const STATUS_MAP: Record<AgentSocketStatus, WebSocketConnectionStatus> = {
  idle: "closed",
  connecting: "connecting",
  open: "open",
  closing: "closing",
  closed: "closed",
  error: "error",
};

/**
 * Factory de client WebSocket agent.
 *
 * Branchée sur la couche d'intégration backend (`AgentSocket`), qui réutilise
 * le contrat officiel OpenHands (`/sockets/events/<id>` + handshake `auth`).
 * Aucune valeur cloud codée : l'hôte provient de runtimeConfig.
 */
export function createAgentWebSocket(): AgentWebSocketClient {
  const socket = new AgentSocket();
  const eventUnsubs: Array<() => void> = [];

  const client: AgentWebSocketClient = {
    connect(options) {
      socket.connect({
        conversationId: options.conversationId,
        baseUrl: options.conversationUrl ?? undefined,
        sessionApiKey: options.sessionApiKey ?? undefined,
      });
    },
    disconnect() {
      for (const u of eventUnsubs) u();
      eventUnsubs.length = 0;
      socket.disconnect();
    },
    send(message) {
      socket.send(message);
    },
    getStatus() {
      return STATUS_MAP[socket.getStatus()];
    },
    onEvent(handler) {
      const unsub = socket.onEvent((e) => handler(e as AgentEvent));
      eventUnsubs.push(unsub);
      return unsub;
    },
  };
  return client;
}
