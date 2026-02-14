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
    Activity.tsx                    — the React component for this activity
    Activity.module.css             — scoped styles for this activity
  /shape-sorter/                    — another module (placeholder)
    config.ts
    Activity.tsx
    Activity.module.css
  registry.ts                       — imports all configs, exports helper functions
  components.ts                     — maps slugs to lazy-loaded Activity components
```

Every module has exactly two required files:
- **`config.ts`** — exports a `ModuleConfig` object with `slug`, `title`, `description`, `subject`, and `grades[]`
- **`Activity.tsx`** — exports the default React component that IS the activity

**`registry.ts`** imports all module configs and provides helper functions: `getAllGrades()`, `getModulesByGrade()`, `getModulesByGradeAndSubject()`, `getModuleBySlug()`. The pages use these to build navigation.

**`components.ts`** maps each slug to a `dynamic(() => import(...))` call so activity components are lazy-loaded — the homepage never bundles heavy activity code.

### `/components` — Shared UI

```
/components
  GradeCard.tsx                     — card linking to a grade page
  ModuleCard.tsx                    — card linking to an activity
  Breadcrumb.tsx                    — breadcrumb navigation
```

These are used across multiple pages. Keep module-specific components inside the module folder instead.

### `/lib` — Types and Utilities

```
/lib
  types.ts                          — ModuleConfig interface, Subject type, label maps
```

`types.ts` defines the `Subject` union type (`mathematics | science | literacy | ...`), the `ModuleConfig` interface, and lookup maps for grade/subject display labels.

### `/public` — Static Files

```
/public
  /modules/number-scale-explorer/   — vanilla HTML/CSS/JS served as static files
    index.html
    app.js
    styles.css
    translations.js
```

Modules built with vanilla HTML/JS (not React) live here and are loaded via iframe in their `Activity.tsx`. This is how the original Number Scale Explorer works — zero rewrite, just embedded.

### Adding a New Module

1. Create `/modules/my-activity/config.ts` — export a `ModuleConfig` with slug, title, description, subject, grades
2. Create `/modules/my-activity/Activity.tsx` — export a default React component
3. Add one import line in `/modules/registry.ts` and add the config to the `modules` array
4. Add one entry in `/modules/components.ts` mapping the slug to a `dynamic()` import
5. Done — it auto-appears on the homepage under the correct grade and subject

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
