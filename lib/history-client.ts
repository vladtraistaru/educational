'use client';

import {
  HISTORY_COOKIE,
  MAX_HISTORY_ENTRIES,
  parseHistoryCookie,
  serializeHistoryCookie,
  type HistoryEntry,
} from './history-config';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

// Bumps (or creates) the visit count for `slug` in the recently-played
// cookie. Depth is approximated by how many times an activity has been
// opened — the platform has no shared in-activity progress API, so visit
// count is the one signal every module can offer for free.
export function recordVisit(slug: string): void {
  if (typeof document === 'undefined') return;

  const entries = parseHistoryCookie(readCookie(HISTORY_COOKIE));
  const now = Date.now();
  const existing = entries.find((e) => e.slug === slug);

  let next: HistoryEntry[];
  if (existing) {
    existing.visits += 1;
    existing.lastVisitedAt = now;
    next = entries;
  } else {
    next = [{ slug, visits: 1, lastVisitedAt: now }, ...entries];
  }
  next.sort((a, b) => b.lastVisitedAt - a.lastVisitedAt);
  next = next.slice(0, MAX_HISTORY_ENTRIES);

  document.cookie = `${HISTORY_COOKIE}=${serializeHistoryCookie(next)}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}
