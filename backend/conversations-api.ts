/**
 * Adaptateur Conversations — couche d'intégration OpenHands.
 *
 * Réutilise les routes officielles de l'agent-server OpenHands :
 *   - `GET    /api/conversations/search`               (liste)
 *   - `GET    /api/conversations/{id}`                  (détail)
 *   - `POST   /api/conversations`                       (création)
 *   - `DELETE /api/conversations/{id}`                   (suppression)
 *   - `GET    /api/v1/conversation/{id}/events/search`  (historique)
 *   - `POST   /api/conversations/{id}/events`            (envoi message)
 *
 * Aucune fonctionnalité agent n'est réécrite : on appelle simplement le
 * runtime officiel via son contrat HTTP. Aucune valeur cloud codée.
 */

import { agentServerRequest } from "./agent-server-client";

export interface ConversationSummary {
  conversation_id: string;
  title?: string;
  created_at?: string;
  last_updated_at?: string;
  status?: string;
}

export interface ConversationSearchResponse {
  conversations: ConversationSummary[];
  next_page_token?: string;
  has_more?: boolean;
}

export interface CreateConversationRequest {
  /** Message initial optionnel. */
  message?: string;
  /** Répertoire de travail de la conversation. */
  working_dir?: string;
}

export interface CreateConversationResponse {
  conversation_id: string;
}

export interface EventSearchResponse {
  events: unknown[];
  has_more?: boolean;
  next_page_token?: string;
}

export const conversationsApi = {
  async search(
    query?: string,
    opts?: { sessionApiKey?: string; baseUrl?: string },
  ): Promise<ConversationSearchResponse> {
    const qs = query ? `?q=${encodeURIComponent(query)}` : "";
    const { data } = await agentServerRequest<ConversationSearchResponse>({
      method: "GET",
      path: `/api/conversations/search${qs}`,
      sessionApiKey: opts?.sessionApiKey,
      baseUrl: opts?.baseUrl,
    });
    return data;
  },

  async get(
    conversationId: string,
    opts?: { sessionApiKey?: string; baseUrl?: string },
  ): Promise<ConversationSummary> {
    const { data } = await agentServerRequest<ConversationSummary>({
      method: "GET",
      path: `/api/conversations/${conversationId}`,
      sessionApiKey: opts?.sessionApiKey,
      baseUrl: opts?.baseUrl,
    });
    return data;
  },

  async create(
    body: CreateConversationRequest,
    opts?: { sessionApiKey?: string; baseUrl?: string },
  ): Promise<CreateConversationResponse> {
    const { data } = await agentServerRequest<CreateConversationResponse>({
      method: "POST",
      path: "/api/conversations",
      body,
      sessionApiKey: opts?.sessionApiKey,
      baseUrl: opts?.baseUrl,
    });
    return data;
  },

  async remove(
    conversationId: string,
    opts?: { sessionApiKey?: string; baseUrl?: string },
  ): Promise<void> {
    await agentServerRequest<unknown>({
      method: "DELETE",
      path: `/api/conversations/${conversationId}`,
      sessionApiKey: opts?.sessionApiKey,
      baseUrl: opts?.baseUrl,
    });
  },

  async getEvents(
    conversationId: string,
    opts?: { limit?: number; cursor?: string; sessionApiKey?: string; baseUrl?: string },
  ): Promise<EventSearchResponse> {
    const params = new URLSearchParams();
    if (opts?.limit !== undefined) params.set("limit", String(opts.limit));
    if (opts?.cursor) params.set("cursor", opts.cursor);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const { data } = await agentServerRequest<EventSearchResponse>({
      method: "GET",
      path: `/api/v1/conversation/${conversationId}/events/search${qs}`,
      sessionApiKey: opts?.sessionApiKey,
      baseUrl: opts?.baseUrl,
    });
    return data;
  },

  async sendMessage(
    conversationId: string,
    message: string,
    opts?: { sessionApiKey?: string; baseUrl?: string },
  ): Promise<void> {
    await agentServerRequest<unknown>({
      method: "POST",
      path: `/api/conversations/${conversationId}/events`,
      body: { timestamp: Date.now() / 1000, action: "message", args: { content: message } },
      sessionApiKey: opts?.sessionApiKey,
      baseUrl: opts?.baseUrl,
    });
  },
};
