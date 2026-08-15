# Agent Canvas — Project Memory

## Project overview
Agent Canvas is a professional AI platform (landing page + auth) built on top of
the `saas-landing-template` (by Gonzalo Chalé) as the design foundation. The
OpenHands engine will serve as the agent backend (not yet wired up).

## Tech stack
- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 (CSS-first config in `app/globals.css`), shadcn/ui (new-york style)
- Framer Motion, next-themes (dark default), @number-flow/react
- Package manager: pnpm

## Key commands
- `pnpm install` — install deps
- `pnpm dev` — dev server (http://localhost:3000)
- `pnpm build` — production build (also runs TypeScript check)
- `npx next build` — alternative build invocation
- Note: `pnpm lint` runs `next lint` which is DEPRECATED/removed in Next 16
  (it errors with "Invalid project directory: lint"). Use `npx next build` to
  typecheck instead.

## Environment quirks
- pnpm 11.21 no longer reads the `pnpm` field in package.json; use
  `pnpm-workspace.yaml` for `onlyBuiltDependencies` (sharp, unrs-resolver).
- pnpm pre-run deps status check fails on ignored builds; disable with
  `pnpm config set verify-deps-before-run false`, or run `pnpm rebuild sharp unrs-resolver`.
- `vendor/` (cloned OpenHands + template source) MUST be excluded from the
  TypeScript `include` path. tsconfig.json `exclude` includes `vendor`.
- `vendor/` is gitignored and is NOT part of the repo.

## Structure
- `app/` — Next.js App Router (layout, page, providers, login/, signup/,
  platform/* — dashboard + 6 modules)
- `components/` — landing sections (hero, navbar, pricing, testimonials, stats,
  partners, faq, footer, theme-switcher) + `auth-form.tsx` (shared login/signup)
- `components/ui/` — shadcn/ui primitives (button, card, dialog, dropdown-menu,
  input, navigation-menu, separator, tooltip, accordion)
- `components/platform/` — platform UI (platform-sidebar, platform-top-bar,
  platform-page-header, use-platform-status) — design shadcn/Tailwind sombre
- `lib/utils.ts` — `cn()` helper
- `src/` — intégration progressive de la plateforme OpenHands :
  - `src/services/config.ts` — runtimeConfig reader (NEXT_PUBLIC_AI_PROVIDER_*,
    NEXT_PUBLIC_AGENT_SERVER_*) — phase A
  - `src/services/ai-provider/` — AI Provider Layer indépendant
    (default-provider.ts) — phase B
  - `src/services/agent/` — branché sur `backend/conversations-api.ts` — phase C
  - `src/services/websocket/` — branché sur `backend/agent-server-socket.ts`
  - `src/services/{mcp,skills}/` — contrats non branchés (réservés)
- `backend/` — couche d'intégration OpenHands (phase C) :
  - `agent-server-client.ts` (HTTP fetch), `agent-server-socket.ts` (WebSocket
    natif, handshake auth), `conversations-api.ts` (CRUD), `index.ts` (barrel)
- `docs/` — ENVIRONMENT.md, AI_PROVIDER.md, BACKEND.md, AUDIT_CLOUD.md,
  INTEGRATION_PLAN.md
- `vendor/OpenHands` — OpenHands reference repo (agent backend, do NOT modify
  agent logic / WebSockets / MCP / Skills / workflows at this stage)
- `vendor/saas-landing-template` — original template source (reference only)
- `INTEGRATION.md`, `INTEGRATION_PLAN.md` — cartographie OpenHands → Agent Canvas

## Integration progress (phases A→D DONE, E DONE, production mission DONE)
- Phase A (security/config) — DONE: `.env.example`, `src/services/config.ts`,
  `docs/ENVIRONMENT.md`. Aucune valeur cloud codée.
- Phase B (AI Provider Layer) — DONE: `src/services/ai-provider/default-provider.ts`.
- Phase C (backend) — DONE: `backend/*` (fetch + WebSocket natifs, PAS
  @openhands/typescript-client — incompatible Next.js via HeroUI/RR7). Services
  `agent` + `websocket` branchés.
- Phase D (platform frontend) — DONE: `app/platform/*` (layout + modules),
  `components/platform/*`. Landing navbar masquée sur /platform (aucune
  suppression). 14 routes build OK.
- Phase E (tests/validation) — DONE: `docs/PHASE_E_VALIDATION.md`.
- Production mission — DONE (branche `feat/production-platform`) :
  - Parcours utilisateur : Landing → Login/Signup → Chat (auth découplée,
    `src/services/auth/`, RequireAuth/RequireGuest).
  - Panneau de chat principal `/platform/chat` (AI Provider Layer, aucun modèle
    connecté). AI Provider Layer étendu (local/self-hosted/self-hosted-gpu/
    openai/anthropic/custom + streaming).
  - Intégration progressive : `backend/{files,terminal}-api.ts` +
    `src/services/{files,terminal}/`.
  - CI/CD : `.github/workflows/{ci,deploy-prep}.yml` (pnpm, lint, typecheck,
    build, security). ESLint 9 flat (`eslint.config.mjs`).
  - `docs/{CLOUD_INDEPENDENCE,DEPLOYMENT}.md`. Télémétrie désactivée.
- Règle tenue : zéro suppression de fichier, zéro fonctionnalité réécrite,
  build vérifié à chaque phase.

## OpenHands platform (vendor/OpenHands)
- Stack DIFFÉRENTE de la landing : Vite + React Router 7 + HeroUI
  (@heroui/react) + Zustand + TanStack Query + @openhands/typescript-client.
  Alias `#/*` → `src/*`. Pkg `@openhands/agent-canvas` v1.13.0.
- Les composants OpenHands ne sont PAS copiés tels quels dans Next.js
  (casserait le build). On crée des couches d'abstraction dans `src/services/`
  et des points de montage dans `src/platform/`.
- Le moteur agent (runtime Python) est côté agent-server, accédé via
  @openhands/typescript-client. Le repo frontend ne contient pas le runtime.
- Règle : ne pas réécrire le moteur OpenHands (runtime, websockets, MCP,
  skills, événements). Réutiliser au maximum le code officiel.

## Design conventions
- Dark premium theme is the default; light mode supported via next-themes.
- Preserve existing components, animations (framer-motion), and structure.
- Adapt content to French + Agent Canvas identity; do not rebuild from scratch.

## Git
- Branch: master (local only, no remote configured)
- Commit author: openhands <openhands@all-hands.dev>
- Commits: Initial scaffold → fondation template → phases 1, A, B, C, D
- `.env*.local` gitignored; only `.env.example` tracked (placeholders only).
- `vendor/` gitignored (not part of the repo).
