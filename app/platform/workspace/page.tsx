"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import { PlatformPageHeader } from "@/components/platform/platform-page-header";
import { usePlatformStatus } from "@/components/platform/use-platform-status";
import { Button } from "@/components/ui/button";

/**
 * Espace de travail Agent Canvas (page d'accueil de la plateforme).
 *
 * Vue d'ensemble de l'état de la plateforme (runtime agent + fournisseur IA),
 * et accès rapide aux modules. L'intégration OpenHands est progressive :
 * chaque module est activé au fur et à mesure du branchement des services.
 */
export default function WorkspacePage() {
  const { agentConfigured, aiReady, ready } = usePlatformStatus();

  const cards = [
    {
      title: "Conversations",
      description: "Démarrez et suivez vos sessions avec l'agent.",
      href: "/platform/conversations",
      cta: "Ouvrir",
      ready,
    },
    {
      title: "Projets",
      description: "Gérez vos espaces de travail et fichiers de projet.",
      href: "/platform/projects",
      cta: "Ouvrir",
      ready,
    },
    {
      title: "Agents",
      description: "Configurez vos agents et profils d'exécution.",
      href: "/platform/agents",
      cta: "Ouvrir",
      ready,
    },
    {
      title: "Preview",
      description: "Prévisualisez vos applications en cours de génération.",
      href: "/platform/preview",
      cta: "Ouvrir",
      ready,
    },
    {
      title: "Terminal",
      description: "Accédez à un terminal interactif lié au runtime.",
      href: "/platform/terminal",
      cta: "Ouvrir",
      ready,
    },
  ];

  return (
    <div>
      <PlatformPageHeader
        title="Espace de travail"
        description="Tableau de bord de la plateforme Agent Canvas."
      />

      <div className="space-y-6 p-6">
        {/* État de configuration */}
        <div className="rounded-xl border border-border bg-card/40 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-medium tracking-tight">État de la plateforme</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <StatusLine label="Runtime agent" ok={agentConfigured} />
            <StatusLine label="Fournisseur IA" ok={aiReady} />
          </div>
          {!ready ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Configurez l'agent-server et le fournisseur IA via les variables
              d'environnement (voir <code className="rounded bg-card px-1">docs/ENVIRONMENT.md</code>)
              pour activer les modules.
            </p>
          ) : null}
        </div>

        {/* Cartes des modules */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, description, href, cta, ready }) => (
            <div
              key={title}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card/40 p-5 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="space-y-1">
                <h3 className="font-medium tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <div className="mt-5">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  disabled={!ready}
                >
                  <Link href={href}>
                    {cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusLine({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="size-4 text-primary" />
      ) : (
        <Circle className="size-4 text-muted-foreground" />
      )}
      <span className="text-muted-foreground">{label}</span>
      <span className={ok ? "text-foreground" : "text-muted-foreground"}>
        {ok ? "Configuré" : "À configurer"}
      </span>
    </div>
  );
}
