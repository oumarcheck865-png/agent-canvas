"use client";

import { Bot } from "lucide-react";
import { PlatformPageHeader } from "@/components/platform/platform-page-header";
import { usePlatformStatus } from "@/components/platform/use-platform-status";
import { aiProviderRegistry } from "@/src/services/ai-provider";

/**
 * Agents Agent Canvas (D4 complémentaire).
 *
 * Configuration des agents et profils d'exécution, et aperçu du fournisseur IA
 * actif (AI Provider Layer). Aucune clé secrète affichée.
 */
export default function AgentsPage() {
  const { aiReady, agentConfigured } = usePlatformStatus();
  const provider = aiProviderRegistry.resolve("agent-canvas-default");

  return (
    <div>
      <PlatformPageHeader
        title="Agents"
        description="Configuration des agents et profils d'exécution."
      />
      <div className="space-y-6 p-6">
        <div className="rounded-xl border border-border bg-card/40 p-5">
          <div className="flex items-center gap-2">
            <Bot className="size-4 text-primary" />
            <h2 className="text-sm font-medium tracking-tight">Fournisseur IA</h2>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <Field label="Statut" value={aiReady ? "Prêt" : "À configurer"} />
            <Field label="Famille" value={provider?.config.kind ?? "—"} />
            <Field label="Modèle" value={provider?.config.models?.[0]?.id ?? "—"} />
            <Field label="Runtime agent" value={agentConfigured ? "Configuré" : "À configurer"} />
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Aucune clé n'est affichée. Configurez le fournisseur et le runtime via
            les variables d'environnement (voir <code className="rounded bg-card px-1">docs/ENVIRONMENT.md</code>).
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Bot className="mb-3 size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Profils d'agents et paramètres d'exécution à venir (intégration progressive).
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
