export type {
  MCPClient,
  MCPServerConfig,
  MCPServerType,
  MCPTestResponse,
} from "./types";

import type { MCPClient } from "./types";

/**
 * Factory de client MCP.
 *
 * Retourne `null` tant qu'aucune implémentation n'est branchée. Le branchement
 * futur réutilisera `vendor/OpenHands/src/api/mcp-service/mcp-service.api.ts`
 * sans réécrire la logique MCP d'OpenHands.
 */
export function createMCPClient(): MCPClient | null {
  return null;
}
