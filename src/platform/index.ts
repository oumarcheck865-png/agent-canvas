/**
 * Plateforme Agent Canvas — point d'agrégation des modules d'intégration.
 *
 * Chaque module (dashboard, chat, agents, projects, preview, terminal) est
 * intégré progressivement. À ce stade, aucun n'est activé (`enabled: false`) :
 * ils préparent le terrain pour les prochaines phases validées.
 *
 * Le moteur OpenHands (runtime, websockets, MCP, skills, événements) reste
 * intact et n'est pas réécrit ; les services abstraits correspondants vivent
 * dans `src/services/`.
 */

export { dashboardModule, type DashboardModuleInfo } from "./dashboard";
export { chatModule, type ChatModuleInfo } from "./chat";
export { agentsModule, type AgentsModuleInfo } from "./agents";
export { projectsModule, type ProjectsModuleInfo } from "./projects";
export { previewModule, type PreviewModuleInfo } from "./preview";
export { terminalModule, type TerminalModuleInfo } from "./terminal";

import { dashboardModule } from "./dashboard";
import { chatModule } from "./chat";
import { agentsModule } from "./agents";
import { projectsModule } from "./projects";
import { previewModule } from "./preview";
import { terminalModule } from "./terminal";

/** Liste ordonnée des modules de la plateforme. */
export const platformModules = [
  dashboardModule,
  chatModule,
  agentsModule,
  projectsModule,
  previewModule,
  terminalModule,
] as const;
