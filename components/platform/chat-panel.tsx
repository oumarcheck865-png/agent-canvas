"use client";

/**
 * Panneau de chat principal d'Agent Canvas.
 *
 * Destination de l'utilisateur après authentification réussie. L'interface est
 * prête pour un agent IA : liste de messages, saisie, envoi.
 *
 * Aucun modèle n'est connecté pour l'instant : le panneau s'appuie sur la
 * AI Provider Layer (interfaces propres). Tant que le fournisseur n'est pas
 * configuré (statut `unconfigured`), aucune requête réseau n'est émise — un
 * message d'état clair est affiché. Le branchement d'un modèle local, serveur
 * privé, GPU personnel ou API personnalisée se fera en enregistrant un
 * fournisseur dans `aiProviderRegistry`.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  aiProviderRegistry,
  registerDefaultAIProvider,
  type ChatMessage,
  type AIProvider,
} from "@/src/services/ai-provider";

interface UIMessage {
  id: string;
  role: ChatMessage["role"];
  content: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<AIProvider | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Enregistre le fournisseur par défaut (idempotent) et expose l'état courant.
  useEffect(() => {
    registerDefaultAIProvider();
    setProvider(aiProviderRegistry.resolve("agent-canvas-default"));
  }, []);

  // Auto-scroll vers le bas à chaque nouveau message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  const providerReady = provider?.status() === "ready" && !!provider?.complete;

  const suggestions = useMemo(
    () => [
      "Présente-moi la plateforme Agent Canvas",
      "Quelles sont les étapes d'intégration OpenHands ?",
      "Comment configurer mon propre fournisseur IA ?",
    ],
    [],
  );

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const userMsg: UIMessage = {
      id: `m_${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBusy(true);

    // Tant qu'aucun fournisseur n'est configuré, on n'émet aucune requête :
    // on renvoie un message d'état explicatif au lieu d'appeler un modèle.
    if (!providerReady || !provider?.complete) {
      const reply: UIMessage = {
        id: `m_${Date.now()}_a`,
        role: "assistant",
        content:
          "Aucun fournisseur IA n'est connecté pour le moment. L'architecture AI Provider Layer est en place : branchez un modèle local, un serveur privé, un GPU personnel ou une API personnalisée via les variables d'environnement (voir docs/AI_PROVIDER.md) pour activer les réponses de l'agent.",
      };
      setMessages((prev) => [...prev, reply]);
      setBusy(false);
      return;
    }

    try {
      const history: ChatMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await provider.complete!({
        model: provider.config.models?.[0]?.id ?? "default",
        messages: history,
      });
      const reply: UIMessage = {
        id: `m_${Date.now()}_a`,
        role: "assistant",
        content: res.message.content,
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      const reply: UIMessage = {
        id: `m_${Date.now()}_a`,
        role: "assistant",
        content:
          "Une erreur est survenue lors de la communication avec le fournisseur IA. Vérifiez la configuration (docs/AI_PROVIDER.md).",
      };
      setMessages((prev) => [...prev, reply]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void handleSend(input);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Liste des messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Sparkles className="size-6" />
              </span>
              <div>
                <h2 className="text-lg font-medium tracking-tight">
                  Bienvenue sur votre espace IA
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Posez une question ou démarrez une tâche. L'interface est prête
                  pour un agent IA.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void handleSend(s)}
                    className="rounded-full border border-border bg-card/40 px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!providerReady ? (
                <p className="rounded-lg border border-dashed border-border px-4 py-2 text-xs text-muted-foreground">
                  Fournisseur IA : non connecté. Aucune requête réseau émise.
                </p>
              ) : null}
            </div>
          ) : (
            messages.map((m) => <ChatBubble key={m.id} message={m} />)
          )}
          {busy ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="size-4" />
              <span className="inline-flex gap-1">
                <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-border bg-card/30 px-4 py-4 md:px-8">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message…"
            aria-label="Message"
            disabled={busy}
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Envoyer">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
          isUser ? "bg-primary/15 text-primary" : "bg-card text-muted-foreground"
        }`}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </span>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card/60 text-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="inline-block size-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: delay }}
    />
  );
}
