/**
 * Couche d'abstraction Terminal.
 *
 * Pont vers le terminal interactif d'OpenHands via le backend `TerminalSession`
 * (flux d'événements bash sur WebSocket). L'implémentation n'est pas réécrite :
 * on réutilise le contrat officiel de l'agent-server. Aucune valeur cloud codée ;
 * aucune connexion tant que l'agent-server n'est pas configuré.
 */

export interface TerminalOutput {
  text: string;
  stream?: "stdout" | "stderr";
}

export type TerminalOutputHandler = (output: TerminalOutput) => void;

export interface TerminalClient {
  /** Ouvre la session terminal pour une conversation. */
  open(conversationId: string): void;
  /** Envoie une commande shell. */
  run(command: string): void;
  /** S'abonne à la sortie. */
  onOutput(handler: TerminalOutputHandler): () => void;
  /** État de la connexion. */
  status(): "idle" | "connecting" | "open" | "closing" | "closed" | "error";
  /** Ferme la session. */
  close(): void;
}
