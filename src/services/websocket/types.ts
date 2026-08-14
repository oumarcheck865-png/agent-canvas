/**
 * Couche d'abstraction WebSocket.
 *
 * Pont vers le système d'événements temps réel d'OpenHands. L'implémentation
 * OpenHands vit dans `vendor/OpenHands/src/contexts/conversation-websocket-context.tsx`
 * et `vendor/OpenHands/src/hooks/use-websocket.ts`. Elle n'est PAS réécrite ici :
 * cette interface sert uniquement à préparer le point de branchement futur.
 *
 * Rien n'est supprimé ni modifié côté OpenHands.
 */

/** État de connexion d'une socket agent. */
export type WebSocketConnectionStatus =
  | "connecting"
  | "open"
  | "closing"
  | "closed"
  | "error";

/** Message générique transitant sur la socket d'événements agent. */
export interface AgentEvent {
  type: string;
  payload: unknown;
}

/** Options de connexion à la socket d'événements d'une conversation. */
export interface AgentWebSocketOptions {
  conversationId: string;
  conversationUrl?: string | null;
  sessionApiKey?: string | null;
}

/** Contrat d'un client WebSocket agent (branchement futur). */
export interface AgentWebSocketClient {
  connect(options: AgentWebSocketOptions): void;
  disconnect(): void;
  send(message: AgentEvent): void;
  getStatus(): WebSocketConnectionStatus;
  onEvent(handler: (event: AgentEvent) => void): () => void;
}
