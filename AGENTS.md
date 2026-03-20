# Agent Guide

Minimal repo index for coding agents. Prefer the source files and web docs below over copying framework details into this file.

## Read First

- `README.md`
- If you touch Convex code, read `src/convex/_generated/ai/guidelines.md` first. Treat it as the authoritative source for Convex patterns in this repo.

## Source Map

- Tooling and scripts: `package.json`
- Environment variables: `.env.example`
- App providers and global layout: `src/routes/+layout.svelte`, `src/routes/+layout.server.ts`, `src/hooks.server.ts`
- Auth integration: `src/lib/components/ClerkConvexBridge.svelte`, `src/convex/auth.config.ts`, `src/convex/lib/auth.ts`
- Convex schema and functions: `src/convex/schema.ts`, `src/convex/*.ts`
- Routes and UI: `src/routes/**`, `src/lib/components/**`

## Working Rules

- Keep this file short. Update source files or `README.md` instead of duplicating implementation details here.
- Prefer current web documentation for framework behavior.
- Convex-generated guidance overrides generic Convex assumptions.

## Web Docs

- SvelteKit: https://svelte.dev/docs/kit
- Clerk custom flows: https://clerk.com/docs/custom-flows/overview
- Convex auth with Clerk: https://docs.convex.dev/auth/clerk
- Tailwind CSS: https://tailwindcss.com/docs
