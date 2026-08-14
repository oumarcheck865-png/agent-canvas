/**
 * Module d'intégration — Agents (profils & workflows).
 *
 * Point d'extension qui accueillera progressivement :
 *   - la gestion des profils agents
 *     (`vendor/OpenHands/src/routes/agent-profiles-settings.tsx`,
 *      `api/agent-profiles-service/`) ;
 *   - les workflows / automations agents
 *     (`vendor/OpenHands/src/components/features/automations/`,
 *      `api/automation-service/`).
 *
 * Cette phase : préparation du point de montage uniquement.
 */

export interface AgentsModuleInfo {
  readonly id: "agents";
  enabled: boolean;
}

export const agentsModule: AgentsModuleInfo = {
  id: "agents",
  enabled: false,
};
