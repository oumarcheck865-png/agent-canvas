/**
 * Couche d'abstraction Skills.
 *
 * Pont vers le système de skills d'OpenHands
 * (`vendor/OpenHands/src/components/features/skills/` et
 * `vendor/OpenHands/src/api/`). L'implémentation n'est PAS réécrite ici :
 * cette interface prépare le branchement futur (liste, détail, activation).
 */

/** Origine d'une skill (bundled, user, projet). */
export type SkillSource = "public" | "user" | "project";

/** Résumé d'une skill. */
export interface SkillSummary {
  id: string;
  name: string;
  description?: string;
  source: SkillSource;
}

/** Contrat d'un client skills (branchement futur). */
export interface SkillsClient {
  list(): Promise<SkillSummary[]>;
  get(id: string): Promise<SkillSummary | null>;
}
