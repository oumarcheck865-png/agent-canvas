# Audit des connexions cloud — OpenHands / Agent Canvas

> Audit complet et **lecture seule** réalisé sur `vendor/OpenHands` (référence
> OpenHands) et sur le projet Agent Canvas (`/workspace/project`).
> Objectif : identifier toutes les connexions liées au cloud OpenHands/OpenAI
> afin de rendre Agent Canvas indépendante, **sans supprimer de fonctionnalités
> agent**.

## 1. Architecture constatée

### OpenHands (`vendor/OpenHands`)
- **Package** : `@openhands/agent-canvas` v1.13.0 (app frontend complète).
- **Stack** : Vite 8 + React Router 7 + HeroUI (`@heroui/react`) + Zustand +
  TanStack Query + i18next + Monaco Editor + xterm.js.
- **Alias** : `#/*` → `./src/*`.
- **Client runtime** : `@openhands/typescript-client` v1.38.0 (communique avec
  l'**agent-server** OpenHands — runtime Python, NON inclus dans ce repo).
- **Routing** (React Router) : `conversations`, `conversations/:id`,
  `conversations/:id/panel`, `launch`, `customize`, `skills`, `plugins`, `mcp`,
  `settings/*` (llm, agent, agents, condenser, agent-context, verification, app,
  secrets), `automations/*`, `oauth/device/verify`, conversation partagée.

### Agent Canvas (`/workspace/project`)
- **Stack** : Next.js 16 (App Router, Turbopack) + Tailwind 4 + shadcn/ui +
  framer-motion + next-themes.
- **Existant** : landing page FR (`/`), auth (`/login`, `/signup`), structure
  `src/` d'intégration préparée (phase 1).
- **Aucune connexion cloud active** : pas de `.env`, `next.config` vide, aucune
  clé, aucun endpoint externe dans le code Agent Canvas.

## 2. Connexions cloud identifiées (dans OpenHands)

### 2.1 Télémétrie PostHog — À DÉSACTIVER / REMPLACER
| Élément | Valeur | Localisation |
| ------- | ------ | ------------ |
| Clé API PostHog | `phc_…` (valeur en clair dans le vendor — non reprise ici) | `config/defaults.json` → `telemetry.posthogApiKey` |
| Host PostHog | `https://us.i.posthog.com` | `config/defaults.json` → `telemetry.posthogHost` |
| Proxy anti-adblock | `https://z.openhands.dev` | `mocks/analytics-handlers.ts`, `services/telemetry.ts` |
| Config par défaut | `{ provider: "posthog" }` | `components/providers/agent-server-ui-providers.tsx` → `DEFAULT_AGENT_SERVER_ANALYTICS` |
| Événement install | `canvas_install` envoyé immédiatement (sans consentement) | `services/telemetry.ts` |
| Vars env | `VITE_POSTHOG_API_KEY`, `VITE_POSTHOG_HOST`, `VITE_POSTHOG_UI_HOST`, `VITE_DO_NOT_TRACK` | `services/telemetry.ts`, `.env.sample` |

> Par défaut, la télémétrie est envoyée au **projet PostHog d'OpenHands**.
> Désactivation possible via `VITE_DO_NOT_TRACK=1` ou Do Not Track navigateur.

### 2.2 OpenHands Cloud — À DÉSACTIVER / NE PAS BRANCHER
| Élément | Valeur | Localisation |
| ------- | ------ | ------------ |
| Hôte app prod | `https://app.all-hands.dev` | `utils/constants.ts` → `PRODUCTION` |
| Domaines cloud | `all-hands.dev` (legacy), `openhands.dev` (actuel) | `api/agent-server-config.ts` |
| Runtime cloud | `*.prod-runtime.all-hands.dev` | `api/runtime-service/`, `api/bash-service/`, `api/git-service/` |
| Lock-to-cloud | `VITE_LOCK_TO_CLOUD` | `api/agent-server-config.ts`, `default-backend.ts` |
| Backend cloud locked | `LOCKED_CLOUD_BACKEND_ID = "locked-cloud"`, nom `"OpenHands Cloud"` | `api/backend-registry/default-backend.ts` |
| Proxy cloud | `api/cloud/proxy.ts`, `api/cloud/client.ts` (`CloudClient`) | routage CORS via agent-server |
| Contact email | `contact@openhands.dev` | `i18n/translation.json` |

### 2.3 LLM par défaut — À RENDRE CONFIGURABLE (déjà sans clé)
| Élément | Valeur | Localisation |
| ------- | ------ | ------------ |
| Modèle par défaut | `openhands/glm-5.2` | `services/settings.ts` → `DEFAULT_SETTINGS` |
| `llm_base_url` | `""` (vide) | `services/settings.ts` |
| `llm_api_key` | `null` (aucune clé) | `services/settings.ts` |
| Vendeur subscription | `OPENAI_SUBSCRIPTION_VENDOR` | `api/agent-server-adapter.ts` |
| Providers reconnus | openai, anthropic, litellm_proxy… | `utils/map-provider.ts` |

> Aucune clé LLM n'est codée en dur. Les identifiants sont saisis par
> l'utilisateur via la page `settings/llm`. Le modèle `openhands/glm-5.2` est
> une route provider LiteLLM — à remplacer par un modèle configurable.

### 2.4 Identité Git par défaut
| Élément | Valeur |
| ------- | ------ |
| `git_user_name` | `openhands` |
| `git_user_email` | `openhands@all-hands.dev` |

### 2.5 Liens documentation
- `docs.all-hands.dev`, `docs.openhands.dev` dans `utils/tips.ts`,
  `manifests/`, `i18n/translation.json`.

### 2.6 Images / paquets cloud
| Élément | Valeur |
| ------- | ------ |
| Image agent-server | `ghcr.io/openhands/agent-server` |
| Image agent-canvas | `ghcr.io/openhands/agent-canvas` |
| Paquets PyPI | `openhands-agent-server`, `openhands-automation`, `openhands-tools`, `openhands-workspace` |

## 3. Variables d'environnement OpenHands (toutes `VITE_*`)

```
VITE_BACKEND_BASE_URL     # URL agent-server (défaut 127.0.0.1:8000)
VITE_SESSION_API_KEY      # clé session agent-server
VITE_WORKING_DIR          # dir de travail conversations
VITE_LOCK_TO_CLOUD        # verrouiller sur cloud OpenHands
VITE_AUTH_REQUIRED        # forcer auth
VITE_ENABLE_BROWSER_TOOLS # activer BrowserToolSet
VITE_LOAD_PUBLIC_SKILLS   # charger skills publiques
VITE_BASE_PATH            # sous-chemin SPA (défaut /canvas)
VITE_USE_TLS / VITE_INSECURE_SKIP_VERIFY
VITE_MOCK_API             # mocking MSW
VITE_POSTHOG_API_KEY / VITE_POSTHOG_HOST / VITE_POSTHOG_UI_HOST
VITE_DO_NOT_TRACK
VITE_HOME_AUTOMATIONS_DEMO
```

## 4. Conclusion de l'audit

- **Agent Canvas n'a actuellement AUCUNE connexion cloud active.** ✅
- Les connexions cloud vivent **uniquement dans `vendor/OpenHands`** (référence,
  non branchée à notre build Next.js).
- L'agent-server (runtime Python) n'est pas dans le repo frontend ; il est
  consommé via `@openhands/typescript-client`. Les fonctionnalités agent
  (workflows, événements, WebSockets, MCP, Skills) dépendent de ce runtime.
- **Stratégie** : lors de l'intégration, on ne réécrit pas le moteur. On crée
  une couche de configuration Agent Canvas **indépendante du cloud** :
  - télémétrie PostHog désactivée par défaut ;
  - aucun `LOCK_TO_CLOUD` / backend cloud OpenHands ;
  - LLM configurable via l'AI Provider Layer (aucune clé codée) ;
  - identité Git et branding Agent Canvas.

## 5. Règles respectées pendant l'audit
- Lecture seule : aucun fichier modifié ni supprimé.
- Aucune fonctionnalité agent touchée.
- Aucune clé secrète ajoutée au code.
