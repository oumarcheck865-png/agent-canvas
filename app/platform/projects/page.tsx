"use client";

import { FolderGit2 } from "lucide-react";
import { PlatformPageHeader } from "@/components/platform/platform-page-header";
import { usePlatformStatus } from "@/components/platform/use-platform-status";

/**
 * Projets Agent Canvas (D4).
 *
 * Gestion des espaces de travail et fichiers de projet. Le branchement
 * complet du service fichiers OpenHands est progressif ; cette vue expose
 * l'emplacement et l'état du module.
 */
export default function ProjectsPage() {
  const { ready } = usePlatformStatus();

  return (
    <div>
      <PlatformPageHeader
        title="Projets"
        description="Espaces de travail et fichiers de projet."
      />
      <div className="p-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <FolderGit2 className="mb-3 size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {ready
              ? "Gestion des projets à venir : arborescence, fichiers, branches."
              : "Configurez l'agent-server pour activer la gestion de projets."}
          </p>
        </div>
      </div>
    </div>
  );
}
