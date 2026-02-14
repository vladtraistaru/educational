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
/app                                — Next.js App Router pages
/components                         — shared UI components
/modules                            — educational activity modules
/lib                                — types, utilities, Supabase client
/public                             — static assets
```

### How the Platform Works

The platform is a modular system. Each educational activity (e.g. "Number Scale Explorer") is a **module** — a self-contained folder inside `/modules/`. The homepage reads all module configs and organizes them into a hierarchy: **grade > subject > activity**.

Users navigate: homepage (pick a grade) → grade page (pick a subject) → subject page (pick an activity) → activity page (the interactive tool).

### `/app` — Pages (Next.js App Router)

```
/app
  /page.tsx                         — homepage: shows a grid of grade cards
  /[grade]/page.tsx                 — grade page: shows subjects available for that grade
  /[grade]/[subject]/page.tsx       — subject page: shows activity cards for that grade+subject
  /activity/[slug]/page.tsx         — activity page: renders the actual interactive module
  /activity/[slug]/ActivityLoader.tsx — client component that lazy-loads the module component
  /layout.tsx                       — root layout (Pico CSS, metadata)
  /globals.css                      — global styles (imports Pico CSS)
```

The `[grade]`, `[subject]`, and `[slug]` folders are dynamic routes. The grade is a number (0 = Reception, 1 = Year 1, etc.). The subject is a string like `mathematics`. The slug is the module's unique identifier like `number-scale-explorer`.

Activity URLs are flat (`/activity/[slug]`) so they stay stable even if a module's grade assignment changes.

### `/modules` — Educational Activity Modules

```
/modules
  /number-scale-explorer/           — one module = one folder
    config.ts                       — metadata: slug, title, description, subject, grades
    Activity.tsx                    — top-level React component (state + composition)
    Activity.module.css             — scoped styles for this activity
    NumberLine.tsx                  — interactive number line with drag handling
    Controls.tsx                    — scale selector and action buttons
    BreakdownPanel.tsx             — segment summary and equation
  registry.ts                       — imports all configs + components, exports helpers
  activity.module.css               — shared design tokens and reusable classes for all modules
```

Every module has exactly two required files:
- **`config.ts`** — exports a `ModuleConfig` object with `slug`, `title`, `description`, `subject`, and `grades[]`
- **`Activity.tsx`** — exports the default React component that IS the activity (accepts `ActivityProps`)

Modules can have additional sub-components (like `NumberLine.tsx`, `Controls.tsx`) to keep files under 200 lines.

**`registry.ts`** is the single registration file. It imports each module's config and lazy-loads its component via `dynamic()`. It exports helper functions: `getAllGrades()`, `getModulesByGrade()`, `getModulesByGradeAndSubject()`, `getModuleBySlug()`, `getActivityComponent()`.

**`activity.module.css`** provides shared design tokens and reusable CSS classes (buttons, controls bar, feedback colors, activity area) that all modules import for visual consistency.

### `/components` — Shared UI

```
/components
  ActivityShell.tsx                 — wraps every activity with consistent layout
  ActivityShell.module.css          — shell styles
  GradeCard.tsx                     — card linking to a grade page
  ModuleCard.tsx                    — card linking to an activity
  Breadcrumb.tsx                    — breadcrumb navigation
```

**`ActivityShell`** is applied automatically by `ActivityLoader` — it wraps every activity component with a consistent container, optional description, and standard spacing. Individual modules do not need to use it directly.

### `/lib` — Types and Utilities

```
/lib
  types.ts                          — ModuleConfig, ActivityProps, Subject type, label maps
```

- `Subject` — union type of subjects
- `ModuleConfig` — metadata for each module (slug, title, description, subject, grades, optional icon and estimatedMinutes)
- `ActivityProps` — standard props interface for all activity components (empty for now, extensible)
- `SUBJECT_LABELS`, `GRADE_LABELS` — human-readable display labels

### Adding a New Module

1. Create `/modules/my-activity/config.ts` — export a `ModuleConfig`
2. Create `/modules/my-activity/Activity.tsx` — export a default component accepting `ActivityProps`
3. Add one entry in `/modules/registry.ts` (import config + add `{ config, component: dynamic(...) }` to the array)
4. Done — it auto-appears on the homepage under the correct grade and subject

Use shared styles from `activity.module.css` for buttons, controls, and layout to maintain visual consistency across modules.

### Navigation URLs

- `/` — grid of grades (Reception, Year 1, Year 2, ...)
- `/1` — subjects available in Year 1
- `/1/mathematics` — activity cards for Year 1 Mathematics
- `/activity/number-scale-explorer` — the actual activity (flat URL, stable)

## Deployment

Push to `main` → Vercel auto-deploys. No manual build steps.

Environment variables needed:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
