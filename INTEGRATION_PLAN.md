# Plan d'intégration complet A→Z — Agent Canvas × OpenHands

> Plan progressif, non-destructif. Chaque phase : analyse → plan → implémentation
> → test → commit propre. **Aucune suppression avant validation.**

## Architecture cible Agent Canvas

```
frontend/
 ├── landing/          # landing page FR existante (app/ + components/) — INTACT
 ├── auth/             # /login /signup existants — INTACTS
 └── platform/         # interface applicative OpenHands (intégration progressive)
      ├── workspace/
      ├── conversations/
      ├── projects/
      ├── agents/
      ├── preview/
      └── terminal/

services/              # couches d'abstraction (déjà amorcées en phase 1)
 ├── agent/
 ├── websocket/
 ├── mcp/
 ├── skills/
 └── ai-provider/      # couche IA indépendante

backend/               # couche d'intégration OpenHands
 └── OpenHands integration layer (client TS + config runtime)
```

## Rappel des contraintes (règles fondamentales)
- Ne jamais supprimer : composants Agent Canvas, landing, auth, UI, fonctionnalités OpenHands.
- Ne jamais refaire OpenHands depuis zéro. Réutiliser le code officiel au maximum.
- Ne pas réécrire le moteur agent (runtime, workflows, événements, WebSockets, MCP, Skills).
- Aucune clé IA personnelle dans le code. Configuration manuelle future.

## Travail des 4 sous-agents

### Sous-agent Architecture
1. ✅ Analyser l'architecture OpenHands (frontend, client runtime, services, API, événements).
2. ✅ Identifier la stack (Vite/RR7/HeroUI ≠ Next.js) et l'incompatibilité de copie directe.
3. Définir la stratégie de coexistence : Next.js (landing/auth) + intégration platform.
4. Concevoir la couche d'intégration `backend/` (client `@openhands/typescript-client`).
5. Valider le plan A→Z avec l'utilisateur (point de validation).

### Sous-agent Frontend
1. Amorcer `frontend/platform/` avec un layout dashboard Agent Canvas.
2. Intégrer l'espace de travail agent (adapté shadcn/Tailwind, pas HeroUI).
3. Conversations + historique + sessions.
4. Projets + gestion des fichiers.
5. Terminal (xterm.js) + preview navigateur.
6. Événements temps réel (UI) branchés sur `services/websocket`.
7. Conserver animations framer-motion et design premium sombre.

### Sous-agent Backend / Services
1. Brancher `services/websocket` → client OpenHands (événements temps réel).
2. Brancher `services/agent` → runtime agent (sessions, streaming, contrôle).
3. Brancher `services/mcp` → service MCP OpenHands.
4. Brancher `services/skills` → système skills OpenHands.
5. Couche `backend/` : intégrer `@openhands/typescript-client` + gestion sessions.
6. Préparer la communication runtime + streaming.

### Sous-agent Sécurité / Production
1. Config env production Agent Canvas (`.env.example`, vars `NEXT_PUBLIC_*`).
2. Désactiver la télémétrie PostHog par défaut (indépendance cloud).
3. S'assurer qu'aucune clé n'est codée (LLM, PostHog, cloud).
4. Séparation frontend/backend, gestion d'erreurs.
5. Vérifier les connexions externes (uniquement l'agent-server configuré par l'utilisateur).
6. Build production + optimisation dépendances.

## Phases d'intégration (progressives)

### Phase A — Configuration indépendante & sécurité (Sous-agent Sécurité)
- A1. Créer `.env.example` Agent Canvas (vars runtime, AI provider, télémétrie off).
- A2. Documenter les variables (`docs/ENVIRONMENT.md`).
- A3. Configurer la désactivation télémétrie par défaut.
- A4. Git brand Agent Canvas (git user, docs links) — sans supprimer l'existant OpenHands.
- **Commit + build check.**

### Phase B — Couche IA indépendante (AI Provider Layer)
- B1. Étendre `services/ai-provider/` (déjà amorcé) : factory + provider par défaut configurable.
- B2. Aucune clé codée ; lecture depuis env/settings runtime.
- B3. Documenter le branchement futur d'un modèle/cloud personnalisé.
- **Commit + build check.**

### Phase C — Couche d'intégration backend (Sous-agent Backend)
- C1. Créer `backend/` avec intégration `@openhands/typescript-client`.
- C2. Config runtime agent (URL, session key depuis env Agent Canvas).
- C3. Brancher `services/websocket` (événements temps réel).
- C4. Brancher `services/agent` (sessions, streaming, contrôle d'état).
- C5. Brancher `services/mcp` et `services/skills`.
- **Commit + build check.**

### Phase D — Interface platform (Sous-agent Frontend)
- D1. Layout dashboard Agent Canvas (`frontend/platform/`) sous route protégée.
- D2. Espace de travail agent + chat (adapté shadcn/Tailwind).
- D3. Conversations + historique + sessions.
- D4. Projets + gestion fichiers.
- D5. Terminal (xterm.js) + preview.
- D6. Événements temps réel UI.
- **Commit + build check à chaque sous-étape.**

### Phase E — Tests & production (Sous-agent Sécurité)
- E1. Installation propre (`pnpm install`).
- E2. Build production.
- E3. Routes principales (landing, auth, platform).
- E4. Authentification.
- E5. Communication agent (smoke test via services).
- E6. Intégration OpenHands (build sans erreur, pas de régression).
- **Commit final.**

## Points de validation utilisateur
- Après Phase A+B (config indépendante + AI layer) : validation de l'orientation cloud.
- Après Phase C (backend branché) : validation de l'approche de connexion runtime.
- Avant Phase D complète : validation du design dashboard.

## État actuel (post phase 1)
- `src/services/ai-provider/` : contrats + registry (amorçage B1).
- `src/services/{websocket,agent,mcp,skills}/` : contrats + factories null (amorçage C).
- `src/platform/` : points de montage `enabled: false` (amorçage D).
- `AUDIT_CLOUD.md` : audit complet (ce document s'appuie dessus).
- Build OK, aucune suppression.
