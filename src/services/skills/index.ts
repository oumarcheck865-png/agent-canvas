export type {
  SkillSource,
  SkillSummary,
  SkillsClient,
} from "./types";

import type { SkillsClient } from "./types";

/**
 * Factory de client skills.
 *
 * Retourne `null` tant qu'aucune implémentation n'est branchée. Le branchement
 * futur réutilisera les composants et services skills d'OpenHands sans les
 * réécrire.
 */
export function createSkillsClient(): SkillsClient | null {
  return null;
}
