/**
 * Client WebSocket pour la couche d'intégration OpenHands.
 *
 * Réutilise le contrat officiel de l'agent-server OpenHands :
 *   - URL : `ws[s]://<host>[/path-prefix]/sockets/events/<conversationId>`
 *     (voir vendor/OpenHands/src/utils/websocket-url.ts → buildWebSocketUrl)
 *   - Authentification : premier message `{ type: "auth", session_api_key }`
 *     (voir vendor/OpenHands/src/utils/websocket-auth.ts → sendWebSocketAuth)
 *
 * Implémentation framework-agnostique (WebSocket natif) réutilisable dans
 * Next.js. Aucune valeur cloud codée : l'hôte provient de runtimeConfig.
 * Tant que l'agent-server n'est pas configuré, `connect()` lève une erreur
 * explicite sans ouvrir de socket.
 */

import { runtimeConfig } from "../src/services/config";
import { NoAgentServerConfiguredError } from "./agent-server-client";

/** État de connexion. */
export type AgentSocketStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closing"
  | "closed"
  | "error";

export interface AgentSocketOptions {
  conversationId: string;
  /** Surcharge du host (sinon runtimeConfig.agentRuntime.baseUrl). */
  baseUrl?: string;
  /** Surcharge de la clé de session (sinon runtimeConfig). */
  sessionApiKey?: string;
}

const WS_AUTH_TYPE = "auth";
const WS_SESSION_KEY_FIELD = "session_api_key";

function toWsUrl(httpBase: string, conversationId: string): string {
  const trimmed = httpBase.replace(/\/+$/, "");
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new NoAgentServerConfiguredError();
  }
  const protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${url.host}${url.pathname.replace(/\/$/, "")}/sockets/events/${conversationId}`;
}

/**
 * Client WebSocket agent minimal, réutilisant le contrat officiel OpenHands.
 * Ne dépend d'aucune librairie externe (WebSocket natif du navigateur).
 */
export class AgentSocket {
  private ws: WebSocket | null = null;
  private status: AgentSocketStatus = "idle";
  private readonly handlers = new Set<(event: unknown) => void>();
  private readonly statusHandlers = new Set<(status: AgentSocketStatus) => void>();

  getStatus(): AgentSocketStatus {
    return this.status;
  }

  private setStatus(status: AgentSocketStatus): void {
    this.status = status;
    for (const h of this.statusHandlers) h(status);
  }

  /** Écoute les événements entrants. Retourne une fonction de désabonnement. */
  onEvent(handler: (event: unknown) => void): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /** Écoute les changements de statut. Retourne une fonction de désabonnement. */
  onStatus(handler: (status: AgentSocketStatus) => void): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  /** Ouvre la socket et envoie l'authentification officielle OpenHands. */
  connect(options: AgentSocketOptions): void {
    const baseUrl = (options.baseUrl ?? runtimeConfig.agentRuntime.baseUrl).trim();
    if (!baseUrl) throw new NoAgentServerConfiguredError();

    const sessionApiKey = (
      options.sessionApiKey ?? runtimeConfig.agentRuntime.sessionApiKey
    ).trim();

    this.disconnect();
    this.setStatus("connecting");

    const url = toWsUrl(baseUrl, options.conversationId);
    const ws = typeof WebSocket !== "undefined" ? new WebSocket(url) : null;
    if (!ws) {
      this.setStatus("error");
      return;
    }
    this.ws = ws;

    ws.onopen = () => {
      this.setStatus("open");
      if (sessionApiKey) {
        ws.send(
          JSON.stringify({
            type: WS_AUTH_TYPE,
            [WS_SESSION_KEY_FIELD]: sessionApiKey,
          }),
        );
      }
    };
    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data as string);
        for (const h of this.handlers) h(parsed);
      } catch {
        for (const h of this.handlers) h(msg.data);
      }
    };
    ws.onerror = () => this.setStatus("error");
    ws.onclose = () => this.setStatus("closed");
  }

  /** Envoie un message sur la socket. */
  send(message: unknown): void {
    if (this.ws && this.status === "open") {
      this.ws.send(JSON.stringify(message));
    }
  }

  /** Ferme la socket proprement. */
  disconnect(): void {
    if (this.ws) {
      this.setStatus("closing");
      this.ws.close();
      this.ws = null;
    }
    this.setStatus("closed");
  }
}
