/**
 * Implémentation du client fichiers via le backend OpenHands.
 *
 * Délègue à `filesApi` (couche backend). Aucune valeur cloud codée ; aucun
 * appel réseau tant que l'agent-server n'est pas configuré
 * (`NoAgentServerConfiguredError` est levée par le client HTTP sous-jacent).
 */

import { filesApi } from "@/backend";
import type { FileEntry, FilesClient } from "./types";

export const agentFilesClient: FilesClient = {
  async list(conversationId, path) {
    const { entries } = await filesApi.list(conversationId, path);
    return entries.map<FileEntry>((e) => ({
      name: e.name,
      path: e.path,
      type: e.type,
      size: e.size,
    }));
  },

  async read(conversationId, path) {
    const res = await filesApi.read(conversationId, path);
    return res.content;
  },
};
