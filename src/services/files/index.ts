/**
 * Barrel export de la couche fichiers.
 */

export type { FileEntry, FilesClient } from "./types";
export { agentFilesClient } from "./agent-files-client";

import type { FilesClient } from "./types";
import { agentFilesClient } from "./agent-files-client";

/**
 * Client fichiers actif.
 * Par défaut : implémentation via l'agent-server OpenHands (aucune dépendance
 * cloud codée ; non configuré → aucune requête réseau).
 */
export const filesClient: FilesClient = agentFilesClient;
