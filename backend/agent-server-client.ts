/**
 * Client HTTP de base pour la couche d'intégration OpenHands.
 *
 * Réutilise le contrat officiel de l'agent-server OpenHands (en-têtes
 * `X-Session-API-Key`, routes `/api/conversations/*`, `/api/v1/*`) sans
 * dépendre du paquet `@openhands/typescript-client` (qui entraînerait HeroUI /
 * React Router, incompatibles avec Next.js).
 *
 * Aucune valeur cloud OpenHands/OpenAI n'est codée : tout provient de
 * `runtimeConfig` (configuration manuelle du propriétaire du projet).
 * Tant que `NEXT_PUBLIC_AGENT_SERVER_BASE_URL` est vide, le client reste
 * non configuré et n'émet aucune requête.
 */

import { runtimeConfig } from "../src/services/config";

/** Options d'une requête vers l'agent-server. */
export interface AgentServerRequestOptions {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
  /** Surcharge de la clé de session (sinon runtimeConfig). */
  sessionApiKey?: string;
  /** Surcharge de l'URL de base (sinon runtimeConfig). */
  baseUrl?: string;
  /** Délai d'attente en ms. */
  timeoutMs?: number;
}

/** Résultat typé d'une requête. */
export interface AgentServerResponse<T> {
  status: number;
  data: T;
}

/** Erreur levée quand aucun agent-server n'est configuré. */
export class NoAgentServerConfiguredError extends Error {
  constructor() {
    super(
      "Aucun agent-server configuré. Renseignez NEXT_PUBLIC_AGENT_SERVER_BASE_URL.",
    );
    this.name = "NoAgentServerConfiguredError";
  }
}

/** Erreur HTTP normalisée. */
export class AgentServerError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AgentServerError";
  }
}

function resolveBaseUrl(override?: string): string {
  const url = (override ?? runtimeConfig.agentRuntime.baseUrl).trim();
  if (!url) throw new NoAgentServerConfiguredError();
  return url.replace(/\/+$/, "");
}

function resolveSessionKey(override?: string): string | undefined {
  return (override ?? runtimeConfig.agentRuntime.sessionApiKey).trim() || undefined;
}

function buildHeaders(sessionApiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionApiKey) headers["X-Session-API-Key"] = sessionApiKey;
  return headers;
}

/**
 * Effectue une requête HTTP vers l'agent-server OpenHands.
 * Réutilise le contrat officiel (en-têtes, routes) sans dépendance externe.
 */
export async function agentServerRequest<T>(
  options: AgentServerRequestOptions,
): Promise<AgentServerResponse<T>> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const sessionApiKey = resolveSessionKey(options.sessionApiKey);
  const url = `${baseUrl}${options.path}`;

  const controller = new AbortController();
  const timeoutId =
    options.timeoutMs !== undefined
      ? setTimeout(() => controller.abort(), options.timeoutMs)
      : undefined;

  try {
    const res = await fetch(url, {
      method: options.method,
      headers: buildHeaders(sessionApiKey),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    let data: T;
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      data = (await res.json()) as T;
    } else {
      data = (await res.text()) as unknown as T;
    }

    if (!res.ok) {
      throw new AgentServerError(
        `Agent-server ${options.method} ${options.path} → ${res.status}`,
        res.status,
      );
    }

    return { status: res.status, data };
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

/** Indique si un agent-server est configuré (sans lever d'erreur). */
export function isAgentServerConfigured(): boolean {
  return runtimeConfig.agentRuntime.baseUrl.trim().length > 0;
}
