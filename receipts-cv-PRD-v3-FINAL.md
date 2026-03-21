# Product Requirements Document (PRD)
## receipts.cv — Prove Your Worth. Show Your Receipts.

**Version:** 3.0 — FINAL**
**Status:** Ready for Development
**Date:** March 2026

---

## 1. Executive Summary

receipts.cv is a web application that lets professionals log what they did at work each day in plain natural language. An LLM converts that raw input into a structured, searchable career record. The app surfaces this data as a clean timeline and generates ready-to-use talking points for 1-on-1s, performance reviews, and raise conversations.

**Core value proposition:**
You never lose track of your wins. You walk into every career conversation — 1-on-1s, reviews, raise discussions — fully prepared and with receipts.

**Domain:** receipts.cv
**Tagline:** Prove your worth. Show your receipts.

---

## 2. Problem Statement

Professionals consistently undervalue and under-document their own work. This leads to:

- Blanking on "what did you accomplish this quarter?" during performance reviews
- Forgetting specific wins, metrics, and contributions when negotiating a raise
- Walking into 1-on-1s underprepared with vague talking points
- Losing career leverage because good work stays invisible

Existing tools are either too generic (Notion, journaling apps) or too team-focused (WorkJourney). There is no opinionated, AI-first, career-growth-focused personal work log built for individual contributors.

---

## 3. Target Users

**Primary — The Individual Contributor (IC)**
Software engineers, PMs, designers, analysts — 3–12 years into their career. Works at a company with regular 1-on-1s and annual or bi-annual reviews. Wants promotions and raises but doesn't self-promote naturally. Values fast, well-designed tools.

**Secondary — The Career-Aware Professional**
Anyone building a personal record of their work history across jobs. People preparing for a job search who need to reconstruct and articulate their impact.

---

## 4. Goals & Success Metrics

| Goal | Metric | Target (6 months post-launch) |
|------|--------|-------------------------------|
| Users log regularly | DAU/MAU ratio | > 40% |
| Core feature is used | "Generate report" usage among active users | > 60% |
| AI output is trusted | Edit rate on AI-structured entries | < 30% |
| Retention | 30-day retention | > 50% |
| Monetization | Free-to-Pro conversion rate | > 8% |

---

## 5. Finalized Tech Stack

All TypeScript. Bun as the package manager and runtime. One-command deployable. Zero servers to manage.

| Layer | Choice | Version / Notes |
|-------|--------|-----------------|
| Package Manager / Runtime | **Bun** | Replaces npm/node. `bun install`, `bunx convex dev` |
| Framework | **SvelteKit** | Full-stack, compiler-based, ships minimal JS |
| Backend / DB / Realtime | **Convex** | TypeScript-first BaaS — reactive queries, typed schema, auth hooks, file storage, scheduled functions, auto-deploys on push |
| Auth | **Clerk** | Polished UI, Google + GitHub OAuth, magic link email, JWT integration with Convex via official plugin |
| Styling | **Tailwind CSS v4** | Utility-first, pairs naturally with Svelte |
| UI Components | **shadcn-svelte** | Accessible, unstyled primitives — Svelte port of shadcn/ui |
| AI — Entry Structuring | **Claude Haiku** (`claude-haiku-4-5-20251001`) | Fast, cheap (~$0.05/user/month at daily usage), called from Convex Action |
| AI — Reports & Raise Mode | **Claude Sonnet** (`claude-sonnet-4-6`) | Higher quality output for high-stakes career documents |
| Payments | **Stripe** | Checkout, webhooks, subscription management via Convex Action |
| Analytics | **Plausible** | Privacy-first, no cookie banner required, lightweight script |
| Error Monitoring | **Sentry** | JS SDK for SvelteKit frontend + Convex error logging |
| Frontend Deploy | **Vercel** | `vercel deploy`, SvelteKit adapter-vercel |
| Backend Deploy | **Convex Cloud** | Auto-deploys on `bunx convex deploy` or git push |

**Why this stack:**
- Unified TypeScript across schema, backend logic, and UI — AI-assisted development is maximally effective on a single typed codebase
- Convex eliminates REST API design, database provisioning, and WebSocket plumbing
- SvelteKit's compiler means minimal JS shipped to the browser — the app feels fast
- Bun is a drop-in npm replacement with 10–25x faster installs and a built-in test runner
- Everything has a generous free tier — you can reach hundreds of users at $0 infrastructure cost

---

## 6. Core Features — MVP (v1.0)

### 6.1 Daily Log Entry
- **Free-text input** — user types what they did today in plain, unstructured language. No format required.
- **AI Structuring** — on submit, a Convex Action calls Claude Haiku and returns structured JSON:
  - `summary` — one-sentence headline of the day
  - `tasks_completed` — list of concrete deliverables
  - `skills_demonstrated` — inferred skills (e.g. "led meeting" → leadership, "fixed bug" → debugging)
  - `impact` — quantifiable or qualitative outcome, or null if not mentioned
  - `blockers` — challenges or impediments, or null if not mentioned
  - `tags` — auto-generated project names and work category labels
- **Structured preview** — user sees the AI output before saving and can edit any field inline
- **Editable fields in preview:** summary, all items in tasks_completed, all skills, impact, blockers, all tags. User can add or remove items in any list field.
- **Date** — defaults to user's local date (see Section 9 — Timezone Handling). User can change it before saving.
- **Empty entry guard** — if raw input is blank or under 10 characters, show inline validation error. Do not call the AI.

### 6.2 Timeline View
- Reverse-chronological feed of all log entries
- Each card displays: local date, summary headline, tags as pills, expandable section for full detail (tasks, skills, impact, blockers)
- **Filters:** date range picker, tag filter (multi-select), keyword search (client-side against summary + tasks)
- **Reactive** — new entries appear instantly without page refresh (Convex live queries)
- **Empty state** — if the user has no entries yet, show a welcoming prompt explaining what to log and a large "Log Today" CTA button. Do not show an empty list.

### 6.3 Talking Points Generator (Free — 3 generations/month)
- User selects a date range using a date range picker
- **Guard:** if the selected range contains zero entries, show an inline message: "No entries found for this period. Try a different date range." Do not call the AI.
- **Guard:** if the selected range spans more than 90 days, show a warning: "For best results, select a range under 90 days." Allow user to proceed anyway but chunk entries (see Section 9 — Token Limit Handling).
- Convex Action calls Claude Sonnet and generates:
  - `talking_points` — 3–5 concise bullet strings (accomplishments + blockers needing manager input)
  - `narrative` — 2–3 sentence summary paragraph
- Output is displayed with a one-click **Copy All** button
- Counts against the user's monthly generation quota

### 6.4 Raise & Review Mode (Pro only)
- User selects a date range (recommended: last 3–6 months)
- Same empty range guard and 90-day chunking logic as 6.3
- Claude Sonnet generates:
  - `impact_highlights` — top 3–5 wins with evidence from entries
  - `skills` — consistently demonstrated skills with brief examples
  - `raise_talking_points` — 4–6 assertive, career-coach-style bullets
  - `growth_narrative` — 2–3 sentence paragraph on progression
- Output is displayed section by section with individual Copy buttons per section and a Copy All button
- Gate enforcement: checked server-side in the Convex Action by reading `userSubscriptions` before invoking Claude. Never enforce gates only in the UI.

### 6.5 Authentication
- Clerk handles all auth: Google OAuth, GitHub OAuth, magic link email
- New users are automatically created in Convex `users` table via Clerk webhook on first sign-in
- All entries are private by default — no sharing, no team features in v1

### 6.6 Subscription Management
- Free tier: unlimited entry logging + AI structuring, 90-day history, 3 report generations/month
- Pro tier ($10/month or $99/year): unlimited report generations, full history (beyond 90 days), Raise Mode access
- Stripe Checkout handles payment. Convex webhook handler updates `userSubscriptions` table on successful payment and on cancellation.
- Users can manage/cancel their subscription from a Settings page (Stripe Customer Portal link)
- **Pro gate UI:** Raise Mode entry points show a lock icon and "Upgrade to Pro" CTA for free users. Clicking it opens Stripe Checkout.

---

## 7. Features Explicitly Out of Scope — v1

| Feature | Reason | Target |
|---------|--------|--------|
| Email notifications / reminders | Adds infrastructure complexity before retention is validated | v2 |
| Calendar integration (Google, Outlook) | Significant OAuth + API scope | v2 |
| Data export (PDF, DOCX) | Useful but not core to the AI loop | v2 |
| Jira / Linear / Slack integrations | Scope creep | v2+ |
| Mobile native app | Web-first, PWA consideration in v2 | v2 |
| Public sharing or social features | Not aligned with private-first positioning | v3 |
| Prompt A/B testing | Premature for MVP | v2 |
| Team / manager collaboration | Different product surface area | v3 |
| Voice input | Nice-to-have, can be added in a sprint | v1.5 |

---

## 8. Monetization

**Model:** Usage-based freemium with a Pro tier.

| Tier | Price | What You Get |
|------|-------|--------------|
| Free | $0 forever | Unlimited entry logging, unlimited AI structuring, 90-day history, 3 report generations/month |
| Pro | $10/month or $99/year | Everything in Free + unlimited report generations, full history, Raise Mode |

**Pricing rationale:**
- Free tier gives the full core habit loop at no cost. Structuring entries with Haiku costs ~$0.05/user/month — this is affordable to offer free indefinitely.
- The 3 free report generations are enough to feel the value of the product (one talking points session, one weekly summary, one experiment with the output).
- Raise Mode is Pro-only from day one. It is the highest-intent feature — users open it before a performance review when they are already motivated to pay.
- $10/month signals a serious, trustworthy tool. $99/year (~17% discount) improves cash flow and reduces churn.

**Unit economics:**
- Haiku structuring: ~$0.002/entry × 22 workdays = ~$0.04/user/month
- Sonnet reports: ~$0.05/generation × assume 10/month for heavy Pro users = ~$0.50/user/month
- At $10/month Pro, gross margin on AI costs alone is ~95%

**Gate enforcement location:** Server-side in Convex Actions only. UI gates (lock icons, upgrade CTAs) are for UX — never the sole enforcement mechanism.

---

## 9. Technical Decisions & Edge Cases

### Timezone Handling
- Entry date is determined by the **user's local browser timezone** at the time of submission
- The SvelteKit frontend sends the local date string (`YYYY-MM-DD`) to the Convex mutation — not a UTC timestamp
- `createdAt` and `updatedAt` fields store UTC Unix timestamps for auditing
- This prevents the off-by-one date bug where a user logging at 11pm their time gets an entry dated the next day

### Token Limit Handling (Report Generation)
- Before sending entries to Claude Sonnet, count approximate tokens: estimate 250 tokens per entry
- If total estimated tokens exceeds 80,000 (safe limit for Sonnet's context window), chunk the entries into groups and summarize each group first, then synthesize summaries
- The chunking logic lives in the Convex Action, not the frontend
- For v1, the 90-day soft warning covers most cases. Hard chunking is a safety net.

### LLM Error Handling & Fallbacks
- All Claude API calls are wrapped in try/catch inside Convex Actions
- If `JSON.parse()` fails on the Haiku response (malformed output), retry once with an explicit "return only raw JSON, no other text" instruction appended
- If the retry also fails, return the raw input as the `summary` field with all other fields as empty arrays/null, and flag the entry as `structuringFailed: true` in the schema
- If a Sonnet report generation fails, surface a user-facing error: "Something went wrong generating your report. Please try again." Do not silently fail.
- Convex Action timeouts: set a 30-second timeout on all AI calls. Surface timeout as the same user-facing error message.

### Rate Limiting & Abuse Prevention
- Monthly generation quota is enforced in the Convex Action by reading the user's `generationUsage` record before invoking Claude
- Free users: if `reportsThisMonth >= 3`, return an error with upgrade prompt. Do not call Claude.
- `reportsThisMonth` resets via a Convex scheduled function that runs on the 1st of each month at 00:00 UTC
- No rate limiting on entry structuring calls in v1 (Haiku cost is negligible). Revisit if abuse is detected.

### Stripe Gate Enforcement
- Every Pro-gated Convex Action reads `userSubscriptions` by `userId` before executing
- Check: `plan === "pro"` AND `currentPeriodEnd > Date.now()`
- If either check fails, return a structured error that the frontend maps to the upgrade flow
- Never trust the frontend to tell the backend whether a user is Pro

---

## 10. Data Model (Convex Schema)

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // Created automatically via Clerk webhook on first sign-in
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  logEntries: defineTable({
    userId: v.string(),              // Clerk user ID
    entryDate: v.string(),           // "YYYY-MM-DD" — user's local date
    rawInput: v.string(),            // Original unstructured text
    summary: v.optional(v.string()),
    tasksCompleted: v.optional(v.array(v.string())),
    skillsDemonstrated: v.optional(v.array(v.string())),
    impact: v.optional(v.string()),
    blockers: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    structuringFailed: v.optional(v.boolean()), // true if AI structuring failed
    createdAt: v.number(),           // UTC Unix timestamp
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "entryDate"]),

  generatedReports: defineTable({
    userId: v.string(),
    reportType: v.union(
      v.literal("one_on_one"),
      v.literal("weekly"),
      v.literal("raise"),
      v.literal("review")
    ),
    dateFrom: v.string(),            // "YYYY-MM-DD"
    dateTo: v.string(),              // "YYYY-MM-DD"
    content: v.string(),             // JSON string of the generated output
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Tracks monthly report generation usage for quota enforcement
  generationUsage: defineTable({
    userId: v.string(),
    monthKey: v.string(),            // "YYYY-MM" — resets monthly
    reportsGenerated: v.number(),
  })
    .index("by_user_month", ["userId", "monthKey"]),

  userSubscriptions: defineTable({
    userId: v.string(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    currentPeriodEnd: v.optional(v.number()), // UTC Unix timestamp
  })
    .index("by_user", ["userId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

});
```

---

## 11. LLM Prompts

### Entry Structuring — System Prompt (Claude Haiku)
```
You are a career journaling assistant. The user will give you raw notes about their workday.
Extract and return ONLY a valid JSON object. No preamble. No markdown fences. No explanation.

Required schema:
{
  "summary": "one sentence headline of the day",
  "tasks_completed": ["concrete deliverable 1", "concrete deliverable 2"],
  "skills_demonstrated": ["skill 1", "skill 2"],
  "impact": "any impact or outcome mentioned, or null",
  "blockers": "any blockers or challenges, or null",
  "tags": ["project name or category tag 1", "tag 2"]
}

Rules:
- Do not invent facts not stated by the user.
- Infer skills from context: "led standup" → "leadership", "reviewed PR" → "code review", "wrote design doc" → "technical writing", "unblocked a teammate" → "collaboration"
- Tags should be project names or work categories (e.g. "backend", "onboarding", "Q2 planning", "hiring")
- Return null (not a string) for impact and blockers if not mentioned
- tasks_completed should be specific and action-oriented, not vague
```

### Retry Suffix (appended on first parse failure)
```
IMPORTANT: Your previous response could not be parsed as JSON.
Return ONLY the raw JSON object. No backticks. No "```json". No text before or after the JSON.
```

### Talking Points — System Prompt (Claude Sonnet)
```
You are a career coach helping a professional prepare for a 1-on-1 with their manager.
You will receive a JSON array of work log entries for a specific date range.
Generate and return ONLY a valid JSON object. No preamble. No markdown fences.

Required schema:
{
  "talking_points": ["bullet 1", "bullet 2", "bullet 3"],
  "narrative": "2-3 sentence summary paragraph"
}

Rules:
- talking_points: 3–5 items. Specific, confident, past-tense accomplishments.
- Include one item for any blockers that need manager input, if present in the entries.
- Use project names and numbers when available in the entries.
- narrative: professional tone, reads naturally when said aloud in a meeting.
- Do not invent facts not present in the entries.
```

### Raise Mode — System Prompt (Claude Sonnet)
```
You are a career coach helping a professional make the case for a raise or promotion.
You will receive a JSON array of work log entries spanning several months.
Generate and return ONLY a valid JSON object. No preamble. No markdown fences.

Required schema:
{
  "impact_highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "skills": [{"skill": "skill name", "example": "brief example from entries"}],
  "raise_talking_points": ["point 1", "point 2", "point 3", "point 4"],
  "growth_narrative": "2-3 sentence paragraph on progression and growth"
}

Rules:
- impact_highlights: 3–5 items. Lead with the biggest, most concrete wins. Use numbers if present.
- skills: 4–8 skills with a one-sentence example each drawn from the entries.
- raise_talking_points: 4–6 items. Assertive tone. Frame as value delivered to the company, not personal need.
- growth_narrative: shows arc of progression. Confident but not arrogant.
- Do not invent facts not present in the entries.
```

---

## 12. Project Structure

```
receipts-cv/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte            # Root layout, Clerk provider
│   │   ├── +page.svelte              # Landing page
│   │   ├── dashboard/
│   │   │   └── +page.svelte          # Timeline view (protected)
│   │   ├── entry/
│   │   │   └── new/
│   │   │       └── +page.svelte      # New entry form + AI preview
│   │   ├── generate/
│   │   │   └── +page.svelte          # Talking points + Raise Mode
│   │   └── settings/
│   │       └── +page.svelte          # Subscription management, Stripe portal
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn-svelte primitives
│   │   │   ├── EntryCard.svelte      # Timeline entry card
│   │   │   ├── EntryForm.svelte      # Raw input + structured preview
│   │   │   ├── ReportOutput.svelte   # Generated report display + copy
│   │   │   └── UpgradePrompt.svelte  # Pro gate CTA
│   │   ├── stores/                   # Svelte stores for UI state
│   │   └── utils.ts                  # Date helpers, token estimator
├── convex/
│   ├── schema.ts                     # Single source of truth for all tables
│   ├── users.ts                      # User creation via Clerk webhook
│   ├── logEntries.ts                 # Queries + mutations for entries
│   ├── generationUsage.ts            # Quota tracking helpers
│   ├── actions/
│   │   ├── structureEntry.ts         # Claude Haiku call
│   │   ├── generateReport.ts         # Claude Sonnet call (talking points + raise)
│   │   └── stripe.ts                 # Stripe Checkout + webhook handler
│   ├── crons.ts                      # Monthly quota reset scheduled function
│   └── _generated/                   # Auto-generated by Convex CLI (do not edit)
├── convex.json
├── svelte.config.js
├── tailwind.config.ts
├── bunfig.toml                       # Bun configuration
└── package.json
```

---

## 13. Environment Variables

```bash
# .env.local — never commit this file

# Clerk
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Convex
PUBLIC_CONVEX_URL=https://...convex.cloud

# Set in Convex dashboard (not in .env — these run server-side in Convex Actions)
# ANTHROPIC_API_KEY
# STRIPE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET
```

Note: `ANTHROPIC_API_KEY` and Stripe keys are set as Convex environment variables in the Convex dashboard, not in the local `.env` file. They are never exposed to the SvelteKit frontend.

---

## 14. Local Development Setup

```bash
# Prerequisites: Bun installed (https://bun.sh)

# 1. Clone and install
git clone https://github.com/yourusername/receipts-cv
cd receipts-cv
bun install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in Clerk keys from dashboard.clerk.com
# Fill in PUBLIC_CONVEX_URL after step 3

# 3. Start Convex dev server (opens browser to set up project)
bunx convex dev

# 4. Set Anthropic + Stripe keys in Convex dashboard (Environment Variables section)

# 5. Start SvelteKit dev server
bun run dev

# App runs at http://localhost:5173
# Convex dashboard at https://dashboard.convex.dev
```

---

## 15. Deployment

```bash
# Deploy Convex backend
bunx convex deploy

# Deploy SvelteKit frontend to Vercel
# Option A: Connect GitHub repo to Vercel — auto-deploys on push to main
# Option B: Manual deploy
bunx vercel deploy --prod
```

Both commands are idempotent and safe to run repeatedly. No migration scripts. No server restarts.

---

## 16. Build Milestones

### Week 1–2: Scaffold & Auth
- Init SvelteKit + Convex + Clerk with Bun
- Wire Clerk auth end-to-end (sign in, sign out, protected routes)
- Define full schema in `convex/schema.ts`
- Build basic CRUD for `logEntries` (mutations + queries)
- Build entry form UI — raw text input, save to Convex, display on timeline
- No AI yet — validate the data layer first

### Week 3–4: The AI Loop
- Implement `structureEntry` Convex Action with Claude Haiku
- Build structured preview/edit UI before saving
- Implement retry logic and `structuringFailed` fallback
- Tags and skill pills displayed on timeline cards
- Filter by date range and tag

### Week 5–6: Intelligence Layer + Payments
- Implement `generateReport` Action for talking points (Sonnet)
- Implement Raise Mode generation
- Date range selector UI with empty-range and 90-day guards
- Stripe Checkout + webhook handler
- `generationUsage` quota tracking and reset cron
- Pro gate on Raise Mode — server-side enforcement

### Week 7–8: Polish, Analytics & Launch
- Sentry SDK integration (SvelteKit + Convex error capture)
- Plausible analytics script in root layout
- Settings page with Stripe Customer Portal link
- Mobile-responsive layout pass
- Empty states, loading skeletons, error boundary components
- Onboarding flow for new users (3-step explainer on first login)
- Deploy to production domain: receipts.cv
- Launch post

---

## 17. Open Source Strategy

**License: Business Source License (BSL 1.1)**

- Free for personal use and self-hosting
- Not licensed for commercial use (competitors cannot clone and sell)
- Converts to MIT after 4 years (standard BSL terms)

This gives receipts.cv full portfolio and trust benefits of open source — auditable privacy, GitHub presence, community visibility — without giving competitors a free product to fork.

A `SELF_HOSTING.md` guide will be added to the repo at launch covering environment variable setup and one-click Railway/Render deployment as an alternative to Convex Cloud.

---

## 18. Competitive Differentiation

| Feature | receipts.cv | WorkJourney | Notion |
|---------|------------|-------------|--------|
| AI structuring of raw notes | ✅ | Partial | ❌ |
| Raise talking points generator | ✅ | ❌ | ❌ |
| 1-on-1 prep mode | ✅ | Partial | ❌ |
| Raise Mode — career coach output | ✅ | ❌ | ❌ |
| Individual-only, private by default | ✅ | ❌ (team-focused) | ✅ |
| Reactive real-time timeline | ✅ | ❌ | Partial |
| Minimal JS, fast load (SvelteKit) | ✅ | ❌ | ❌ |
| Memorable brand & domain | ✅ (.cv TLD) | ❌ | N/A |
| One-click deploy, zero infra | ✅ | N/A | N/A |

---

## 19. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Users don't log daily (habit problem) | High | Frictionless entry (< 60 sec target), streak counter in timeline header, empty state CTAs on every visit |
| LLM returns invalid JSON | Medium | Retry with explicit JSON-only instruction; fallback to raw input as summary with `structuringFailed` flag |
| Token limit exceeded on long date ranges | Low | 90-day soft warning + hard chunking logic in Convex Action |
| Stripe webhook missed (subscription not updated) | Low | Idempotent webhook handler; Convex scheduled function to re-sync Stripe subscription status daily |
| Clerk pricing at scale | Low | Clerk free tier covers 10,000 MAU — plenty of runway |
| Convex vendor lock-in | Low | Schema is portable TypeScript; data is exportable from Convex dashboard at any time |

---

*Version 3.0 — Final. All decisions locked. Ready to scaffold.*
