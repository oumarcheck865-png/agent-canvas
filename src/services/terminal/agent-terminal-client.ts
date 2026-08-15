/**
 * Implémentation du client terminal via le backend OpenHands.
 *
 * Délègue à `TerminalSession` (WebSocket agent-server). Aucune valeur cloud
 * codée ; aucune connexion tant que l'agent-server n'est pas configuré.
 */

import { TerminalSession } from "@/backend";
import type { TerminalClient, TerminalOutputHandler } from "./types";

export class AgentTerminalClient implements TerminalClient {
  private session: TerminalSession | null = null;

  open(conversationId: string): void {
    this.session?.disconnect();
    this.session = new TerminalSession({ conversationId });
    this.session.connect();
  }

  run(command: string): void {
    this.session?.run(command);
  }

  onOutput(handler: TerminalOutputHandler): () => void {
    if (!this.session) return () => {};
    return this.session.onOutput((o) =>
      handler({ text: o.text, stream: o.stream }),
    );
  }

  status(): "idle" | "connecting" | "open" | "closing" | "closed" | "error" {
    return this.session?.status() ?? "idle";
  }

  close(): void {
    this.session?.disconnect();
    this.session = null;
  }
}

/** Instance singleton du client terminal. */
export const agentTerminalClient = new AgentTerminalClient();
