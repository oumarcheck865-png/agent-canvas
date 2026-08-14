# Agent Canvas

Plateforme IA professionnelle propulsée par OpenHands.

Ce projet s'appuie sur le template [saas-landing-template](https://github.com/gonzalochale/saas-landing-template)
de Gonzalo Chalé comme fondation de design : structure, composants UI, animations
et design system premium sombre sont conservés et adaptés à l'identité Agent Canvas.

## Stack technique

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives / shadcn/ui
- Framer Motion
- next-themes (mode sombre/clair)

## Démarrage

### Prérequis

- Node.js 20+
- pnpm (recommandé)

### Installation

```bash
pnpm install
```

> Si pnpm n'est pas installé : `npm install -g pnpm`.

### Développement

```bash
pnpm dev
```

Ouvrir http://localhost:3000 dans le navigateur.

## Scripts disponibles

- `pnpm dev` — serveur de développement (Turbopack)
- `pnpm build` — build de production
- `pnpm start` — serveur de production
- `pnpm lint` — linter (config ESLint Next.js)

## Structure du projet

```text
app/
        layout.tsx
        page.tsx
        globals.css
        providers.tsx
components/
        hero.tsx
        navbar.tsx
        pricing.tsx
        testimonials.tsx
        stats.tsx
        partners.tsx
        faq.tsx
        footer.tsx
        theme-switcher.tsx
        ui/
lib/
        utils.ts
```

## Intégration OpenHands

Le moteur [OpenHands](https://github.com/All-Hands-AI/OpenHands) sera utilisé
comme backend agent. Le dépôt de référence est conservé localement dans
`vendor/OpenHands`. La logique agent (WebSockets, MCP, Skills, workflows) n'est
pas modifiée à ce stade.

## Déploiement

Le projet est déployable sur toute plateforme supportant Next.js (recommandé : Vercel).

1. Pousser le dépôt sur GitHub
2. Importer le projet chez l'hébergeur
3. Build : `pnpm build`
4. Start : `pnpm start`

## Licence

Le template source est sous licence MIT — voir [license.txt](license.txt).
