/**
 * Module d'intégration — Dashboard.
 *
 * Point d'extension qui accueillera progressivement le dashboard OpenHands
 * (`vendor/OpenHands/src/routes/home.tsx`, `components/features/home/`,
 * `components/features/conversation-panel/`).
 *
 * Cette phase : on ne fait que préparer le point de montage. Aucun composant
 * OpenHands n'est copié ici (ils dépendent de HeroUI / React Router, stack
 * différente de notre Next.js). Le branchement se fera progressivement après
 * validation.
 */

/** Métadonnées du module dashboard (réservé au branchement futur). */
export interface DashboardModuleInfo {
  readonly id: "dashboard";
  /** Indique si le module est activé dans la plateforme. */
  enabled: boolean;
}

export const dashboardModule: DashboardModuleInfo = {
  id: "dashboard",
  enabled: false,
};
