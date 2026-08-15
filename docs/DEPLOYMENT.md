# Déploiement — Agent Canvas

Guide de déploiement production. Agent Canvas est une application Next.js 16
(App Router, sortie statique + server) indépendante du cloud.

## Prérequis
- Node.js 20+
- pnpm 9+
- Le code du dépôt (`vendor/` n'est pas requis en production — gitignored)

## 1. Variables d'environnement

Copiez `.env.example` en `.env.local` (développement) ou configurez les
variables dans votre plateforme de déploiement (production). **Aucune clé API
ne doit être committée.**

| Variable | Description | Défaut |
| -------- | ----------- | ------ |
| `NEXT_PUBLIC_APP_NAME` | Nom affiché | `Agent Canvas` |
| `NEXT_PUBLIC_TELEMETRY_DISABLED` | Télémétrie app désactivée | `true` |
| `NEXT_TELEMETRY_DISABLED` | Télémétrie Next.js désactivée | `true` |
| `NEXT_PUBLIC_AUTH_REQUIRED` | Auth requise pour /platform | `false` |
| `NEXT_PUBLIC_AGENT_SERVER_BASE_URL` | URL agent-server OpenHands | vide |
| `NEXT_PUBLIC_AGENT_SERVER_SESSION_API_KEY` | Clé session agent-server | vide |
| `NEXT_PUBLIC_AGENT_WORKING_DIR` | Répertoire travail conversations | `/workspace/project/agent-canvas` |
| `NEXT_PUBLIC_AI_PROVIDER_KIND` | Famille IA (local/self-hosted/…) | vide |
| `NEXT_PUBLIC_AI_PROVIDER_BASE_URL` | Point d'accès IA | vide |
| `NEXT_PUBLIC_AI_PROVIDER_MODEL` | Modèle IA | vide |
| `NEXT_PUBLIC_AI_PROVIDER_API_KEY` | Clé IA (**jamais dans le code**) | vide |

### Secrets
- Toutes les clés (`*_API_KEY`, `*_SESSION_API_KEY`) doivent être stockées
  dans les secrets de la plateforme de déploiement (GitHub Actions secrets,
  Vercel/Netlify env vars, etc.), jamais dans le dépôt.
- `.env*.local` est gitignored.
- Le workflow CI inclut une étape de scan anti-secrets codés.

## 2. Build production

```bash
pnpm install --frozen-lockfile
pnpm build
```

Le build génère `.next/` (sortie optimisée). TypeScript est vérifié pendant le
build ; `pnpm typecheck` et `pnpm lint` sont disponibles séparément.

## 3. Démarrer en production

```bash
pnpm start
# ou : pnpm exec next start -p $PORT
```

Par défaut le serveur écoute sur le port 3000 (ou `$PORT`).

## 4. CI/CD (GitHub Actions)

- `.github/workflows/ci.yml` — sur chaque push/PR :
  - `quality` : pnpm install → lint → typecheck → build.
  - `security` : audit dépendances + scan anti-secrets codés.
- `.github/workflows/deploy-prep.yml` — sur push `master` (ou manuel) :
  - build production + upload d'artifact (rétention 7 jours).

Aucun secret n'est requis pour faire passer le CI (toutes les variables
publiques ont des valeurs par défaut sûres).

## 5. Plateformes recommandées

- **Vercel** : détecte Next.js automatiquement. Configurez les variables
  d'environnement dans le dashboard. Build command `pnpm build`.
- **Docker / VPS** : `pnpm build && pnpm start` derrière un reverse proxy
  (Caddy/Nginx). Le workflow `deploy-prep` fournit un artifact `.next/`.
- **Sortie statique** : les pages actuelles sont pré-rendues (statiques) ;
  un export statique est possible si aucune route dynamique serveur n'est
  utilisée.

## 6. Branchement de votre propre fournisseur IA

Voir `docs/CLOUD_INDEPENDENCE.md` et `docs/AI_PROVIDER.md`. Aucun modèle
n'est connecté par défaut ; la AI Provider Layer expose des interfaces propres
(local, serveur privé, GPU personnel, API personnalisée).
