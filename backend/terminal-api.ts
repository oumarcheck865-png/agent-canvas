/**
 * Adaptateur Terminal — couche d'intégration OpenHands.
 *
 * Le terminal interactif d'OpenHands repose sur un flux d'événements bash
 * véhiculé par WebSocket (voir `agent-server-socket.ts`). Cet adaptateur expose
 * un contrat clair pour envoyer des commandes et recevoir la sortie, sans
 * réécrire le moteur terminal d'OpenHands.
 *
 * Aucune valeur cloud codée ; aucune connexion tant que l'agent-server n'est
 * pas configuré.
 */

import { AgentSocket, type AgentSocketStatus } from "./agent-server-socket";

/** Options d'ouverture d'une session terminal. */
export interface TerminalSessionOptions {
  conversationId: string;
  /** Répertoire de travail initial. */
  workingDir?: string;
}

/** Sortie d'une commande (ligne). */
export interface TerminalOutput {
  /** Identifiant de l'événement côté agent-server. */
  eventId?: string;
  /** Texte de sortie. */
  text: string;
  /** Type de flux (stdout/stderr). */
  stream?: "stdout" | "stderr";
}

/** Callback de réception de sortie terminal. */
export type TerminalOutputHandler = (output: TerminalOutput) => void;

/**
 * Session terminal liée à une conversation.
 * S'appuie sur le WebSocket agent-server pour l'exécution de commandes.
 */
export class TerminalSession {
  private readonly socket: AgentSocket;
  private readonly options: TerminalSessionOptions;
  private readonly outputHandlers = new Set<TerminalOutputHandler>();

  constructor(options: TerminalSessionOptions) {
    this.options = options;
    this.socket = new AgentSocket();
  }

  /** Ouvre la connexion et s'abonne aux événements bash. */
  connect(): void {
    this.socket.connect({ conversationId: this.options.conversationId });
    this.socket.onEvent((event) => {
      // Les événements de type commande/sortie bash sont relayés aux handlers.
      const kind =
        (event as { type?: string; kind?: string }).type ??
        (event as { type?: string; kind?: string }).kind;
      if (kind && /bash|command|output|terminal/i.test(kind)) {
        const text =
          (event as { content?: string; text?: string; message?: string }).content ??
          (event as { content?: string; text?: string; message?: string }).text ??
          (event as { content?: string; text?: string; message?: string }).message ??
          "";
        this.outputHandlers.forEach((h) =>
          h({ text, stream: /stderr|error/i.test(kind) ? "stderr" : "stdout" }),
        );
      }
    });
  }

  /** Envoie une commande shell au runtime agent. */
  run(command: string): void {
    this.socket.send({ type: "command", command, args: { command } });
  }

  /** S'abonne à la sortie du terminal. */
  onOutput(handler: TerminalOutputHandler): () => void {
    this.outputHandlers.add(handler);
    return () => {
      this.outputHandlers.delete(handler);
    };
  }

  /** État courant du socket sous-jacent. */
  status(): AgentSocketStatus {
    return this.socket.getStatus();
  }

  /** Ferme la session terminal. */
  disconnect(): void {
    this.socket.disconnect();
  }
}
