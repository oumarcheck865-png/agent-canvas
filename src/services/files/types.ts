/**
 * Couche d'abstraction Fichiers / Espace de travail.
 *
 * Pont vers le système de fichiers d'une conversation via le backend
 * `filesApi`. L'implémentation concrète réutilise l'agent-server OpenHands
 * (routes officielles /api/conversations/{id}/files) sans réécrire la logique.
 * Tant que l'agent-server n'est pas configuré, aucune requête réseau n'est
 * émise.
 */

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
}

export interface FilesClient {
  list(conversationId: string, path?: string): Promise<FileEntry[]>;
  read(conversationId: string, path: string): Promise<string>;
}
