/**
 * Barrel export de la couche terminal.
 */

export type { TerminalClient, TerminalOutput, TerminalOutputHandler } from "./types";
export { AgentTerminalClient, agentTerminalClient } from "./agent-terminal-client";

import type { TerminalClient } from "./types";
import { agentTerminalClient } from "./agent-terminal-client";

/**
 * Client terminal actif.
 * Par défaut : implémentation via l'agent-server OpenHands (WebSocket bash
 * events). Aucune dépendance cloud ; non configuré → aucune connexion.
 */
export const terminalClient: TerminalClient = agentTerminalClient;
