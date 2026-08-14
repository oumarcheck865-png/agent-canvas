"use client";

import { TerminalSquare } from "lucide-react";
import { PlatformPageHeader } from "@/components/platform/platform-page-header";
import { usePlatformStatus } from "@/components/platform/use-platform-status";

/**
 * Terminal Agent Canvas (D5 complémentaire).
 *
 * Terminal interactif lié au runtime agent. Le branchement du service
 * terminal (xterm.js) et du flux bash-events OpenHands est progressif.
 */
export default function TerminalPage() {
  const { ready } = usePlatformStatus();

  return (
    <div>
      <PlatformPageHeader
        title="Terminal"
        description="Terminal interactif lié au runtime."
      />
      <div className="p-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <TerminalSquare className="mb-3 size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {ready
              ? "Terminal intégré (xterm.js) à venir (intégration progressive)."
              : "Configurez l'agent-server pour activer le terminal."}
          </p>
        </div>
      </div>
    </div>
  );
}
