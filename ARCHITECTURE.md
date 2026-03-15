# Architecture

## What This Is

An educational platform for primary school children. It presents a collection of interactive activities — each one a self-contained module — organized by subject and difficulty. The platform supports multiple languages (English, French) via a cookie-based language preference.

## The Module System

The core idea: every educational activity is an independent **module** living in its own folder under `/modules/`. A module knows nothing about the platform around it — it just exports its metadata and a React component.

```
/modules/my-activity/
  config.ts          — ModuleConfig: slug, title, description, subject, difficulty
  Activity.tsx       — default-exported React component (the interactive tool)
  index.ts           — barrel: re-exports config, translations, and a dynamic() component
  translations.ts    — title + description per language
  *.module.css       — scoped styles (optional)
  OtherComponent.tsx — sub-components to keep files under 200 lines (optional)
```

All modules are registered in `/modules/registry.ts` — a single array of imports. The registry provides lookup functions (`getModuleBySlug`, `getActivityComponent`, `getAllModules`, etc.) that the rest of the app uses.

The platform reads the registry and builds the UI automatically: homepage groups modules by subject, and each activity gets a page at `/activity/[slug]`.

## Navigation Flow

```
/                        → homepage: all subjects with their activity cards
/activity/[slug]         → activity page: the interactive module
```

Activity URLs are flat (`/activity/number-scale-explorer`) so they stay stable regardless of how the module is categorized.

## How an Activity Loads

1. `/app/activity/[slug]/page.tsx` — server component. Looks up the module config by slug, resolves translated metadata, renders breadcrumb + title + `<ActivityLoader>`.
2. `ActivityLoader.tsx` — client component. Calls `getActivityComponent(slug)` which returns the `dynamic()` import. Wraps the component in `<ActivityShell>` (consistent layout, description).
3. The module's `Activity.tsx` renders. It manages its own state and UI.

## Shared Styles

`/modules/activity.module.css` provides shared design tokens and reusable CSS classes (buttons, controls bar, feedback colors, layout). Modules import from this file to stay visually consistent.

## Adding a New Module

1. Create `/modules/my-activity/config.ts`:

```typescript
import { ModuleConfig } from '@/lib/types';

export const config: ModuleConfig = {
  slug: 'my-activity',
  title: 'My Activity',
  description: 'What this activity teaches',
  subject: 'mathematics',
  difficulty: 3,
};
```

2. Create `/modules/my-activity/Activity.tsx` — default-export a React component:

```typescript
import type { ActivityProps } from '@/lib/types';

export default function Activity({}: ActivityProps) {
  return <div>Your interactive activity here</div>;
}
```

3. Create `/modules/my-activity/translations.ts`:

```typescript
const translations = {
  en: { title: 'My Activity', description: 'What this activity teaches' },
  fr: { title: 'Mon Activité', description: 'Ce que cette activité enseigne' },
};
export default translations;
```

4. Create `/modules/my-activity/index.ts`:

```typescript
import dynamic from 'next/dynamic';
export { config } from './config';
export { default as translations } from './translations';
export const component = dynamic(() => import('./Activity'));
```

5. Register it in `/modules/registry.ts` — add the import and append to the array.

The module now appears on the homepage under its subject, sorted by difficulty.

## Key Types

| Type | Purpose |
|------|---------|
| `ModuleConfig` | Metadata: slug, title, description, subject, difficulty, optional icon/estimatedMinutes |
| `ActivityProps` | Standard props interface for all activity components (empty, extensible) |
| `Subject` | Union type: `'mathematics' \| 'science' \| 'literacy' \| 'geography' \| 'history' \| 'art' \| 'physics'` |
| `Language` | `'en' \| 'fr'` |

## Conventions and Patterns

See [AGENTS.md](AGENTS.md) for tech stack, coding principles, step-by-step patterns, and all conventions that AI agents and contributors should follow.
