# Intégration progressive OpenHands → Agent Canvas

Ce document cartographie les modules de la plateforme OpenHands et leur point
d'intégration dans Agent Canvas. Il sert de référence pour les phases futures.

## État de l'art

- **Landing Agent Canvas** : Next.js 16 (App Router) + Tailwind 4 + shadcn/ui +
  framer-motion. Vit dans `app/` et `components/` à la racine. **Non touchée.**
- **Plateforme OpenHands** : application Vite + React Router 7 + HeroUI +
  Zustand + TanStack Query + `@openhands/typescript-client`. Vit dans
  `vendor/OpenHands/src/`. Stack **différente** de la landing : les composants
  ne sont pas copiés tels quels (ils casseraient le build Next.js).
- **Moteur agent OpenHands** : runtime côté agent-server (Python), accédé via
  `@openhands/typescript-client`. **Non réécrit, intact.**

## Structure d'intégration créée (`src/`)

```
src/
├── landing/              # ancrage de la landing existante (non déplacée)
├── platform/             # modules plateforme (intégration progressive)
│   ├── dashboard/
│   ├── chat/
│   ├── agents/
│   ├── projects/
│   ├── preview/
│   └── terminal/
├── services/             # couches d'abstraction (pont vers OpenHands)
│   ├── websocket/
│   ├── agent/
│   ├── mcp/
│   ├── skills/
│   └── ai-provider/      # Étape 4 : couche de séparation fournisseur IA
└── components/platform/  # composants UI partagés (à venir)
```

À ce stade, chaque module expose un point de montage (`enabled: false`) et
chaque service expose des contrats (types/interfaces) + factories renvoyant
`null`. Aucune implémentation n'est branchée.

## Cartographie modules → code OpenHands

| Module utilisateur      | Code OpenHands (`vendor/OpenHands/src/`)                                              |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Interface / Dashboard   | `routes/home.tsx`, `routes/index-home.tsx`, `components/features/home/`               |
| Chat agent              | `components/features/chat/`, `components/features/conversation/`, `hooks/chat/`       |
| Gestion conversations   | `api/conversation-service/`, `components/features/conversation-panel/`                |
| Historique              | `api/event-service/`, `hooks/query/use-conversation-history`, `types/agent-server/core/events/` |
| Gestion projets         | `api/workspaces-service/`, `components/features/home/workspace-dropdown/`, `api/git-service/` |
| Terminal                | `components/features/terminal/` (xterm), `api/bash-service/`, WebSocket bash-events   |
| Fichiers                | `components/features/files-tab/`, `components/features/files/`, `api/runtime-service/` |
| Preview                 | `components/features/browser/`                                                         |
| Système d'événements    | `types/agent-server/core/events/`, `contexts/conversation-websocket-context.tsx`      |
| WebSockets              | `contexts/conversation-websocket-context.tsx`, `hooks/use-websocket.ts`, `utils/websocket-url.ts`, `utils/websocket-auth.ts` |
| MCP                     | `api/mcp-service/`, `api/mcp-health/`, `components/features/mcp-page/`                |
| Skills                  | `components/features/skills/`, `components/features/plugins/`, `routes/skills-settings.tsx` |
| Workflows agents        | `api/automation-service/`, `components/features/automations/`, `routes/automations-*` |
| Runtime agent           | `api/runtime-service/`, `api/agent-server-client-options.ts`, `@openhands/typescript-client` |
| Paramètres / LLM        | `routes/settings/llm-settings.tsx`, `api/settings-service/`, `api/profiles-service/`  |

## Services d'abstraction (`src/services/`)

| Service       | Contrat                                          | Cible OpenHands                                   |
| ------------- | ------------------------------------------------ | ------------------------------------------------- |
| `websocket/`  | `AgentWebSocketClient`                           | `hooks/use-websocket.ts`, `contexts/conversation-websocket-context.tsx` |
| `agent/`      | `AgentRuntimeController`                         | `api/runtime-service/`, `@openhands/typescript-client`     |
| `mcp/`        | `MCPClient`                                      | `api/mcp-service/mcp-service.api.ts`              |
| `skills/`     | `SkillsClient`                                   | `components/features/skills/`, `api/`             |
| `ai-provider/`| `AIProvider` + `AIProviderRegistry`              | (futur : remplacement du fournisseur IA)          |

## AI Provider Layer (Étape 4)

La couche `src/services/ai-provider/` prépare le remplacement futur du
fournisseur IA sans toucher aux connexions existantes :

- `types.ts` : contrats (`AIProvider`, `AIProviderConfig`, `ChatCompletion*`).
- `registry.ts` : registre singleton + helpers (`defineAIProvider`).

Pour le moment :
- Aucun modèle IA n'est connecté.
- Aucune connexion existante n'est supprimée.
- Les workflows agents OpenHands ne sont pas modifiés.

Le branchement futur permettra de connecter : un modèle IA personnalisé, des
clés API propriétaires, un cloud privé, des configurations sur mesure.

## Règles respectées

- Aucun fichier existant supprimé.
- Aucun composant de la landing supprimé.
- Aucun système actuel remplacé.
- Aucune fonctionnalité OpenHands modifiée.
- Le build actuel reste fonctionnel (vérifié via `next build`).

## Prochaines phases (à valider)

1. Branchement progressif des services (websockets → agent → mcp → skills).
2. Adaptation du dashboard au style Agent Canvas (sans supprimer l'existant).
3. Connexion d'un fournisseur IA via l'AI Provider Layer.
