"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { PlatformPageHeader } from "@/components/platform/platform-page-header";
import { usePlatformStatus } from "@/components/platform/use-platform-status";
import { Button } from "@/components/ui/button";
import { createAgentRuntime, type AgentConversationSummary } from "@/src/services/agent";
import { NoAgentServerConfiguredError } from "@/backend";

/**
 * Conversations Agent Canvas (D3).
 *
 * Liste l'historique des conversations via le service `services/agent`
 * (branché sur la couche backend OpenHands). Aucune donnée tant que le
 * runtime n'est pas configuré — aucun appel réseau superflu.
 */
export default function ConversationsPage() {
  const { agentConfigured } = usePlatformStatus();
  const [conversations, setConversations] = useState<AgentConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentConfigured) return;
    const controller = createAgentRuntime();
    if (!controller) return;
    setLoading(true);
    setError(null);
    controller
      .listConversations()
      .then(setConversations)
      .catch((err) => {
        if (err instanceof NoAgentServerConfiguredError) {
          setError("Aucun agent-server configuré.");
        } else {
          setError("Impossible de charger les conversations.");
        }
      })
      .finally(() => setLoading(false));
  }, [agentConfigured]);

  return (
    <div>
      <PlatformPageHeader
        title="Conversations"
        description="Historique et sessions de l'agent."
        action={
          <Button size="sm" disabled={!agentConfigured}>
            <Plus className="size-4" />
            Nouvelle conversation
          </Button>
        }
      />

      <div className="p-6">
        {!agentConfigured ? (
          <EmptyState message="Configurez l'agent-server pour afficher vos conversations." />
        ) : loading ? (
          <EmptyState message="Chargement des conversations…" />
        ) : error ? (
          <EmptyState message={error} />
        ) : conversations.length === 0 ? (
          <EmptyState message="Aucune conversation pour le moment." />
        ) : (
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-3 transition-colors hover:bg-card"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{c.title || c.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.updatedAt ?? c.createdAt ?? ""}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <MessageSquare className="mb-3 size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
