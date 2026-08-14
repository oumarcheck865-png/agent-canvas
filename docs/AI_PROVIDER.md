# AI Provider Layer — Couche IA indépendante

La couche `src/services/ai-provider/` permet au propriétaire du projet de
configurer **son propre modèle IA**, **ses propres clés API**, **son propre
fournisseur LLM**, **son propre cloud** et **ses propres paramètres** — sans
dépendre du cloud OpenHands/OpenAI.

## Objectif

Créer une plateforme IA indépendante où :

- aucun modèle IA n'est forcé par défaut ;
- aucune clé API n'est codée dans le code source ;
- le fournisseur LLM est choisi et configuré manuellement ;
- un cloud privé ou self-hosté peut être branché.

## État actuel (phase B)

La couche expose :

- `types.ts` — contrats : `AIProvider`, `AIProviderConfig`, `ChatCompletion*`,
  `ModelInfo`, `AIProviderKind`.
- `registry.ts` — registre singleton (`aiProviderRegistry`) + helpers
  (`defineAIProvider`, `isAIProviderConfig`).
- `default-provider.ts` — fournisseur par défaut d'Agent Canvas, lu depuis
  `runtimeConfig` (variables d'environnement). Reste `unconfigured` tant que
  l'utilisateur n'a rien configuré — aucune requête réseau n'est émise.

### Aucune clé codée

Le fournisseur par défaut ne contient **aucune** clé API ni URL de cloud
hardcodée. Toute la configuration provient des variables d'environnement :

```
NEXT_PUBLIC_AI_PROVIDER_KIND=openai|anthropic|custom|self-hosted
NEXT_PUBLIC_AI_PROVIDER_BASE_URL=...
NEXT_PUBLIC_AI_PROVIDER_MODEL=...
NEXT_PUBLIC_AI_PROVIDER_API_KEY=...   # côté serveur / .env.local UNIQUEMENT
```

Tant que ces variables sont vides, le fournisseur reste `unconfigured`.

## Branchement futur

Lors des prochaines phases, l'utilisateur pourra :

1. Configurer son fournisseur via `.env.local` ou l'interface.
2. Enregistrer des fournisseurs supplémentaires via `aiProviderRegistry.register()`.
3. Brancher un transport réseau concret (fetch/streaming) via l'implémentation
  des méthodes `listModels` / `complete` — le tout derrière la même interface,
  sans toucher aux workflows agents OpenHands.

## Utilisation

```ts
import { aiProviderRegistry, registerDefaultAIProvider } from "@/src/services/ai-provider";

// Au démarrage de l'app :
registerDefaultAIProvider();

// Résoudre le fournisseur actif :
const provider = aiProviderRegistry.resolve("agent-canvas-default");
if (provider?.status() === "ready") {
  // Le fournisseur est configuré et prêt à être utilisé.
}
```

## Règles respectées

- Aucune clé IA personnelle ajoutée.
- Aucune connexion cloud OpenHands/OpenAI.
- Aucune fonctionnalité agent modifiée.
- Aucun fichier existant supprimé.
