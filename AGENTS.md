# AGENTS.md

## Project

Open-source educational platform for primary school children and beyond. Interactive activities organized by subject and difficulty. Supports English and French.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Pico CSS (base) + CSS Modules (component overrides) — no Tailwind, no CSS-in-JS
- **Hosting**: Vercel — push to `main` auto-deploys
- **Backend**: Supabase is planned but not yet implemented — no Supabase client or env vars exist in the codebase

## Principles

1. **Simplicity first** — the simplest solution that works is the right one
2. **No unnecessary dependencies** — add a package only when it solves a real problem
3. **Small files** — keep components under 200 lines
4. **Minimal comments** — code should be self-explanatory
5. **No over-engineering** — no complex abstractions, no excessive defensive coding

## Project Structure

```
/app          — Next.js App Router pages and layouts
/components   — shared UI components
/modules      — educational activity modules (one folder per activity)
/lib          — types, utilities, language helpers
/public       — static assets
```

## Routing

Two routes exist:

- `/` — homepage: groups all modules by subject, sorted by difficulty within each subject
- `/activity/[slug]` — activity page: renders one module by its slug (flat URL, stable)

There are no grade-based routes. No `/[grade]` or `/[subject]` dynamic segments.

## The Module System

Every educational activity is a self-contained **module** — a folder inside `/modules/`. Modules are independent: they export metadata, translations, and a React component. The platform discovers them through the registry.

### Required files per module

```
/modules/my-activity/
  config.ts          — exports a ModuleConfig object
  Activity.tsx       — default-exports the React component
  index.ts           — barrel: re-exports config, translations, dynamic component
  translations.ts    — Record<Language, { title, description, ...custom keys }>
```

### Optional files

```
  Activity.module.css   — scoped styles (most modules have this)
  SomeComponent.tsx     — sub-components to keep files under 200 lines
```

### Registration

All modules are registered in `/modules/registry.ts`. Each module is imported as a namespace (`import * as myActivity from './my-activity'`) and added to the `moduleEntries` array. The registry exports:

- `getAllModules()` — all configs, sorted by difficulty
- `getModulesBySubject(subject)` — configs filtered by subject
- `getAllSubjects()` — unique subject list
- `getModuleBySlug(slug)` — single config lookup
- `getActivityComponent(slug)` — the React component for a slug
- `getModuleMetadata(slug, lang)` — translated title + description

## Adding a New Module

### 1. Create config

```typescript
// modules/my-activity/config.ts
import { ModuleConfig } from '@/lib/types';

export const config: ModuleConfig = {
  slug: 'my-activity',
  title: 'My Activity',
  description: 'What this activity teaches',
  subject: 'mathematics',
  difficulty: 3,
};
```

`subject` must be one of: `'mathematics' | 'science' | 'literacy' | 'geography' | 'history' | 'art' | 'physics'`.

`difficulty` is 1 (easiest) to 10 (hardest). It controls sort order on the homepage.

### 2. Create translations

```typescript
// modules/my-activity/translations.ts
import type { Language } from '@/lib/language';

const translations: Record<Language, { title: string; description: string }> = {
  en: { title: 'My Activity', description: 'What this activity teaches' },
  fr: { title: 'Mon Activité', description: 'Ce que cette activité enseigne' },
};
export default translations;
```

The `title` and `description` keys are required (used by the registry for metadata). You can add module-specific keys — define a custom interface extending `{ title: string; description: string }` and use it in your Activity component.

### 3. Create the activity component

```typescript
// modules/my-activity/Activity.tsx
'use client';

import type { ActivityProps } from '@/lib/types';
import shared from '@/modules/activity.module.css';

export default function Activity({}: ActivityProps) {
  return (
    <div className={shared.activityArea}>
      {/* Your interactive activity */}
    </div>
  );
}
```

Activity components are always client components (`'use client'`). They manage their own state and UI. They are automatically wrapped in `ActivityShell` by the platform — do not wrap them yourself.

### 4. Create the barrel export

```typescript
// modules/my-activity/index.ts
import dynamic from 'next/dynamic';
export { config } from './config';
export { default as translations } from './translations';
export const component = dynamic(() => import('./Activity'));
```

This exact pattern is required. The registry imports the namespace and expects `config`, `translations`, and `component`.

### 5. Register in the registry

In `/modules/registry.ts`:

```typescript
import * as myActivity from './my-activity';
```

Then add `myActivity` to the `moduleEntries` array.

Done — the module appears on the homepage under its subject, sorted by difficulty.

## Language / i18n

Languages: `'en' | 'fr'` (defined in `/lib/language-config.ts`).

How it works:
- Language preference is stored in a cookie (`lang`)
- Server side: `getLanguage()` from `/lib/language-server.ts` reads the cookie
- Client side: `useLanguage()` from `/lib/language.tsx` returns `{ language, setLanguage }`
- Root layout wraps everything in `<LanguageProvider initialLanguage={lang}>`
- The `LanguageSelector` component (in the header) lets users switch

Modules provide translations via `translations.ts`. The registry uses `title` and `description` for metadata. Activity components can import their own `translations` and use `useLanguage()` to access the current language and all their custom keys.

## Shared Styles

`/modules/activity.module.css` provides reusable classes that all modules should use for visual consistency:

| Class | Purpose |
|-------|---------|
| `.activityArea` | Main activity container (min-height, padding, card background, shadow) |
| `.controlsBar` | Horizontal bar for controls (flex, wrap, card style) |
| `.controlGroup` | Group of related controls with label |
| `.controlButtons` | Flex container for action buttons |
| `.btn` | Base button (bold, rounded, 48px min-height, press animation) |
| `.btnPrimary` | Green button (#00b894) |
| `.btnDanger` | Red button (#e17055) |
| `.btnSecondary` | Purple button (#6c5ce7) |
| `.feedbackCorrect` | Green text for correct answers |
| `.feedbackIncorrect` | Red text for incorrect answers |

Import as: `import shared from '@/modules/activity.module.css';`

## Key Types

From `/lib/types.ts`:

```typescript
type Subject = 'mathematics' | 'science' | 'literacy' | 'geography' | 'history' | 'art' | 'physics';

interface ModuleConfig {
  slug: string;
  title: string;
  description: string;
  subject: Subject;
  difficulty: number;       // 1 (easiest) to 10 (hardest)
  icon?: string;
  estimatedMinutes?: number;
}

interface ActivityProps {}   // empty, extensible
```

From `/lib/language-config.ts`:

```typescript
type Language = 'en' | 'fr';
```

Label maps: `SUBJECT_LABELS` (per-language subject names) and `UI_LABELS` (per-language UI strings) are in `/lib/types.ts`.

## Shared Components

In `/components`:

| Component | Role |
|-----------|------|
| `ActivityShell` | Wraps every activity with description + consistent layout. Applied automatically by `ActivityLoader` — modules do not use it directly. |
| `Header` | Top bar: breadcrumbs + language selector |
| `Footer` | Footer: open-source note, GitHub link, feedback dialog |
| `Breadcrumb` | Syncs breadcrumb state from route |
| `ModuleCard` | Card linking to an activity (title, description, difficulty) |
| `LanguageSelector` | Dropdown to switch language |

## App Layout

The root layout (`/app/layout.tsx`) provides:
- `<LanguageProvider>` — wraps everything with language context
- `<BreadcrumbProvider>` — breadcrumb state
- `<Header>` and `<Footer>` — consistent chrome
- `<main className="container">` — Pico CSS container around page content

## How an Activity Loads

1. User navigates to `/activity/[slug]`
2. `page.tsx` (server component) looks up the module config and translated metadata, renders breadcrumb + title + `<ActivityLoader>`
3. `ActivityLoader.tsx` (client component) calls `getActivityComponent(slug)` to get the dynamically imported component, wraps it in `<ActivityShell>`
4. The module's `Activity.tsx` renders with its own state and UI

## Server Actions

`/app/actions/feedback.ts` — a server action for sending feedback emails via Resend. No API routes exist.
