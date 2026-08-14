/**
 * Module d'intégration — Projets & espaces de travail.
 *
 * Point d'extension qui accueillera progressivement la gestion des projets
 * OpenHands (`vendor/OpenHands/src/api/workspaces-service/`,
 * `components/features/home/workspace-dropdown/`,
 * `api/git-service/`).
 *
 * Cette phase : préparation du point de montage uniquement.
 */

export interface ProjectsModuleInfo {
  readonly id: "projects";
  enabled: boolean;
}

export const projectsModule: ProjectsModuleInfo = {
  id: "projects",
  enabled: false,
};
