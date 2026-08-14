# Audit d'indépendance cloud — Agent Canvas

Objectif : Agent Canvas doit pouvoir fonctionner avec **votre propre
fournisseur IA**, sans dépendance obligatoire au cloud OpenHands/OpenAI ou à
un service tiers.

## Résultat de l'audit

**Aucune dépendance cloud obligatoire dans le code Agent Canvas.**

### Dépendances (package.json)
Uniquement des bibliothèques UI et framework :
- `next`, `react`, `react-dom`
- `@radix-ui/*` (primitives UI), `lucide-react`, `framer-motion`
- `tailwindcss`, `class-variance-authority`, `clsx`, `tailwind-merge`
- `next-themes`, `@number-flow/react`

Aucun SDK cloud, aucun client PostHog/Sentry/Analytics, aucun
`@openhands/typescript-client` (incompatible Next.js — remplacé par des
adaptateurs `fetch` + `WebSocket` natifs dans `backend/`).

### Scan du code source (hors `vendor/`, `docs/`, `.next/`)
- Aucune clé API codée en dur (`phc_*`, `sk-*`…).
- Aucun hôte cloud codé (`z.openhands.dev`, `app.all-hands.dev`,
  `prod-runtime…`, `openhands/glm`, `ghcr.io/openhands`).
- Aucun appel réseau émis tant que l'agent-server et le fournisseur IA ne sont
  pas configurés.

### Télémétrie
- `runtimeConfig.telemetry.disabled = true` par défaut
  (`NEXT_PUBLIC_TELEMETRY_DISABLED=true` dans `.env.example` / `.env.local`).
- Télémétrie anonyme Next.js désactivée (`.env.local`, `next.config.mjs`).

## Architecture AI Provider Layer (interfaces propres, aucun modèle connecté)

La couche `src/services/ai-provider/` expose des contrats indépendants de toute
implémentation. Familles supportées par l'architecture :

| Famille | Usage |
| ------- | ----- |
| `local` | Modèle local (ex. llama.cpp / Ollama sur la machine) |
| `self-hosted` | Serveur privé auto-hébergé |
| `self-hosted-gpu` | Serveur privé sur GPU personnel |
| `openai` | API compatible OpenAI (cloud ou privé) |
| `anthropic` | API compatible Anthropic |
| `custom` | API personnalisée non standard |

Interface (`AIProvider`) : `status()`, `listModels()`, `complete()`, `stream()`.
Aucun modèle n'est connecté pour l'instant : le fournisseur par défaut reste à
l'état `unconfigured` et n'émet aucune requête réseau.

## Branchement de votre propre fournisseur IA

1. Renseignez les variables d'environnement (voir `.env.example`,
   `docs/ENVIRONMENT.md`, `docs/AI_PROVIDER.md`) :
   - `NEXT_PUBLIC_AI_PROVIDER_KIND` (local | self-hosted | self-hosted-gpu |
     openai | anthropic | custom)
   - `NEXT_PUBLIC_AI_PROVIDER_BASE_URL`
   - `NEXT_PUBLIC_AI_PROVIDER_MODEL`
   - `NEXT_PUBLIC_AI_PROVIDER_API_KEY` (jamais dans le code)
2. Implémentez un `AIProvider` (méthodes `complete`/`stream`) et enregistrez-le
   dans `aiProviderRegistry`, ou étendez `defaultAIProvider`.

Le moteur OpenHands (runtime, websockets, MCP, skills) reste intact dans
`vendor/` et n'est pas réécrit — il est appelé via le contrat officiel de
l'agent-server (`backend/`).
