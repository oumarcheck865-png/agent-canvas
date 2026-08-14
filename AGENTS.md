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
- `app/` — Next.js App Router (layout, page, providers, login/, signup/)
- `components/` — landing sections (hero, navbar, pricing, testimonials, stats,
  partners, faq, footer, theme-switcher) + `auth-form.tsx` (shared login/signup)
- `components/ui/` — shadcn/ui primitives (button, card, dialog, dropdown-menu,
  input, navigation-menu, separator, tooltip, accordion)
- `lib/utils.ts` — `cn()` helper
- `vendor/OpenHands` — OpenHands reference repo (agent backend, do NOT modify
  agent logic / WebSockets / MCP / Skills / workflows at this stage)
- `vendor/saas-landing-template` — original template source (reference only)

## Design conventions
- Dark premium theme is the default; light mode supported via next-themes.
- Preserve existing components, animations (framer-motion), and structure.
- Adapt content to French + Agent Canvas identity; do not rebuild from scratch.

## Git
- Branch: master (local only, no remote configured)
- Commit author: openhands <openhands@all-hands.dev>
