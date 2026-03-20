# receipts.cv

Phase 1 scaffold for `receipts.cv`: a private work log that helps professionals keep track of daily wins and turn them into career receipts.

## Stack

- SvelteKit 2 + Svelte 5
- Bun for package management and scripts
- Tailwind CSS v4
- Convex for database, backend functions, and realtime queries
- `svelte-clerk` for Clerk auth in SvelteKit
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

Optional if you want explicit route config:

- `PUBLIC_CLERK_SIGN_IN_URL`
- `PUBLIC_CLERK_SIGN_UP_URL`
- `PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `PUBLIC_CLERK_AFTER_SIGN_UP_URL`

4. In the Convex dashboard, add:

- `CLERK_FRONTEND_API_URL`

   Use the Frontend API URL shown after you activate the official Convex integration in Clerk.

5. Start Convex and generate backend types:

```sh
bun run convex:dev
```

6. In a second terminal, start the frontend:

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
