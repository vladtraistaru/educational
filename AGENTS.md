# AGENTS.md

## Project

Open-source educational platform for primary school children and beyond. All code is AI-driven.

## Tech Stack

- **Framework**: Next.js (App Router) — simplest path for Vercel deployment
- **Language**: TypeScript
- **Styling**: Pico CSS (base) + CSS Modules (component overrides) — no Tailwind, no CSS-in-JS
- **Hosting**: Vercel — zero-config deployment with Next.js
- **Backend**: Supabase (see below)

### Why Next.js

Vercel built it. Deployment is automatic. File-based routing keeps each educational tool in its own folder. Supabase has official Next.js helpers. AI tools generate it well.

## Supabase

Use Supabase as the single backend. It covers:

- **Database** — Postgres for storing user progress, scores, tool configurations
- **Auth** — email/password and social logins for students and teachers
- **Storage** — file buckets for images, media, and educational assets
- **Realtime** — live updates if needed (e.g. classroom activities)
- **Edge Functions** — serverless logic if needed
- **Row Level Security** — control who sees what at the database level

Use the Supabase JS client (`@supabase/supabase-js`) and the official `@supabase/ssr` helper for Next.js.

## Principles

1. **Simplicity first** — the simplest solution that works is the right one
2. **No unnecessary dependencies** — add a package only when it solves a real problem
3. **Small files** — keep components under 200 lines
4. **Minimal comments** — code should be self-explanatory
5. **No over-engineering** — no complex abstractions, no excessive defensive coding

## Project Structure

```
/app
  /page.tsx                         — homepage: grades grid
  /[grade]/page.tsx                 — shows subjects for a grade
  /[grade]/[subject]/page.tsx       — shows activity cards for grade+subject
  /activity/[slug]/page.tsx         — renders the actual activity

/components                         — shared UI (GradeCard, ModuleCard, Breadcrumb)

/modules
  /module-name/
    config.ts                       — metadata (title, subject, grades, description)
    Activity.tsx                    — the interactive component
  registry.ts                       — central list of all module configs
  components.ts                     — lazy component loader for activities

/lib
  types.ts                          — ModuleConfig type, Subject, Grade labels
  supabase.ts                       — Supabase client setup

/public
  /modules/module-name/             — static files for vanilla HTML/JS modules
```

### Adding a Module

1. Create `/modules/my-activity/config.ts` with metadata
2. Create `/modules/my-activity/Activity.tsx` with the interactive component
3. Add one import line in `/modules/registry.ts`
4. Add one entry in `/modules/components.ts`
5. Done — it appears on the homepage under the right grade and subject

### Navigation

- `/` — grid of grades (Reception, Year 1, Year 2, ...)
- `/1` — subjects available in Year 1
- `/1/mathematics` — activity cards for Year 1 Mathematics
- `/activity/number-scale-explorer` — the actual activity (flat URL, stable)

## Deployment

Push to `main` → Vercel auto-deploys. No manual build steps.

Environment variables needed:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
