# receipts.cv

Phase 1 scaffold for `receipts.cv`: a private work log that helps professionals keep track of daily wins and turn them into career receipts.

## Stack

- SvelteKit 2 + Svelte 5
- Bun for package management and scripts
- Tailwind CSS v4
- Convex for database, backend functions, and realtime queries
- Clerk JS for auth UI and session management
- Vercel adapter for frontend deployment

## Local setup

1. Install dependencies:

```sh
bun install
```

2. Copy the environment template:

```sh
cp .env.example .env.local
```

3. Fill in your local env values in `.env.local`:

- `PUBLIC_CONVEX_URL`
- `PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

4. In the Convex dashboard, add:

- `CLERK_JWT_ISSUER_DOMAIN`

5. If you are using a Clerk JWT template for Convex, set `PUBLIC_CLERK_JWT_TEMPLATE` in `.env.local`.
   If you already enabled Clerk's native Convex integration, leave it blank.

6. Start Convex and generate backend types:

```sh
bun run convex:dev
```

7. In a second terminal, start the frontend:

```sh
bun run dev
```

## Quality checks

```sh
bun run check
bun run lint
bun run validate
```

## Current Phase 1 scope

- Landing page
- Sign in and sign up routes
- Authenticated app shell
- Manual daily log entry form
- Realtime dashboard timeline
- Day-one Biome and GitHub Actions CI setup
