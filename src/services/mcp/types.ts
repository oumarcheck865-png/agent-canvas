/**
 * Couche d'abstraction MCP (Model Context Protocol).
 *
 * Pont vers le service MCP d'OpenHands (`vendor/OpenHands/src/api/mcp-service/`).
 * L'implémentation n'est PAS réécrite ici : cette interface prépare le
 * branchement futur (test de serveur MCP, listing, santé).
 */

/** Type de transport d'un serveur MCP. */
export type MCPServerType = "stdio" | "sse" | "http";

/** Configuration d'un serveur MCP. */
export interface MCPServerConfig {
  name: string;
  type: MCPServerType;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/** Résultat d'un test de connexion à un serveur MCP. */
export interface MCPTestResponse {
  success: boolean;
  tools?: Array<{ name: string; description?: string }>;
  error?: string;
}

/** Contrat d'un client MCP (branchement futur). */
export interface MCPClient {
  test(server: MCPServerConfig): Promise<MCPTestResponse>;
  listServers(): Promise<MCPServerConfig[]>;
}
