export type {
  AgentConversationSummary,
  AgentRuntimeController,
  AgentRuntimeState,
} from "./types";

import type { AgentRuntimeController } from "./types";

/**
 * Factory de contrôleur de runtime agent.
 *
 * Retourne `null` tant qu'aucune implémentation n'est branchée. Le branchement
 * futur réutilisera le client OpenHands (`@openhands/typescript-client` et
 * `vendor/OpenHands/src/api/runtime-service/`) sans réécrire le moteur.
 */
export function createAgentRuntime(): AgentRuntimeController | null {
  return null;
}
