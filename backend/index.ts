/**
 * Couche d'intégration OpenHands (backend).
 *
 * Adaptateurs framework-agnostiques (fetch + WebSocket natif) qui réutilisent
 * le contrat officiel de l'agent-server OpenHands SANS dépendre du paquet
 * `@openhands/typescript-client` (incompatible avec Next.js : HeroUI /
 * React Router). Le moteur agent OpenHands n'est pas réécrit ; on appelle
 * simplement le runtime officiel via son API HTTP/WebSocket.
 *
 * Aucune valeur cloud OpenHands/OpenAI n'est codée : toute la configuration
 * provient de `runtimeConfig` (NEXT_PUBLIC_AGENT_SERVER_*).
 * Tant que l'agent-server n'est pas configuré, aucun appel réseau n'est émis.
 *
 * Branchement des services (`src/services/`) : cette couche est l'implémentation
 * concrète que les services abstraits utiliseront lors des prochaines phases.
 */

export {
  agentServerRequest,
  isAgentServerConfigured,
  NoAgentServerConfiguredError,
  AgentServerError,
  type AgentServerRequestOptions,
  type AgentServerResponse,
} from "./agent-server-client";

export { AgentSocket, type AgentSocketStatus, type AgentSocketOptions } from "./agent-server-socket";

export { conversationsApi } from "./conversations-api";
export type {
  ConversationSummary,
  ConversationSearchResponse,
  CreateConversationRequest,
  CreateConversationResponse,
  EventSearchResponse,
} from "./conversations-api";

export { filesApi } from "./files-api";
export type { FileEntry, ListFilesResponse, ReadFileResponse } from "./files-api";

export { TerminalSession } from "./terminal-api";
export type {
  TerminalSessionOptions,
  TerminalOutput,
  TerminalOutputHandler,
} from "./terminal-api";
