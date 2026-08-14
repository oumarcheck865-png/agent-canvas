"use client";

import { MonitorPlay } from "lucide-react";
import { PlatformPageHeader } from "@/components/platform/platform-page-header";
import { usePlatformStatus } from "@/components/platform/use-platform-status";

/**
 * Preview Agent Canvas (D5).
 *
 * Prévisualisation des applications en cours de génération. Le branchement
 * du service preview OpenHands est progressif.
 */
export default function PreviewPage() {
  const { ready } = usePlatformStatus();

  return (
    <div>
      <PlatformPageHeader
        title="Preview"
        description="Prévisualisation des applications générées."
      />
      <div className="p-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <MonitorPlay className="mb-3 size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {ready
              ? "Aperçu navigateur intégré à venir (intégration progressive)."
              : "Configurez l'agent-server pour activer la prévisualisation."}
          </p>
        </div>
      </div>
    </div>
  );
}
