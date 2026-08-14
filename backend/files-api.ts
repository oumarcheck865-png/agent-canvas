/**
 * Adaptateur Fichiers / Espace de travail — couche d'intégration OpenHands.
 *
 * Réutilise les routes officielles de l'agent-server OpenHands pour explorer
 * le système de fichiers d'une conversation :
 *   - `GET /api/conversations/{id}/files`          (liste racine)
 *   - `GET /api/conversations/{id}/files?path=...` (liste d'un dossier)
 *   - `GET /api/conversations/{id}/file?path=...`  (lecture d'un fichier)
 *
 * Aucune fonctionnalité agent n'est réécrite : on appelle le runtime officiel
 * via son contrat HTTP. Aucune valeur cloud codée ; aucun appel réseau tant
 * que l'agent-server n'est pas configuré.
 */

import { agentServerRequest } from "./agent-server-client";

/** Entrée d'un répertoire (fichier ou dossier). */
export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
}

/** Liste d'un répertoire. */
export interface ListFilesResponse {
  entries: FileEntry[];
}

/** Lecture d'un fichier. */
export interface ReadFileResponse {
  path: string;
  content: string;
  encoding?: string;
}

export const filesApi = {
  /** Liste le contenu d'un répertoire (racine si `path` omis). */
  async list(conversationId: string, path?: string): Promise<ListFilesResponse> {
    const query = path ? `?path=${encodeURIComponent(path)}` : "";
    const res = await agentServerRequest<{ entries?: FileEntry[]; files?: FileEntry[] }>({
      method: "GET",
      path: `/api/conversations/${encodeURIComponent(conversationId)}/files${query}`,
    });
    const entries = res.data.entries ?? res.data.files ?? [];
    return { entries };
  },

  /** Lit le contenu d'un fichier. */
  async read(conversationId: string, path: string): Promise<ReadFileResponse> {
    const res = await agentServerRequest<{ content: string; encoding?: string }>({
      method: "GET",
      path: `/api/conversations/${encodeURIComponent(conversationId)}/file?path=${encodeURIComponent(path)}`,
    });
    return { path, content: res.data.content, encoding: res.data.encoding };
  },
};
