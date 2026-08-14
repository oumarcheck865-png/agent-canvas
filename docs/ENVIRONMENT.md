# Configuration d'environnement — Agent Canvas

Agent Canvas est une plateforme IA **indépendante du cloud OpenHands/OpenAI**.
Ce document décrit les variables d'environnement disponibles.

## Principes

- **Aucune clé secrète** n'est codée en dur dans le code source.
- **Aucune télémétrie** n'est envoyée par défaut.
- Le **fournisseur IA**, les **clés API** et le **runtime agent** sont
  configurés manuellement par le propriétaire du projet.
- Copiez `.env.example` en `.env.local` et renseignez les valeurs selon votre
  déploiement.

## Variables

### Runtime agent (agent-server OpenHands)

| Variable | Description | Défaut |
| -------- | ----------- | ------ |
| `NEXT_PUBLIC_AGENT_SERVER_BASE_URL` | URL de l'agent-server | vide (config manuelle) |
| `NEXT_PUBLIC_AGENT_SERVER_SESSION_API_KEY` | Clé de session agent-server | vide (dans `.env.local`) |
| `NEXT_PUBLIC_AGENT_WORKING_DIR` | Répertoire de travail des conversations | `/workspace/project/agent-canvas` |

### AI Provider Layer (fournisseur IA indépendant)

La couche `src/services/ai-provider/` permet de configurer son propre modèle IA.
Aucune valeur par défaut n'est codée — le branchement se fait via ces variables
ou via l'interface.

| Variable | Description | Défaut |
| -------- | ----------- | ------ |
| `NEXT_PUBLIC_AI_PROVIDER_KIND` | Famille de fournisseur (`openai`, `anthropic`, `custom`, `self-hosted`) | vide |
| `NEXT_PUBLIC_AI_PROVIDER_BASE_URL` | Point d'accès du fournisseur | vide |
| `NEXT_PUBLIC_AI_PROVIDER_MODEL` | Identifiant du modèle | vide |
| `NEXT_PUBLIC_AI_PROVIDER_API_KEY` | Clé API du fournisseur | **vide — à saisir côté serveur ou dans l'interface** |

> ⚠️ Ne jamais committer une clé API. Utilisez `.env.local` (gitignoré) ou un
> gestionnaire de secrets côté serveur.

### Télémétrie

| Variable | Description | Défaut |
| -------- | ----------- | ------ |
| `NEXT_PUBLIC_TELEMETRY_DISABLED` | Désactive toute télémétrie (PostHog/tiers) | `"true"` |

Par défaut, **aucune télémétrie** n'est envoyée. Agent Canvas n'envoie pas de
données à PostHog, à OpenHands Cloud ou à un service tiers.

### Authentification

| Variable | Description | Défaut |
| -------- | ----------- | ------ |
| `NEXT_PUBLIC_AUTH_REQUIRED` | Authentification requise pour la plateforme | `"false"` |

### Application

| Variable | Description | Défaut |
| -------- | ----------- | ------ |
| `NEXT_PUBLIC_APP_NAME` | Nom affiché dans l'interface | `"Agent Canvas"` |

## Indépendance du cloud

Contrairement à la référence OpenHands (`vendor/OpenHands`), Agent Canvas :

- n'utilise **pas** `VITE_LOCK_TO_CLOUD` ni de backend cloud OpenHands ;
- n'envoie **pas** de télémétrie PostHog par défaut ;
- ne référence **pas** `app.all-hands.dev` ni `*.prod-runtime.all-hands.dev` ;
- n'inclut **aucune** clé API LLM codée (modèle et clés configurables).

## Côté serveur

Les variables sans préfixe `NEXT_PUBLIC_` ne sont accessibles qu'en contexte
serveur (API routes Next.js, server components). Utilisez-les pour les secrets
qui ne doivent jamais atteindre le navigateur (clés API LLM, etc.).

## Voir aussi

- [`AUDIT_CLOUD.md`](./AUDIT_CLOUD.md) — audit complet des connexions cloud.
- [`INTEGRATION_PLAN.md`](./INTEGRATION_PLAN.md) — plan d'intégration A→Z.
- [`INTEGRATION.md`](./INTEGRATION.md) — cartographie des modules.
